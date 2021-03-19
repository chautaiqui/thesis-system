import React, { useEffect, useReducer, useState, useContext } from 'react';
import List from '@components/commons/list';
import { User } from '@pkg/reducers';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useRouteMatch
  } from "react-router-dom";

// import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import { Tabs, Tree, Select, Button, Menu, Dropdown } from 'antd';
import { DownOutlined, ReadOutlined, CopyOutlined, LineChartOutlined, SolutionOutlined, EditOutlined } from '@ant-design/icons';

import { PageReducer } from '@pkg/reducers';
import { getRequest } from '@pkg/api';
import { utility, filerColumn, filterCheck, MultiSelect, RadioGroup, ListDateRangePicker, CustomInputNumber } from '@components/commons';
import { useLocation } from 'react-router-dom';

const { TabPane } = Tabs;

const Flights = () => {
	let { path, url } = useRouteMatch();
	const { search } = useLocation();
	const [ editData, setEditData ] = useState({id: 0});
	const [ baseForm, setBaseForm ] = useState({});
	const [ logData, setLogData] = useState({visible: false, title: "", data: []});
    const [ popup, setPopup ] = useState({open: false, title: '', option: 'update'});
	
	const [ form ] = Form.useForm();
   
	const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}, updateData: {}});
	const { searchFields, requireData, updateData } = _state;
	const [ user ] = useContext(User.context);

	useEffect(() => {
		if (!!searchFields) return;
		_dispatch({type: 'init_search_field', data: search});
	}, [search, searchFields])

	const onChangeSF = data => _dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})

	const require = (v) => {
		// data: [promise]
		// Promise.all(data).then(values => {
		// 	_dispatch({type: 'get_require_data', data: values})
		// })
		_dispatch({type: 'get_require_data', data: v})
	}

	if (!searchFields) return <div />;
	const onFinish = values => {
		setEditData({ ...baseForm, ...values });
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
	
	const viewLog = async(id) => {
        var span_data = await utility.FetchAndSpanLogData('flights', id, user.api_token);
		setLogData({...logData, ...{visible: true, title: `Changelog: flights/${id}`, data: span_data}})
    }

    const updateRecord = (record) => {
        // console.log('update', record)
        setPopup({...popup,...{open: true,title: `Update Flights : ${record.id} ${record.name}`}})
		
		const ex = [
			{name: 'accounts', params: {offset: 1, limit: 100,model: 'advertiser',order: 'id|desc'}},
			{name: 'accounts', params: {offset: 1, limit: 100,model: 'publisher',order: 'id|desc'}},
			{name: 'website-apps', params: {offset: 1, limit: 1000,order: 'id|desc'}},
			{ name: 'provinces', params : {limit: 1000, offset: 1, order: 'id|desc'}}, 
			{ name: 'categories', params : {limit: 1000, offset: 1, order: 'id|desc',activated: 1}}, 
			{ name: 'config', params : {key: 'device_types'}}, 
		]
		var t = ex.map(item => getRequest(item.name, user.api_token, item.params));

		Promise.all(t)
		.then(value => _dispatch({type: 'get_extend_data', data: value}))
		.catch(()=> '');
		let fields = [ 'ad_frequency', 'categories', 'contents', 'countries', 'date_range', 'day_weeks', 'device_types', 'devices', 'hours', 'mobile_carriers', 'provinces', 'source_providers', 'webapps', 'zones'];
        for (let x in record) {
            if (fields.includes(x) && !Array.isArray(record[x])) {
                record[x] = JSON.parse(record[x])
            }
        }
        console.log(record)
        setBaseForm(record);
        form.resetFields();
        form.setFieldsValue(record);
    }
	console.log('flights', updateData)
	return (
		<div>
			<Switch>
				<Route exact path={path}>
					<List
						key='list'
						contentEdit={
							<Form 
								className={'flight-form'}
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
											<Select 
												allowClear
												showSearch
												options={updateData[1] ? updateData[1].result.data.map(item => ({label: item.name, value: item.id.toString()})) : []}
												//publishser id: string ?
												filterOption={(inputValue, options) => {
													return options.label.toLowerCase().includes(inputValue.toLowerCase())
												}}
												notFoundContent={'Not Found publisher'}
											/>
										</Form.Item>
										<Form.Item
												noStyle
												shouldUpdate={(prevValues, currentValues) => prevValues.publishers !== currentValues.publishers}
										>
											{({ getFieldValue }) => (
												<Form.Item
													className='dp-form'
													{...utility.formItemLayout}
													name='webapps'
													label='Webapps'
												>
													<MultiSelect 
														maxTag={2} 
														placeholder={'Choose webapps'}
														listValue={updateData[2] ? updateData[2].result.data.filter(item=>item.publisher_id === Number(getFieldValue('publishers'))).map(item => ({label: item.name, value: item.id})) : []}
													/>
												</Form.Item>	
											)}
										</Form.Item>
										<div>
											<label className='custom-label flight-label'>Target by: </label>
										</div>
										<Tabs defaultActiveKey="1" type='card' style={{paddingLeft: '26%',marginTop: 5, marginBottom: 5}}>
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
																			className='dp-form'
																			{...utility.formItemLayout}
																			>
																			<Input />
																		</Form.Item>
																	),
																	key: '0-0-1'
																},
																{
																	title: (
																		<Form.Item
																			name='contents'
																			label='Shows'
																			className='dp-form'
																			{...utility.formItemLayout}
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
																			className='dp-form'
																			{...utility.formItemLayout}
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
																			className='dp-form'
																			{...utility.formItemLayout}
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
																			className='dp-form'
																			{...utility.formItemLayout}
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
													span: 12
												}
											}}
											name='weight'
											label='Weight'
											rules={[{ required: true, message: 'Required' }]}
											getValueFromEvent={v => {
												// console.log(!!v)
												return !!v ? v : 0;
											}}
										>
											<CustomInputNumber/>
										</Form.Item>
									</Col>
									<Col xs={22} sm={22} md={12}>
										<Form.Item
											className='dp-form'
											{...utility.formItemLayout}
											name='date_range'
											label='Date ranges'
											// rules={[{ required: true, message: 'Required' }]}
											getValueFromEvent={v => {
												return v  ;
											}}
										>
											<ListDateRangePicker editable={form.getFieldValue('campaign') ? form.getFieldValue('campaign').activated : '1'}/>
											{/* <div><Input/></div> */}
										</Form.Item>
										<Form.Item
											className='dp-form'
											{...utility.formItemLayout}
											name='day_weeks'
											label='Day of week'
											getValueFromEvent={v => {
												return v;
											}}
										>
											<MultiSelect maxTag={3} listValue={[
												{label:'Monday', value: 1}, {label:'Tuesday', value: 2},{label:'Wednesday', value: 3},{label:'Thursday', value: 4},{label:'Friday', value: 5},{label:'Saturday', value: 6},{label:'Sunday', value: 0}
											]} placeholder={'Choose day of week'}/>
										</Form.Item>
										<Form.Item
											className='dp-form'
											{...utility.formItemLayout}
											name='hours'
											label='Hours'
											getValueFromEvent={v => {
												return v;
											}}
											>
											<MultiSelect maxTag={5} listValue={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(item=>({label: item, value: item}))} placeholder={'Choose hours'}/>
										</Form.Item>
										<Form.Item
											className='dp-form'
											{...utility.formItemLayout}
											name='booking_type'
											label='Booking type'
											getValueFromEvent={v => {
												return v
											}}
										> 
											<RadioGroup data={[{value: 'impression', label: 'Impression'},{value: 'click', label: 'Click'},{value: 'complete_view', label: 'Complete view'}]}/>
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
											rules={[{ required: true, message: 'Required' }]}
											getValueFromEvent={v => {
												return !!v ? v : 0;
											}}
										>
											<CustomInputNumber label={'Impression(s)'}/>
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
											rules={[{ required: true, message: 'Required' }]}
											getValueFromEvent={v => {
												return !!v ? v : 0;
											}}
										>
											<CustomInputNumber label={'Impression(s)'}/>
										</Form.Item>
									</Col>
								</Row>
							</Form> 
						}
						onOpen={v => {
							// edit v
							let fields = [ 'ad_frequency', 'categories', 'contents', 'countries', 'date_range', 'day_weeks', 'device_types', 'devices', 'hours', 'mobile_carriers', 'provinces', 'source_providers', 'webapps', 'zones'];
							for (let x in v) {
								if (fields.includes(x) && !Array.isArray(v[x])) {
									v[x] = JSON.parse(v[x])
								}
							}
							// console.log(v)
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
								title: 'Action',
								align: 'center',
								dataIndex: 'activated',
								key: 'activated',
								width: "10%",
								...filterCheck(searchFields, 'activated'),
								// ...filerColumn(searchFields, 'activated'),
								render: (text, record, index) => ([
									<div key='action'>
										{/* <Switch key='sw' checked={text===0?false:true} style={{marginBottom: 5}}/> */}
										<Dropdown 
											overlay={
												<Menu>
													<Menu.Item
														onClick={() =>updateRecord(record)}>
														<EditOutlined /> <span>Update</span>
													</Menu.Item>
													<Menu.Item>													
														<Link to={`${'/campaigns'}/${record.campaign_id}`}> <ReadOutlined /> <span> View Detail </span></Link>
													</Menu.Item>
													<Menu.Item>
														<CopyOutlined /> <span>Copy</span>
													</Menu.Item>
													<Menu.Item>
														<LineChartOutlined /> <span>View Report</span>
													</Menu.Item>
													<Menu.Item
														onClick={()=>viewLog(record.id)}
													>
														<SolutionOutlined /> <span>View Log</span>
													</Menu.Item>
												</Menu>
											} placement="bottomLeft">
										<Button>Action <DownOutlined /></Button>
									</Dropdown>
									</div>
								])
							},
						]}
						searchFields={searchFields}
						onChangeSF={onChangeSF}
						tableProps={{
							expandable: {
								expandedRowRender: record => (
									<div>
									<Row style={{paddingLeft: 50}}>
										<Col span={12}>Date Range</Col>
									</Row>
									</div>
								)
							}
						}}
						require={require}
						requireData = {requireData}
						fieldsRequire={[
							{ name: 'accounts', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {accounts: data}})}, 
							{ name: 'provinces', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {provinces: data}})}, 
							{ name: 'categories', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {categories: data}})}, 
							{ name: 'website-apps', meta : {limit: 1000, offset: 1,order: 'id|desc'}, onChange: data => _dispatch({type: 'get_require_data', data: {['website-apps']: data}})}, 
						]}
						logData={logData}
						closeViewLog={()=>setLogData({...logData, ...{visible:false}})}
						popup={popup}
						togglePopup={(v)=>setPopup(v)}
						confirmPopup={()=>form.submit()}
					/>
				</Route>
				<Route exact path={`/campaigns/:id`}>
					<h1>Flight</h1>
				</Route>
			</Switch>
		</div>
	);

}

export default Flights;
