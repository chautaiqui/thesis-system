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

	const require = useCallback (async (data) => {
		// data: [promise]
		Promise.all(data).then(values => {
			_dispatch({type: 'get_require_data', data: values})
		})
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
			fieldsRequire={[
				{name: 'accounts', meta : {limit: 100, offset: 1,}}, 
				{name: 'provinces', meta : {limit: 1000, offset: 1,}}, 
				{name: 'categories', meta : {limit: 1000, offset: 1,}}, 
			]}
			action={['View Detail', 'View Report', 'View Log']}
		/>
	]);

}

export default Flights;