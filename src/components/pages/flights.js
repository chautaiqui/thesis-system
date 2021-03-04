import React, { useEffect, useReducer, useState, useCallback} from 'react';
import List from '@components/commons/list';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import { DatePicker, Radio, Tabs, Tree  } from 'antd';
import moment from 'moment';


import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, filterCheck, filterSelectCheck } from '@components/commons';
import { useLocation } from 'react-router-dom';


const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Flights = () => {
	const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ form ] = Form.useForm();
	
    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}});
	const { searchFields, requireData } = _state;
	useEffect(() => {
		_dispatch({type: 'init_search_field', data: search})
	}, [])
	
	const updateSF = useCallback (data => {
		// if(meta.offset === searchFields.offset && meta.limit === searchFields.limit && searchFields.total === meta.total ) return;
		_dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})
	}, [searchFields])

	const resetSF = useCallback (dataIndex => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, [dataIndex]: null } })
	}, [searchFields])

	const require = useCallback (async (v) => {
		// data: [promise]
		// Promise.all(data).then(values => {
		// 	_dispatch({type: 'get_require_data', data: values})
		// })
		_dispatch({type: 'get_require_data', data: v})
	}, [searchFields])

	if (!searchFields) return <div />;
	const onFinish = values => {
		setEditData({ ...baseForm, ...values });
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
	let lR = () => {};
	return ([
		<List
			key='list'
			listRef={fn => lR = fn}
			contentUpdate={
				<Form 
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Row gutter={16}>
						<Col xs={22} sm={22} md={12}>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='name'
								label='Name'
								rules={[{ required: true, message: 'Required' }]}
								>
								<Input />
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='publishers'
								label='Publishers'
								rules={[{ required: true, message: 'Required' }]}
								>
								<Input />
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='webapps'
								label='Webapps'
								rules={[{ required: true, message: 'Required' }]}
								>
								<Input />
							</Form.Item>
							{/* <Tabs defaultActiveKey="1" className='dp-form' type='card'>
								<TabPane tab="Basic" key="1">
									<Tree 
										defaultExpandedKeys={['0-0', '0-1']}
										treeData={
											[
												{
													title: 'Contents',
													key: '0-0',
													children: [
														{
															title: (
																<Form.Item
																	name='categories'
																	label='Categories'
																	>
																	<Input />
																</Form.Item>
															),
															key: '0-0-1'
														},
														{
															title: (
																<Form.Item
																	name='show'
																	label='Shows'
																	>
																	<Input />
																</Form.Item>
															),
															key: '0-0-2'
														}
													]
												},
												{
													title: 'Location',
													key: '0-1',
													children: [
														{
															title: (
																<Form.Item
																	name='provinces'
																	label='Provinces'
																	>
																	<Input />
																</Form.Item>
															),
															key: '0-1-0'
														}
													]
												},
												{
													title: 'Devices & Brands',
													key: '0-2',
													children: [
														{
															title: (
																<Form.Item
																	name='device_types'
																	label='Types'
																	>
																	<Input />
																</Form.Item>
															),
															key: '0-2-1'
														},
														{
															title: (
																<Form.Item
																	name='brands'
																	label='Brands'
																	>
																	<Input />
																</Form.Item>
															),
															key: '0-2-2'
														},
														{
															title: (<span>Device: All devices</span>),
															key: '0-2-3'
														}
													]
												},
										]}
									/>
								</TabPane>
								<TabPane tab="Advanced" key="2">
									<Tree 
										defaultExpandedKeys={['0-0']}
										treeData={[
											{
												title: 'Retargeting',
												key: '0-0',
												children: [
													{
														title: "Do smt",
														key: '0-0-1'
													}
												]
											}
										]}
									/>
								</TabPane>
							</Tabs>
										
							<Form.Item
								className='dp-form'
								{...{
									labelCol: {
										span: 8
									},
									wrapperCol: {
										span: 8
									}
								}}
								name='weight'
								label='Weight'
								rules={[{ required: true, message: 'Required' }]}
								>
								<Input />
							</Form.Item> */}
						</Col>
						<Col xs={22} sm={22} md={12}>
							{/* <Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='date_range'
								label='Date ranges'
								rules={[{ required: true, message: 'Required' }]}
								initialValue={[moment('2019-09-03', 'YYYY-MM-DD'), moment('2019-11-22', 'YYYY-MM-DD')]}
							>
								<RangePicker
									// disabled={[true, true]}
									// defaultValue={[moment('2019-09-03', 'YYYY-MM-DD'), moment('2019-11-22', 'YYYY-MM-DD')]}
									disabledDate={(current) => {return current && current < moment().endOf("year");}}
								/>
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='day_weeks'
								label='Date of week'
							>
								<Input />
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='hours'
								label='Hours'
								>
								<Input />
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...utility.formItemLayout}
								name='booking_type'
								label='Booking type'
								initialValue='Impression'
							>
								<Radio.Group >
									<Radio style={{display:'block'}} value={'Impression'}>Impression</Radio>
									<Radio style={{display:'block'}} value={'Click'}>Click</Radio>
									<Radio style={{display:'block'}} value={'Complete view'}>Complete view</Radio>
								</Radio.Group>	
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...{
									labelCol: {
										span: 8
									},
									wrapperCol: {
										span: 14
									}
									}}
								name='total_bookings'
								label='Total bookings'
							>
								<Input addonAfter={'Impression(s)'}/>
							</Form.Item>
							<Form.Item
								className='dp-form'
								{...{
									labelCol: {
										span: 8
									},
									wrapperCol: {
										span: 14
									}
									}}
								name='daily_bookings'
								label='Daily bookings'
							>
								<Input addonAfter={'Impression(s)'}/>
							</Form.Item> */}
						</Col>
					</Row>
				</Form> 
			}
			onOpen={v => {
				setBaseForm(v);
				form.resetFields();
				form.setFieldsValue(v);
			}}
			onOk={() => form.submit()}
			editData={editData}
			fn='flights'
			tColumns={[
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
					sorter: true,
					sortDirections: ['ascend', 'descend'],
				},
				{
					title: 'Name',
					dataIndex: 'name',
					key: 'name',
					sorter: true,
					sortDirections: ['ascend', 'descend', 'ascend'],
					...filerColumn(searchFields, 'name')
				},
				{
					title: 'Total booking',
					dataIndex: 'total_bookings',
					key: 'total_bookings',
				},
				{
					title: 'Daily booking',
					dataIndex: 'daily_bookings',
					key: 'daily_bookings',
				},
				{
					title: 'Activated',
					dataIndex: 'activated',
					key: 'activated',
					...filterCheck(searchFields, 'activated'),
					// ...filerColumn(searchFields, 'activated'),
					render: v => v === 0 ? <Switch/> : <Switch checked/>
				},
			]}
			searchFields={searchFields}
			updateSF={updateSF}
			tableProps={{}}
			resetSF = {resetSF}
            require={require}
			requireData = {requireData}
			fieldsRequire={[
				{name: 'accounts', meta : {limit: 100, offset: 1,}}, 
				{name: 'provinces', meta : {limit: 1000, offset: 1,}}, 
				{name: 'categories', meta : {limit: 1000, offset: 1,}}, 
			]}
			action={['View Detail', 'Update', 'Copy' ,'View Report', 'View Log']}
		/>
	]);

}

export default Flights;