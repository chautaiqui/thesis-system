import React, {useContext, useReducer, useEffect} from 'react';
import { Button, Table, Modal, Form, Input, Row, Col, InputNumber, DatePicker, message, Popover, Drawer, Select } from 'antd';
import { PlusCircleOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import {Carousel} from '3d-react-carousal';
import { User } from '@pkg/reducers';
import { CustomUploadImg, filerColumn, DynamicSelect } from '../../commons';
import { _getRequest, postMethod, putMethod } from '@api';
import moment from 'moment';
const { confirm } = Modal;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const ManagerReducer = (state, action) => {
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
				return { ...state, data: action.data, hotel: action.hotel, behavior: 'stall' }
      case 'GET_DATA_ERROR':
				return { ...state, data: [], behavior: 'stall' };
      case 'TOOGLE_POPUP':
				return { ...state, popup: action.popup, behavior: action.behavior };
      case 'TOOGLE_VIEW':
				return { ...state, view: action.view, behavior: 'stall' };
      case 'RELOAD':
				return { ...state, behavior: 'init', popup: action.popup, view: action.view };
      default:
				return state;
  } 
}
const initState = {
	behavior: 'init',
	data: [],
	hotel: [],
	popup: {open: false, data: {}},
	view: {open: false, data: {}},
}

