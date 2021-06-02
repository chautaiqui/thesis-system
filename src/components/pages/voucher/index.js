import React, {useContext, useReducer, useEffect} from 'react';
import { Button, Table, Modal, Form, Input, Row, Col, Select, message, DatePicker, InputNumber, Tag } from 'antd';
import { PlusCircleOutlined, HighlightOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { User } from '@pkg/reducers';
import { cities } from '../../commons/city';
import { CustomUploadImg, filerColumn, DynamicSelect } from '../../commons';

import { _getRequest, postMethod, putMethod } from '@api';
const { confirm } = Modal;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 },
};

const VoucherReducer = (state, action) => {
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
	data: {voucher: [], roomType: []},
	popup: {open: false, data: {}},
}

export const Voucher = () => {
	const [ user ] = useContext(User.context);
	const [ state, dispatch ] = useReducer(VoucherReducer, initState);
	const [ loading, setLoading ] = React.useState(false);
	const [ form ] = Form.useForm();
	const col = [
		{
			title: 'Room type',
			dataIndex: 'roomType',
			align: 'center',
			key: 'roomType', 
			fixed: 'left',
			render: (text, record, index) => <div>{record.roomType.name}</div>
		},
		{
			title: 'Status',
			dataIndex: 'status',
			align: 'center',
			key: 'status', 
			fixed: 'left',
			render: (text, record, index) => <Tag color={record.status === 'available' ? "#f50" : "#87d068"}>{record.status}</Tag>
		},
		{
			title: 'Discount',
			dataIndex: 'discount',
			align: 'center',
			key: 'discount', 
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			align: 'center',
			key: 'amount', 
		},
		{
			title: 'Start Date',
			dataIndex: 'startDate',
			align: 'center',
			key: 'startDate',
			render: (text, record, index) => <div>{moment(record.startDate).format('DD-MM-YYYY')}</div>
		},
		{
			title: 'End Date',
			dataIndex: 'endDate',
			align: 'center',
			key: 'endDate',
			render: (text, record, index) => <div>{moment(record.endDate).format('DD-MM-YYYY')}</div> 
		},
		{
			title: 'Edit',
			align: 'center',
			key: 'edit',
			render: (text, record, index) => <Button
				size='small'
				type="primary" shape="circle" icon={<HighlightOutlined />}
				onClick={()=>{
						dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data: record}, behavior: 'stall'})
						form.setFieldsValue({
							roomType: record.roomType.name,
							status: record.status,
							startDate: moment(record.startDate, 'DD-MM-YYYY HH:mm'),
							endDate: moment(record.endDate, 'DD-MM-YYYY HH:mm'),
							discount: record.discount,
							amount: record.amount,
							img: record.img
						});             
				}}
			></Button>
		},
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
		if(!user.auth.hotel) {
			dispatch({
				type: 'GET_DATA_SUCCESS', data: []
			});
			return;
		}
		try {
			const res = await _getRequest(`hotel/${user.auth.hotel}/voucher`);
			console.log(`hotel/${user.auth.hotel}/roomtype`)
			const res1 = await _getRequest(`hotel/${user.auth.hotel}/roomtype`);
			if(!res.success) {
				message.error(res.error);
				return;
			}
			if(!res1.success) {
				message.error(res1.error);
				return;
			}
			dispatch({
				type: 'GET_DATA_SUCCESS', data: { voucher: res.result.vouchers, roomType: res1.result.roomTypes}
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
		const data = {
			roomType: values.roomType,
			status: values.status,
			startDate: moment(values.startDate).format('DD-MM-YYYY HH:mm'),
			endDate: moment(values.endDate).format('DD-MM-YYYY HH:mm'),
			discount: values.discount,
			amount: values.amount,
		}
		setLoading(true);
		// api
		const action = async () => {
			try {
				if(popup.data._id) {
					// update
					setLoading(true);
					var formdata = new FormData();
					if (values.img && typeof values.img === 'object') {
						formdata.append('img', values.img);
					}
					for (const [key, value] of Object.entries(data)){
						if(value) {
							formdata.append(key, value)
						}
					}
					const res = await putMethod('voucher', formdata, popup.data._id);
					if(res.success) {
						message.success('Update voucher successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
						form.resetFields();
						return;
					} else {
						setLoading(false);
						message.error(res.error)
						return;
					}
				} else {
					// create
					var formdata = new FormData();
					if (values.img && typeof values.img === 'object') {
						formdata.append('img', values.img);
					}
					for (const [key, value] of Object.entries(data)){
						if(value) {
							formdata.append(key, value)
						}
					}
					const res = await postMethod(`hotel/${user.auth.hotel}/create-voucher`, formdata);
					if(res.success) {
						message.success('Create voucher successfully!');
						setLoading(false);
						dispatch({
							type: 'RELOAD', popup: {open: false, data: {}}
						})
						return;
					} else {
						setLoading(false);
						message.error(res.error);
						return;
					}
				}
			} catch (e) {
				setLoading(false);
				message.error('Something error!');
				return;
			}
		}
		action();
	}
	console.log(data)
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
			>Add Voucher
		</Button>		
		<Table 
			rowKey='_id'
			title={() => 'Voucher'}
			bordered
			tableLayout="auto"
			style={{marginTop: 10}}
			dataSource={data.voucher} 
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
					<Button shape='round' type='primary' onClick={()=>{
						showConfirm();
					}} loading={loading}>Confirm</Button>
					<Button shape='round' onClick={()=>{
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
			 form={form} 
			 name="employee-form"
			 onFinish={onFinish}
			 onFinishFailed={()=>{setLoading(false)}}
			>
				<Form.Item name="roomType" label="Room type">
					<Select 
						placeholder="Room type" 
						options={data.roomType.map(item => ({label: item.name, value: item.name}))}
						allowClear
						showSearch
						filterOption={(inputValue, options) => {
							return options.label.toLowerCase().includes(inputValue.toLowerCase())
						}}
						notFoundContent={'Not found item'}
					/>
				</Form.Item>
				<Form.Item name="status" label="Status">
					<Select 
						placeholder="Status" 
						options={[{name: 'available'}, {name: 'unavailable'}].map(item => ({label: item.name, value: item.name}))}
					/>
				</Form.Item>
				<Form.Item name="startDate" label="Start Date">
					<DatePicker placeholder={'Start date'}/>
				</Form.Item>
				<Form.Item name="endDate" label="End Date">
					<DatePicker placeholder={'End date'}/>
				</Form.Item>
				<Form.Item name='discount' label="Discount"
					rules={[{ required: true, message: 'Please input discount of voucher!'}]}
				>
					<InputNumber 
						formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/\$\s?|(,*)/g, '')}
						style={{width: '50%'}}
					/>
				</Form.Item>
				<Form.Item name='amount' label="Amount"
					rules={[{ required: true, message: 'Please input amount of voucher!'}]}
				>
					<InputNumber 
						formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/\$\s?|(,*)/g, '')}
						style={{width: '50%'}}
					/>
				</Form.Item>
				<Form.Item name='img' label="Img">
					<CustomUploadImg />
				</Form.Item>
			</Form>
		</Modal>
	</>
}