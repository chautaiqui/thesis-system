import React, { useEffect, useReducer, useState, useCallback} from 'react';
import List from '@components/commons/list';

import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, filterSelect, filterCheck, filterDatePicker } from '@components/commons';
import { useLocation } from 'react-router-dom';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { Radio, DatePicker, Select } from 'antd';
import moment from 'moment';

const Campaigns = () => {
    const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}});
	const {	searchFields, requireData} = _state;
    useEffect(() => {
		_dispatch({type: 'init_search_field', data: search})
	}, [])
	
	const updateSF = useCallback (data => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})
	}, [searchFields])

	const resetSF = useCallback (dataIndex => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, [dataIndex]: null } })
	}, [searchFields])

    const require = useCallback ((v) => {
		// data: [promise]
		// Promise.all(data).then(values => {
		// 	_dispatch({type: 'get_require_data', data: values})
		// })
		_dispatch({type: 'get_require_data', data: v})
	}, [searchFields])

	if (!searchFields) return <div />;

	const onFinish = values => {
		for (let item in values) {
			if (typeof values[item] === 'object') values[item] = values[item].format('YYYY-MM-DD')
		}
		setEditData({ ...baseForm, ...values });
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
	// console.log(requireData['accounts'])
    return ([
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
			onOpen={v => {
			setBaseForm(v);
			form.resetFields();
			form.setFieldsValue(v);
			}}
			onOk={() => form.submit()}
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
					...filerColumn(searchFields, 'id')
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
					title: 'Activated',
					dataIndex: 'activated',
					key: 'activated',
					width: "10%",
					...filterCheck(searchFields, 'activated'),
					// ...filerColumn(searchFields, 'activated'),
					render: v => <Switch checked={v===0?false:true} />
				},
			]}
			searchFields={searchFields}
			updateSF={updateSF}
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
							<Col span={12}>Activated: {record.activated === 0 ? <Switch/> : <Switch checked/>}</Col>
						</Row>
						</div>
					)
				}
			}}
			resetSF = {resetSF}
            require = {require}
			requireData = {requireData}
            fieldsRequire = {[
				{name: 'accounts', meta : {limit: 100, offset: 1,}}, 
			]}
			action={['View Detail', 'Copy', 'View Report', 'View Log']}
			
		/>
	]);
}

export default Campaigns;
