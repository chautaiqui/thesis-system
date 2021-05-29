import React, {useContext, useReducer, useEffect} from 'react';
import { Button, Table, Modal, Form, Input, Row, Col, Select, Popover, message, TimePicker, InputNumber } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import {Carousel} from '3d-react-carousal';
import { User } from '@pkg/reducers';
import { cities } from '../../commons/city';
import { CustomUploadListImg, filerColumn } from '../../commons';
import { _getRequest, postmethod } from '@api';
import axios from 'axios';
const { confirm } = Modal;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
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
					record.description. length > 30? (<Popover key="0" content={record.description}trigger="hover">
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
		console.log(values)
		var data = new FormData();
		if(values.imgs.length !== 0){
			values.imgs.forEach(item => {
        data.append('imgs', item)
      })
		} 
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
					const res = await axios.put(`https://hotel-lv.herokuapp.com/api/hotel/${popup.data._id}`, data, {headers: myHeaders})
					if(res.status === 200){
						message.success('Update hotel successfully!');
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
						form.resetFields();
					} 
					// const res = await putMethod('hotel', data, popup.data._id);
				} else {
					// post
					data.append("timeIn",values.time[0].format("HH:mm"))
					data.append("timeOut",values.time[1].format("HH:mm"))
					// const res = await axios.post(`https://hotel-lv.herokuapp.com/api/hotel/create`, data, {headers: myHeaders})
					// console.log(res)
					// if(res.status === 201){
					// 	message.success('Create hotel successfully!');
					// 	dispatch({
					// 		type: 'RELOAD', popup: {open: false, data: {}}
					// 	})
					// } 
					const res = await postmethod('hotel/create', data);
						message.success('Create hotel successfully!');
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})

				}
			} catch (e) {
				message.error(e)
			}
		}
		action();
	}
	console.log(view)
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
			okText='Confirm'
			cancelText='Close'
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
			>
				<Row gutter={[16,16]}>
					<Col xs={24} sm={12} md={12} lg={12} xl={12}>
						<Form.Item name='name' label="Name"
							rules={[{ required: true, message: 'Name empty!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item name='capacity' label="Capacity"
							rules={[{ required: true, message: 'Capacity empty!' }]}
						>
							<Input />
						</Form.Item>
						{/* <Form.Item name='averagePrice' label="Price"
							rules={[{ required: true, message: 'Price empty!' }]}
						>
							<InputNumber 
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item> */}
						<Form.Item name='phone' label="Phone"
							rules={[{ required: true, message: 'Phone empty!' }]}
						>
							<Input />
						</Form.Item>
						{!popup.data._id && (<Form.Item name='time' label="Time In-Out"
							rules={[{ required: true, message: 'Phone empty!' }]}
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
							<Input />
						</Form.Item>
						<Form.Item name='imgs' label="Img"
						>
							<CustomUploadListImg />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	</>
}