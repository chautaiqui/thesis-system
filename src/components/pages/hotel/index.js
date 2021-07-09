import React, {useContext, useReducer, useEffect} from 'react';
import { Button, Table, Modal, Form, Input, Row, Col, Select, Popover, message, TimePicker } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import {Carousel} from '3d-react-carousal';
import { User } from '@pkg/reducers';
import { cities } from '../../commons/city';
import { CustomUploadListImg, filerColumn, messageError, messageSuccess } from '../../commons';
import { _getRequest, postMethod, putMethod } from '@api';
const { confirm } = Modal;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 },
};

const HotelReducer = (state, action) => {
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
		return { ...state, data: action.data, behavior: 'stall' }
      case 'GET_DATA_ERROR':
		return { ...state, data: [], behavior: 'stall' };
      case 'TOOGLE_POPUP':
		return { ...state, popup: action.popup, behavior: action.behavior };
      case 'TOOGLE_VIEW':
		return { ...state, view: action.view, behavior: 'stall' };
      case 'RELOAD':
		return { ...state, behavior: 'init', popup: action.popup };
      default:
		return state;
  } 
}
const initState = {
	behavior: 'init',
	data: [],
	popup: {open: false, data: {}},
	view: {open: false, img: []},
}

export const Hotel = () => {
	const [ _user ] = useContext(User.context);
	const [ state, dispatch ] = useReducer(HotelReducer, initState);
	const [ loading, setLoading ] = React.useState(false);
	const [ form ] = Form.useForm();
	const col = [
		{
			title: 'Name',
			dataIndex: 'name',
			align: 'center',
			key: 'name', 
			fixed: 'left',
			...filerColumn([], 'name'),
      onFilter: (value, record) =>
          record.name
              ? record.name.toString().toLowerCase().includes(value.toLowerCase())
              : '',
		},
		{
			title: 'Capacity',
			dataIndex: 'capacity',
			align: 'center',
			key: 'capacity', 
		},
		{
			title: 'Price',
			dataIndex: 'averagePrice',
			align: 'center',
			key: 'averagePrice', 
			render: (text, record, index) => {
				return  <span>
					{record.averagePrice.avgValue.toLocaleString("it-IT", {
						style: "currency",
						currency: "VND",
					})}{" "}
				</span>
			}
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			align: 'center',
			key: 'phone', 
		},
		{
			title: 'Address',
			dataIndex: 'address',
			align: 'center',
			key: 'address',
			render: (text, record, index) => {
				var address = `${record.street} ${record.ward} ${record.district} ${record.province}`
			  return address
			}
		},
		{
			title: 'Description',
			dataIndex: 'description',
			align: 'center',
			key: 'description', 
			render: (text, record, index)=>{
				return [
					record.description. length > 30? (<Popover key="0" content={record.description}trigger="hover" style={{ width: '50%' }}>
						{record.description.slice(0,30) + '...'}
					</Popover>) : record.description
				]
			}
		},
		{
			title: 'Action',
			align: 'center',
			key: 'action',
			render: (text, record, index)=>{
				return [
					<Button key="0" icon={<PlayCircleOutlined />} 
						onClick={()=>{
							dispatch({
								type: 'TOOGLE_VIEW', view: {open: true, data: record.imgs}
							})
						}}
					></Button>,
					<Button key="1" icon={<EditOutlined />}
						onClick={()=>{
							dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:record}})
							form.setFieldsValue({
								name: record.name,
								capacity: record.capacity,
								averagePrice: record.averagePrice,
								phone: record.phone,
								description: record.description,
								province: record.province,
								district: record.district,
								street: record.street,
								ward: record.ward,
							});
						}}
					></Button>
				]
			} 
		}
	]
	const showConfirm = () => {
		confirm({
			title: 'Do you confirm last time?',
			icon: <CheckOutlined />,
			onOk() {
				setLoading(true);
				form.submit();
			}
		});
	}
	const { data, popup, view } = state;
	const getData = async () => {
		try {
			const res = await _getRequest('hotel');
			if(!res.success) {
				message.error(res.error);
				return;
			}
			dispatch({
				type: 'GET_DATA_SUCCESS', data: res.result.hotels
			});
		} catch (e) {
			message.error(e);
		}
	}
	useEffect(() => {
    switch (state.behavior) {
			case 'init':
				getData();
				return;
			case 'stall':
				return ;
			default:
				break;
    }
  }, [state.behavior])

	const onFinish = (values) => {
		console.log(values);
		var data = new FormData();
		if(values.province && typeof values.province === 'number') {
			var _p = cities.province.find(item=>Number(item.idProvince) === values.province)
			data.append('province', _p.name)
		}
		if(values.district && typeof values.district === 'number') {
			var _dd = cities.district.find(item=>Number(item.idDistrict) === values.district)
			console.log(_dd)
			data.append('district', _dd.name)
		}
		var temp = {...values, imgs: undefined, time: undefined, province: undefined, district: undefined}
		for (const [key, value] of Object.entries(temp)){
			if(value) {
				data.append(key, value)
			}
		}
		// axios
		var myHeaders = new Headers(); 
		myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
		const action = async () => {
			try {
				if(popup.data._id) {
					// update
					if (values.imgs.length !== 0) {
						values.imgs.forEach(item => {
							data.append('imgs', item);
						})
					}
					const res = await putMethod('hotel', data, popup.data._id);
					if(res.success) {
						messageSuccess('Update hotel successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
						form.resetFields();
					} else {
						setLoading(false);
						messageError(res.error)
					}
				} else {
					// create
					if (values.imgs.length === 0) {
						messageError('Choose least one image'); 
						setLoading(false);
						return;
					}
					if (values.imgs.length !== 0) {
						values.imgs.forEach(item => {
							data.append('imgs', item);
						})
					}
					data.append("timeIn",values.time[0].format("HH:mm"))
					data.append("timeOut",values.time[1].format("HH:mm"))
					const res = await postMethod('hotel/create', data);
					if(res.success) {
						messageSuccess('Create hotel successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
					} else {
						setLoading(false);
						messageError(res.error);
					}
				}
			} catch (e) {
				setLoading(false);
				messageError('Something error!');
			}
		}
		action();
	}
	// console.log(view)
	return  <>
		<Button 
			type="primary" 
			shape="round" 
			icon={<PlusCircleOutlined/>}
			onClick={()=>{
				form.resetFields();  
				dispatch({
					type: 'TOOGLE_POPUP', popup: {open: true, data: {}}
				})       
			}}
			>Add Hotel
		</Button>		
		<Table 
			rowKey='_id'
			title={() => 'Hotel'}
			bordered
			tableLayout="auto"
			style={{marginTop: 10}}
			dataSource={data} 
			columns={col} 	
			pagination={{
				pageSize: 10,
				pageSizeOptions: [10,20],
				responsive: true,
			}}
			scroll={{ x: 992 }} 
		/>
		<Modal title="Image Hotel" 
			visible={view.open} 
			footer={null}
			keyboard
			closable
			onCancel={()=>{
				dispatch({
					type: 'TOOGLE_VIEW', view: {open: false, data: []}
				})
			}}
		>
			<Carousel slides={
				view.data ? view.data.map((i, index)=><img src={i} alt={index} />) : []
			}
			autoplay={true} interval={5000}/>
		</Modal>
		<Modal 
			centered
			width='90%'
			closable={false}
			maskClosable={false}
			title="Hotel" 
			visible={popup.open} 
			footer={
				<div>
					<Button className="btn-box-shawdow" type='primary' onClick={showConfirm} loading={loading}>Confirm</Button>
					<Button className="btn-box-shawdow" onClick={()=>{
						setLoading(false);
						dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}});
						form.resetFields();
					}}>Close</Button>
				</div>
			}
			onOk={showConfirm} 
			onCancel={()=>{
				dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
					form.resetFields();
			}}
		>
			<Form
			 {...layout}
			 form={form} name="hotel-form"
			 onFinish={onFinish}
			 onFinishFailed={()=>{setLoading(false)}}
			>
				<Row gutter={[16,16]}>
					<Col xs={24} sm={12} md={12} lg={12} xl={12}>
						<Form.Item name='name' label="Name"
							rules={[{ required: true, message: 'Name empty!' }]}
						>
							<Input placeholder="Name"/>
						</Form.Item>
						<Form.Item name='phone' label="Phone"
							rules={[{ required: true, message: 'Phone empty!' }]}
						>
							<Input placeholder="Ex: 0xxxxxxxxx"/>
						</Form.Item>
						{!popup.data._id && (<Form.Item name='time' label="Time In-Out"
							rules={[{ required: true, message: 'Time empty!' }]}
						>
							<TimePicker.RangePicker  format="HH:mm"/>
						</Form.Item>)}
						<Form.Item name='description' label="Description"
							rules={[{ required: true, message: 'Description empty!' }]}
						>
							<Input.TextArea autoSize/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={12} lg={12} xl={12}>
						<Form.Item name='province' label="Province"
							rules={[{ required: true, message: 'Province empty!' }]}
						>
							<Select 
								allowClear
								showSearch
								placeholder="Province"
								notFoundContent={'Not Found'}
								options={cities.province.map(item=> ({label: item.name, value: Number(item.idProvince)}))}
								filterOption={(inputValue, options) => {
									return options.label.toLowerCase().includes(inputValue.toLowerCase())
								}}
							/>
						</Form.Item>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) => prevValues.province !== currentValues.province}
						>
							{({ getFieldValue }) => {
								var _d = cities.district.filter(item => Number(item.idProvince) === Number(getFieldValue('province')));
								return (<Form.Item name='district' label="District"
									rules={[{ required: true, message: 'District empty!' }]}
								>
									<Select 
										allowClear
										showSearch
										placeholder="Select district"
										notFoundContent={'Not Found'}
										options={_d.map(item=> ({label: item.name, value: Number(item.idDistrict)}))}
										filterOption={(inputValue, options) => {
											return options.label.toLowerCase().includes(inputValue.toLowerCase())
										}}
									/>
								</Form.Item>)
							}}
						</Form.Item>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) => prevValues.district !== currentValues.district}
						>
							{({ getFieldValue }) => {
								var _w = cities.commune.filter(item => Number(item.idDistrict) === Number(getFieldValue('district')));
								return (<Form.Item name='ward' label="Ward"
									rules={[{ required: true, message: 'Ward empty!' }]}
								>
									<Select 
										allowClear
										showSearch
										placeholder="Select ward"
										notFoundContent={'Not Found'}
										options={_w.map(item=> ({label: item.name, value: item.name}))}
										filterOption={(inputValue, options) => {
											return options.label.toLowerCase().includes(inputValue.toLowerCase())
										}}
									/>
								</Form.Item>)
							}}
						</Form.Item>
						<Form.Item name='street' label="Street"
							rules={[{ required: true, message: 'Street empty!' }]}
						>
							<Input placeholder="Street"/>
						</Form.Item>
						<Form.Item name='imgs' label="Img" required
						>
							<CustomUploadListImg />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	</>
}