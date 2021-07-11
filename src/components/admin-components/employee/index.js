import React, {useContext, useReducer, useEffect} from 'react';
import { Button, Table, Modal, Form, Input, Row, Col, Select, Popover, message, TimePicker, InputNumber, Tag, DatePicker } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { User } from '@pkg/reducers';
import { cities } from '../../commons/city';
import { CustomUploadImg, filerColumn, DynamicSelect, messageError } from '../../commons';

import { _getRequest, postMethod, putMethod } from '@api';
const { confirm } = Modal;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 },
};

const EmployeeReducer = (state, action) => {
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
}

export const Employee = ({hotelId}) => {
	const [ user, dispatchUser ] = useContext(User.context);
	const [ state, dispatch ] = useReducer(EmployeeReducer, initState);
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
		},
		{
			title: 'Birthday',
			dataIndex: 'birthday',
			align: 'center',
			key: 'birthday', 
			render: (t,r,i) => {
				return moment(r.birthday).format('DD-MM-YYYY')
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
			title: 'Skills',
			dataIndex: 'skills',
			align: 'center',
			key: 'skills',
			render: (text, record, index) => {
				return record.skills.length !== 0 ? (
					record.skills.map(item => <Tag key={item}>{item}</Tag>)
				) : (<p>No Skill</p>)
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
								department: record.department,
								designation: record.designation,
								skills: record.skills,
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
	const { data, popup } = state;
	const getData = async () => {
		if(!hotelId) {
			dispatch({
				type: 'GET_DATA_SUCCESS', data: []
			});
			return;
		}
		try {
			const res = await _getRequest(`hotel/${hotelId}/employee`);
			if(!res.success) {
				message.error(res.error);
				return;
			}
			dispatch({
				type: 'GET_DATA_SUCCESS', data: res.result.employees
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
	useEffect(()=>{
		dispatch({type: "RELOAD", popup: {open: false, data: {}}});
	},[hotelId])
	const onFinish = (values) => {
		console.log(values)
		var data = new FormData();
		if(values.skills && values.skills.length > 0) {
			values.skills.forEach(item => {
				data.append('skills', item)
			})
		}
		if(values.birthday) data.append('birthday', values.birthday.format( 'DD-MM-YYYY', 'DD/MM/YYYY' ))
		if(typeof values.img === 'object') data.append('img', values.img);
		var temp = { ...values, skills: undefined, birthday: undefined, img: undefined}
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
					setLoading(true);
					const res = await putMethod('employee', data, popup.data._id);
					if(res.success) {
						message.success('Update hotel successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
						form.resetFields();
					} else {
						setLoading(false);
						messageError(res.error)
						console.log(res)
					}
				} else {
					// create
					setLoading(true);
					var object = {
						email: values.email,
						name: values.name,
						birthday: values.birthday.format( 'DD-MM-YYYY', 'DD/MM/YYYY' ),
						phone: values.phone,
						address: values.address,
						skills: values.skills,
						department: values.department,
						designation: values.designation,
						baseSalary: values.baseSalary,
					};
					const res = await postMethod(`hotel/${hotelId}/create-employee`, object);
					if(res.success) {
						message.success('Create employee successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
					} else {
						message.error(res.error);
						setLoading(false);
					}
				}
			} catch (e) {
				setLoading(false);
				message.error('Something error!');
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
			>Add Employee
		</Button>		
		<Table 
			rowKey='_id'
			title={() => 'Employee'}
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
			title="Employee" 
			visible={popup.open} 
			footer={
				<div>
					<Button className="btn-box-shawdow" type='primary' onClick={()=>{
						console.log('click');
						showConfirm()
					}} loading={loading}>Confirm</Button>
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
			 form={form} name="employee-form"
			 onFinish={onFinish}
			 onFinishFailed={()=>{setLoading(false)}}
			>
				<Row gutter={[16,16]}>
					<Col xs={24} sm={12} md={12} lg={12} xl={12}>
						<Form.Item name='email' label="Email"
							rules={[{ required: true, message: 'Email empty!' }]}
						>
							<Input disabled={popup.data._id ? true : false}/>
						</Form.Item>
						<Form.Item name='name' label="Name"
							rules={[{ required: true, message: 'Name empty!' }]}
						>
							<Input />
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
						<Form.Item name='skills' label="Skills">
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
								style={{width: "100%"}}
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
	</>
}