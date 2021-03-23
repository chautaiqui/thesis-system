import React, { useEffect, useReducer, useState, useCallback, useContext } from 'react';
import List from '@components/commons/list';
import { User } from '@pkg/reducers';

import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, filterSelect, filterCheck, filterDatePicker } from '@components/commons';
import { useLocation } from 'react-router-dom';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { Radio, DatePicker, Select, Button, Menu, Dropdown } from 'antd';
import { DownOutlined, ReadOutlined, CopyOutlined, LineChartOutlined, SolutionOutlined } from '@ant-design/icons';
import moment from 'moment';

const Campaigns = () => {

    const { search } = useLocation();
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}, editData: {}, baseForm: {}});
	const {	searchFields, requireData, editData, baseForm } = _state;
	const [ user ] = useContext(User.context);
    const [ popup, setPopup ] = useState({open: false, title: '', option: 'create'});

	const listRef = React.useRef();

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
		
	// console.log(requireData['accounts'])
    return (
		<List
			ref={listRef}
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
					responsive: ["sm"],
					sorter: true,
					sortDirections: ['ascend', 'descend'],
				},
				{
					title: 'Campaign Name',
					dataIndex: 'name',
					key: 'name',
					responsive: ["sm"],
					sorter: true,
					sortDirections: ['ascend', 'descend'],
					...filerColumn(searchFields, 'name')
				},
				{
					title: 'Campaign type',
					dataIndex: 'type',
					key: 'type',
					responsive: ["sm"],
				},
				{
					title: 'Advertiser',
					key: 'account_id',
					responsive: ["sm"],
					render: (record) => {
						return record.account.name
					},
					...filterSelect(searchFields, 'account_id', requireData['accounts'])
				},
				{
					title: 'Start date',
					dataIndex: 'start_date',
					key: 'start_date',
					responsive: ["sm"],
					...filterDatePicker(searchFields, 'start_date')
				},
				{
					title: 'End date',
					dataIndex: 'end_date',
					key: 'end_date',
					responsive: ["sm"],
				}
			]}
			tActions={
				[
					{name: 'View Detail', label: <ReadOutlined />},
					{name: 'Copy', label: <CopyOutlined />},
					{name: 'View Report', label: <LineChartOutlined />},
					{name: 'View Log', label: <SolutionOutlined />, event: (record) => listRef.current.toogleLog(record)},
				]
			}
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
			popup={popup}
			togglePopup={(v)=>setPopup(v)}
			confirmPopup={()=>form.submit()}
		/>
	);
}

export default Campaigns;
