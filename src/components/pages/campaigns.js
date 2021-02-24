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

import { Menu, Dropdown, Button, Radio, DatePicker } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const radioStyle = {
	display: 'block',
	height: '30px',
	lineHeight: '30px',
  };

const Campaigns = () => {
    const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ requireData, setRequireData ] = useState([]);
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined});
	const {searchFields} = _state;

	const menu = (
		<Menu>
			<Menu.Item key="1">View Detail</Menu.Item>
			<Menu.Item key="2">Copy</Menu.Item>
			<Menu.Item key="3">View Report</Menu.Item>
			<Menu.Item key="4">View Log</Menu.Item>
		</Menu>
	);
	
    useEffect(() => {
		_dispatch({type: 'init_search_field', data: search})
	}, [])
	
	const updateSF = useCallback (data => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})
	}, [searchFields])

	const resetSF = useCallback (dataIndex => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, [dataIndex]: null } })
	}, [searchFields])

    const require = useCallback (async (data) => {
		// data: [promise]
		Promise.all(data).then(values => {
			setRequireData([...requireData, ...values])
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
	// console.log(requireData[0] ? requireData[0].accounts : 'undified')
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
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='account_id'
							label='Advertiser: '
							rules={[{ required: true, message: 'Required' }]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='name'
							label='Campaigns name: '
							rules={[{ required: true, message: 'Required' }]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='start_date'
							label='Date range: '
						>
							<DatePicker />
						</Form.Item>
					</Col>
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='end_date'
							label='-'
						>
							<DatePicker />
						</Form.Item>
					</Col>
				</Row>
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='description'
							label='Description: '
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='type'
							label='Type: '
						>
							<Radio.Group>
							<Radio style={radioStyle} value={'VOD'}>
								VOD
							</Radio>
							<Radio style={radioStyle} value={'Display'}>
								Display
							</Radio>
							<Radio style={radioStyle} value={'Live TV'}>
								Live TV
							</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>
				<Row >
					<Col span={20}>
						<Form.Item
							className='dp-form'
							{...utility.formItemLayout}
							name='activated'
							label='Activated: '
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
			fn='campaigns'
			tColumns={[
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
					width: "5%",
					sorter: true,
					sortDirections: ['ascend', 'descend', 'ascend'],
				},
				{
					title: 'Campaign Name',
					dataIndex: 'name',
					key: 'name',
					width: "15%",
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
					...filterSelect(searchFields, 'account_id', requireData[0])
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
					render: v => v === 0 ? <Switch checked={false} /> : <Switch checked={true} />
				},
				{
					title: 'Action',
					key: 'action',
					render: v => (
						<Dropdown overlay={menu} trigger={['click']}>
							<Button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							Action <DownOutlined />
							</Button>
						</Dropdown>
					)
				}
			]}
			searchFields={searchFields}
			updateSF={updateSF}
			tableProps={{
				size: 'small'
			}}
			resetSF = {resetSF}
            require={require}
            fieldsRequire={['accounts']}
		/>
	]);
}

export default Campaigns;

// requireData: [
// 	{
// 		account: []
// 	}, 
// 	{
// 		flight: [] 
// 	},
// 	...
// ]