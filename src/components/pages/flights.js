import React, { useEffect, useReducer, useState, useCallback} from 'react';
import List from '@components/commons/list';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import { Button, Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn } from '@components/commons';
import { useLocation } from 'react-router-dom';


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
	let input;
	return ( 
	<List
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
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				// filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				// 	<div style={{ padding: 8 }}>
				// 	<Input
				// 		ref={(node) => {
				// 			input = node;
				// 		  }}
				// 		placeholder={`Search name`}
				// 		style={{ width: 188, marginBottom: 8, display: 'block' }}
				// 	/>
				// 	<Space>
				// 		<Button
				// 			type="primary"
				// 			onClick={() => {
				// 				// confirm();
				// 				_dispatch({ type: 'update_search_field', data: { ...searchFields, name: input.state.value} })
				// 			}}
				// 			icon={<SearchOutlined />}
				// 			size="small"
				// 			style={{ width: 90 }}
				// 		>
				// 			Search
				// 		</Button>
				// 	</Space>
				// 	</div>
				// ),
				// filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
				// filterDropdown: ({
				// 	setSelectedKeys,
				// 	selectedKeys,
				// 	confirm,
				// 	clearFilters
				//   }) => (
				// 	<div style={{ padding: 8 }}>
				// 	  <Input
				// 		placeholder={`Search name`}
				// 		value={selectedKeys[0]}
				// 		onChange={(e) =>
				// 		  setSelectedKeys(e.target.value ? [e.target.value] : [])
				// 		}
				// 		onPressEnter={() =>
				// 		  confirm()
				// 		}
				// 		style={{ width: 188, marginBottom: 8, display: "block" }}
				// 	  />
				// 	  <Space>
				// 		<Button
				// 		  type="primary"
				// 		  onClick={() => confirm()}
				// 		  icon={<SearchOutlined />}
				// 		  size="small"
				// 		  style={{ width: 90 }}
				// 		>
				// 		  Search
				// 		</Button>
				// 		<Button
				// 		  onClick={() => clearFilters()}
				// 		  size="small"
				// 		  style={{ width: 90 }}
				// 		>
				// 		  Reset
				// 		</Button>
				// 	  </Space>
				// 	</div>
				//   ),
				// filterIcon: (filtered) => (
				// <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
				// ),
				// defaultFilteredValue: [searchFields.name] || ['']
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
				...filerColumn(searchFields, 'activated'),
				render: v => v === 0 ? <Switch checked={false} /> : <Switch checked={true} />
			},
		]}
		searchFields={searchFields}
		updateSF={updateSF}
		tableProps={{
		onChange: Object.keys(searchFields).length === 0 ? () => {} :
			(pagination,f,s) => {
			console.log(f, s)
			// let _or = 'asc';
			// if (s.order) _or = s.order.slice(0, s.order.length-3)
			// let ord = `${s.field || 'id'}|${_or}`
			// let newMeta = Object.assign({}, searchFields, {
			//   offset: pagination.current,
			//   limit: pagination.pageSize,
			//   order: ord
			// });
			// var queryString = '';
			// delete newMeta.q;
			// delete newMeta.total;
			// delete newMeta.fields;
			// for (let x in newMeta ) {
			//   if (newMeta[x]) queryString += `${!queryString.length ? '?' : '&'}${x}=${newMeta[x]}`;
			// }
			// history.push(queryString);
			_dispatch({type: 'update_search_field', data: { ...searchFields, offset: pagination.current, limit: pagination.pageSize, ...f } })
			} 
		}}
	/>
	);
}

export default Flights;