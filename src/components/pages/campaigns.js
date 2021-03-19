import React, { useEffect, useReducer, useState, useCallback, useContext } from 'react';
import List from '@components/commons/list';
import { User } from '@pkg/reducers';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useRouteMatch
  } from "react-router-dom";
import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, filterSelect, filterCheck, filterDatePicker } from '@components/commons';
import { useLocation } from 'react-router-dom';

// import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { Radio, DatePicker, Select, Button, Menu, Dropdown } from 'antd';
import { DownOutlined, ReadOutlined, CopyOutlined, LineChartOutlined, SolutionOutlined } from '@ant-design/icons';
import moment from 'moment';

const Campaigns = () => {

	let { path, url } = useRouteMatch();

    const { search } = useLocation();
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}, editData: {}, baseForm: {}});
	const {	searchFields, requireData, editData, baseForm } = _state;
	const [ user ] = useContext(User.context);
	const [ logData, setLogData] = useState({visible: false, title: "", data: []});
    const [ popup, setPopup ] = useState({open: false, title: '', option: 'create'});

    useEffect(() => {
        let isCancelled = false;
		if (!!searchFields) return() => isCancelled = true;
		if(!isCancelled) _dispatch({type: 'init_search_field', data: search});
		return () => isCancelled = true;
	}, [search, searchFields])
	
	const onChangeSF = data => _dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})
	
    const require = (v) => {
		_dispatch({type: 'get_require_data', data: v})
	}

	if (!searchFields) return <div />;

	const onFinish = values => {
		// for (let item in values) {
		// 	if (values[item].format('YYYY-MM-DD')) values[item] = values[item].format('YYYY-MM-DD') /**/
		// }
		_dispatch({type: 'set_editdata', data: { ...baseForm, ...values }});
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
	const viewLog = async (id) => {
		var span_data = await utility.FetchAndSpanLogData('campaigns', id, user.api_token);
		setLogData({...logData, ...{visible: true, title: `Changelog: campaigns/${id}`, data: span_data}})
	}
	
	// console.log(requireData['accounts'])
    return (
		<Switch>
				<Route exact path={path}>
					<List
						key='list'
						contentEdit={
						<Form 
							form={form}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Row >
								<Col span={20}>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='account_id'
										label='Advertiser'
										rules={[{ required: true, message: 'Required' }]}
									>
										<Select 
											allowClear
											showSearch
											placeholder= {'Choose advertiser'}
											options={requireData['accounts'] ? requireData['accounts'].map(item => ({label: item.name, value: item.id})) : []}
											filterOption={(inputValue, options) => {
												return options.label.toLowerCase().includes(inputValue.toLowerCase())
											}}
											notFoundContent={'Not Found advertiser'}
										/>
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='name'
										label='Campaigns name'
										rules={[{ required: true, message: 'Required' }]}
									>
										<Input />
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='start_date'
										label='Date range'
									>
										<DatePicker 
										placeholder={'Start date'}
										disabledDate={(current) => {
											return current && current < moment().startOf('day');
										}}/>
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='end_date'
										label='-'
									>
										<DatePicker 
										placeholder={'End date'}
										disabledDate={(current) => {
											return current && current < moment().startOf('day');
										}}
										/>
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='description'
										label='Description'
										initialValue=''
									>
										<Input />
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='type'
										label='Type'
										initialValue='vod'
									>
										<Radio.Group >
											<Radio style={{display:'block'}} value={'vod'}>VOD</Radio>
											<Radio style={{display:'block'}} value={'display'}>Display</Radio>
											<Radio style={{display:'block'}} value={'livetv'}>Live TV</Radio>
										</Radio.Group>
									</Form.Item>
									<Form.Item
										className='dp-form'
										{...utility.formItemLayout}
										name='activated'
										label='Activated'
										initialValue= {true}
									>
										<Switch checked/>
									</Form.Item>
								</Col>
							</Row>
						</Form> 
						}
						editData={editData}
						fn='campaigns'
						tColumns={[
							{
								title: 'ID',
								dataIndex: 'id',
								key: 'id',
								width: "5%",
								sorter: true,
								sortDirections: ['ascend', 'descend'],
							},
							{
								title: 'Campaign Name',
								dataIndex: 'name',
								key: 'name',
								width: "15%",
								sorter: true,
								sortDirections: ['ascend', 'descend'],
								...filerColumn(searchFields, 'name')
							},
							{
								title: 'Campaign type',
								dataIndex: 'type',
								key: 'type',
								width: "10%",
							},
							{
								title: 'Advertiser',
								key: 'account_id',
								width: "10%",
								render: (record) => {
									return record.account.name
								},
								...filterSelect(searchFields, 'account_id', requireData['accounts'])
							},
							{
								title: 'Start date',
								dataIndex: 'start_date',
								key: 'start_date',
								width: "15%",
								...filterDatePicker(searchFields, 'start_date')
							},
							{
								title: 'End date',
								dataIndex: 'end_date',
								key: 'end_date',
								width: "15%",
							},
							{
								title: 'Action',
								align: 'center',
								dataIndex: 'activated',
								key: 'activated',
								width: "10%",
								...filterCheck(searchFields, 'activated', [{text: 'active', value: 1}, {text: 'disable', value: 0}]),
								// ...filerColumn(searchFields, 'activated'),
								render: (text, record, index) => ([
									<div key='action'>
										<Switch key='sw' checked={text===0?false:true} style={{marginBottom: 5}}/>
										<Dropdown 
											key='dropdown'
											overlay={
												<Menu>
													<Menu.Item key='1'>
														<Link to={`${'/campaigns'}/${record.id}`}><ReadOutlined /> <span>View Detail </span></Link>
													</Menu.Item>
													<Menu.Item key='2'>
														<CopyOutlined /> <span>Copy</span>
													</Menu.Item>
													<Menu.Item key='3'>
														<LineChartOutlined /> <span>View Report</span>
													</Menu.Item>
													<Menu.Item
														key='4'
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
						ableCreate={true}
						searchFields={searchFields}
						onChangeSF={onChangeSF}
						tableProps={{
							expandable: {
								expandedRowRender: record => (
									<div>
									<Row style={{paddingLeft: 50}}>
										<Col span={12}>Advertiser: {record.account.name}</Col>
										<Col span={12}>Description: {record.description}</Col>
									</Row>
									<Row style={{paddingLeft: 50}}>
										<Col span={12}>Campaign name:{record.name}</Col>
										<Col span={12}>Type: {record.type}</Col>
									</Row>
									<Row style={{paddingLeft: 50}}>
										<Col span={12}>Date range: {record.start_date} - {record.end_date}</Col>
										{/* <Col span={12}>Activated: {record.activated === 0 ? <Switch/> : <Switch checked/>}</Col> */}
									</Row>
									</div>
								)
							}
						}}
						require = {require}
						requireData = {requireData}
						fieldsRequire = {[
							{ name: 'accounts', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {accounts: data}})}, 
						]}
						logData={logData}
						closeViewLog={()=>setLogData({...logData, ...{visible:false}})}	
						popup={popup}
						togglePopup={(v)=>setPopup(v)}
						confirmPopup={()=>form.submit()}
					/>
				</Route>
				<Route exact path={`/campaigns/:id`}>
					<h1>campaign id {url}</h1>
				</Route>
		</Switch>
	);
}

export default Campaigns;