export const Manager = () => {
	const [ _user ] = useContext(User.context);
	const [ state, dispatch ] = useReducer(ManagerReducer, initState);
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
			title: 'Email',
			dataIndex: 'email',
			align: 'center',
			key: 'email', 
			fixed: 'left',
			...filerColumn([], 'email'),
      onFilter: (value, record) =>
          record.name
              ? record.name.toString().toLowerCase().includes(value.toLowerCase())
              : '',
		},
		{
			title: 'Birthday',
			dataIndex: 'birthday',
			align: 'cener',
			key: 'birthday', 
			render: (t,r,i) => {
				return moment(r.birthday).format('DD-MM-YYYY')
			}
		},
		{
			title: 'Department',
			dataIndex: 'department',
			align: 'center',
			key: 'department', 
		},
		{
			title: 'Designation',
			dataIndex: 'designation',
			align: 'center',
			key: 'designation', 
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
			render: (text, record, index)=>{
				return [
					record.address. length > 15? (<Popover key="0" content={record.address}trigger="hover" style={{ width: '50%' }}>
						{record.address.slice(0,15) + '...'}
					</Popover>) : record.address
				]
			}
		},
		{
			title: 'Hotel',
			align: 'center',
			key: 'hotel',
			render: (text, record, index) => {
				if(record.hotel) {
					return <p>{record.hotel.name}</p>
				} else {
					return <Button type={'primary'} shape={"round"} 
						onClick={()=>{
							dispatch({
								type: 'TOOGLE_VIEW', view: {open: true, data: record}
							})
						}}
					>Sethotel</Button>
				}
			}
		},
		{
			title: 'Action',
			align: 'center',
			key: 'action',
			render: (text, record, index)=>{
				return [
					<Button key="1" icon={<EditOutlined />}
						onClick={()=>{
							dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:record}})
							form.setFieldsValue({
								name: record.name,
								email: record.email,
								birthday: moment(record.birthday),
								phone: record.phone,
								address: record.address,
								designation: record.designation,
								skills: record.skills,
								department: record.department,
								district: record.district,
								baseSalary: record.baseSalary,
								img: record.img,
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
			const res = await _getRequest('manager');
			if(!res.success) {
				message.error(res.error);
				return;
			}
			const res1 = await _getRequest('hotel', {manager: "false"});
			if(!res1.success) {
				message.error(res1.error);
			}
			dispatch({
				type: 'GET_DATA_SUCCESS', data: res.result.managers, hotel: res1.result.hotels || []
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
		// validate();
		setLoading(true);
		var format = /[A-Za-z0-9_]@[A-Za-z0-9_]+\.[A-Za-z0-9_]/;
		if (!format.test(values.email)) {
			message.error("Email error format!");
			return;
		}
		var data = new FormData();
		if(values.birthday) {
			data.append('birthday', values.birthday.format('DD-MM-YYYY', 'DD/MM/YYYY' ));
		}
		var temp = {...values, birthday: undefined, skills: undefined, img: undefined}
		for (const [key, value] of Object.entries(temp)){
			if(value) {
				data.append(key, value)
			}
		}
		// axios
		const action = async () => {
			try {
				if(popup.data._id) {
					// update
					console.log(values.skills, Array.isArray(values.skills))
					if(Array.isArray(values.skills) && values.skills.length > 0){
						values.skills.forEach(i=>{
							data.append('skills', i)
						})
					} 
					if(typeof values.img === 'object') {
						data.append('img', values.img)
					}
					const res = await putMethod('manager', data, popup.data._id);
					if(res.success){
						message.success('Update manager successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}, view: {open:false, data: {}}
						})
						form.resetFields();
					} 
					else {
						setLoading(false);
						message.error(res.error);
					}
				} else {
					// create -> post
					var obj = {}
					data.forEach(function(value, key){
						obj[key] = value;
					});
					var newData = { ...obj, skills: values.skills}
					const res = await postMethod('manager/create', newData);
					if(res.success){
						message.success('Create manager successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}, view: {open:false, data: {}}
						})
					} else {
						setLoading(false);
						message.error(res.error)
					}
				}
			} catch (e) {
				setLoading(false);
				message.error('Something error')
			}
		}
		action();
	}
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
			>Add Manager
		</Button>		
		<Table 
			rowKey='_id'
			title={() => 'Manager'}
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
		<Modal 
			centered
			width='90%'
			closable={false}
			maskClosable={false}
			title={ popup.data._id ? popup.data.name : "Create manager"}
			visible={popup.open} 
			// okText='Confirm'
			// cancelText='Close'
			onOk={showConfirm} 
			onCancel={()=>{
				dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
					form.resetFields();
			}}
			footer={
				<div>
					<Button shape='round' type='primary' onClick={showConfirm} loading={loading}>Confirm</Button>
					<Button shape='round' onClick={()=>{
						setLoading(false);
						dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
						form.resetFields();
					}}>Close</Button>
				</div>
			}
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
							<Input />
						</Form.Item>
						<Form.Item name='email' label="Email"
							rules={[{ required: true, message: 'Email empty!' }]}
						>
							<Input disabled={popup.data.email ? true : false}/>
						</Form.Item>
						<Form.Item name='birthday' label="Birthday"
							rules={[{ required: true, message: 'Birthday empty!' }]}
						>
							<DatePicker />
						</Form.Item>
						<Form.Item name='phone' label="Phone"
							rules={[{ required: true, message: 'Phone empty!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item name='address' label="Address"
							rules={[{ required: true, message: 'Address empty!' }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={12} lg={12} xl={12}>
						<Form.Item name='skills' label="Skills"
							// rules={[{ required: true, message: 'Skills empty!' }]}
						>
							<DynamicSelect />
						</Form.Item>
						<Form.Item name='department' label="Department"
							rules={[{ required: true, message: 'Department empty!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item name='designation' label="Designation"
							rules={[{ required: true, message: 'Designation empty!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item name='baseSalary' label="BaseSalary"
							rules={[{ required: true, message: 'baseSalary empty!' }]}
						>
							<InputNumber 
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
						{popup.data._id && (<Form.Item name='img' label="Img"
						>
							<CustomUploadImg />
						</Form.Item>)}
					</Col>
				</Row>
			</Form>
		</Modal>
		<Drawer
			title={ `Set hotel for ${state.view.data.name}` ||"Set hotel" }
			placement={'right'}
			closable={false}
			onClose={()=>{
				dispatch({
					type: 'TOOGLE_VIEW', view: {open:false, data: {}}
				})
			}}
			visible={state.view.open}
			key={'left'}
			width={300}
			footer={
				<Button onClick={()=>{
					dispatch({
						type: 'TOOGLE_VIEW', view: {open:false, data: {}}
					})
				}}>Close</Button>
			}
		>
			<Form
				{...layout}
				name="sethotel-form"
				onFinish={(values)=>{
					setLoading(true);
					const setmanager = async () => {
						const res = await putMethod('hotel', {manager: state.view.data._id}, `${values.hotel}/change-manager`);
						if(res.success) {
							message.success('Set hotel for manager successfully!');
							setLoading(false);
							dispatch({type: 'RELOAD', popup: {open: false, data: {}}, view: {open:false, data: {}}})
						} else {
							setLoading(false);
							message.error(res.error);
						}
					}
					setmanager();
				}}
			>
				<Form.Item
					label="Name"
				>
					<Input value={ state.view.data.name ||'manager'} disabled label={'Manager'}/>
				</Form.Item>
				<Form.Item 
					name='hotel' label='Hotel'
					rules={[{ required: true, message: 'Please choose hotel' }]}
				>	
				<Select 
					placeholder={"Choose hotel available"}
					allowClear
					showSearch
					notFoundContent={'Not Found'}
					options={state.hotel.map(item=>({label: item.name, value: item._id}))}
					filterOption={(inputValue, options) => {
						return options.label.toLowerCase().includes(inputValue.toLowerCase())
					}}
				/>
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit" loading={loading}>
						Set
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	</>
}