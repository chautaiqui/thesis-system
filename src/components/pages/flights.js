import React, { useEffect, useReducer, useState, useCallback} from 'react';
import List from '@components/commons/list';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, filterCheck } from '@components/commons';
import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';

const Flights = () => {
	const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ form ] = Form.useForm();
	const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined});
	const {searchFields} = _state;
	useEffect(() => {
		_dispatch({type: 'init_search_field', data: search})
	}, [])
	
	const updateSF = useCallback (meta => {
		if(meta.offset === searchFields.offset && meta.limit === searchFields.limit && searchFields.total === meta.total ) return;
		_dispatch({type: 'update_search_field', data: { ...searchFields, ...meta }})
	}, [searchFields])

	if (!searchFields) return <div />;

	const onFinish = values => {
		setEditData({ ...baseForm, ...values });
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
	let lR = () => {};
	const lstFilter = ['name' , 'activated']
	return ([
		(lstFilter.map(item => {
			if (includeObj(searchFields, item)) {
				return <Tag
						key={item}
						// onClose={_dispatch({type: 'reset_search_filter_field', data: item})}
						closable
						onClose={e => {
							// e.preventDefault();
							_dispatch({type: 'reset_search_filter_field', data: item})
							_dispatch({type: 'update_search_field', data: { ...searchFields } })
						}}
					>
						{`${item[0].toUpperCase()}${item.slice(1)}: ${searchFields[item]}`}
					</Tag>
			}
		})),
		<List
			key='list'
			listRef={fn => lR = fn}
			contentEdit={
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
					name='diamond'
					label='Diamond'
					rules={[{ required: true, message: 'Required' }]}
					>
					<Input />
					</Form.Item>
					<Form.Item
					className='dp-form'
					{...utility.formItemLayout}
					name='price'
					label='Price'
					rules={[{ required: true, message: 'Required' }]}
					>
					<Input />
					</Form.Item>
				</Col>
				<Col xs={22} sm={22} md={12}>
					<Form.Item
					className='dp-form'
					{...utility.formItemLayout}
					name='description'
					label='Description'
					>
					<Input />
					</Form.Item>
					<Form.Item
					className='dp-form'
					{...utility.formItemLayout}
					name='enabled'
					label='Enabled'
					valuePropName='checked'
					>
					<Switch />
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
			fn='flights'
			tColumns={[
				{
					title: 'Id',
					dataIndex: 'id',
					key: 'id',
					sorter: true,
					sortDirections: ['ascend', 'descend', 'ascend'],
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
					title: 'Total bookings',
					dataIndex: 'total_bookings',
					key: 'total_bookings',
				},
				{
					title: 'Daily bookings',
					dataIndex: 'daily_bookings',
					key: 'daily_bookings',
				},
				{
					title: 'Price',
					dataIndex: 'price',
					key: 'price',
				},
				{
					title: 'Activated',
					dataIndex: 'activated',
					key: 'activated',
					...filterCheck(),
					// ...filerColumn(searchFields, 'activated'),
					render: v => v === 0 ? <Switch checked={false} /> : <Switch checked={true} />
				},
			]}
			searchFields={searchFields}
			updateSF={updateSF}
			tableProps={{
			onChange: Object.keys(searchFields).length === 0 ? () => {} :
				(pagination,f,s) => {
					console.log(f, s)
					let fs = {};
					for (let item in f) {
						if (Array.isArray(f[item]) && f[item][0]) {
							fs = { ...fs, ...{[item]: f[item]}}
						} else if (!Array.isArray(f[item])) {
							// console.log('reset: ',item)
							_dispatch({type: 'reset_search_filter_field', data: item})
						}
					}
					if (Object.keys(s).length !== 0) {
						fs = { ...fs, ...{order: `${s.field || 'id'}|${s.order.slice(0, s.order.length-3)}`}}
					}
					_dispatch({type: 'update_search_field', data: { ...searchFields, offset: pagination.current, limit: pagination.pageSize, ...fs } })
				} 
			}}
		/>
	]);
}
function includeObj(obj,item) {
	for (let x in obj) {
	  if (item === x) return true
	}
	return false
}
export default Flights;