import React, { useEffect, useReducer, useState, useCallback} from 'react';
import List from '@components/commons/list';

import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, CustomSwitch, CustomSelectObj } from '@components/commons';

import Form from 'antd/lib/form';
import { Switch, Row, Col, Input, Select } from 'antd';
import { useLocation } from 'react-router-dom';


const Publisher = () => {
    const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}});
	const { searchFields, requireData } = _state;

    useEffect(() => {
		_dispatch({type: 'init_search_field', data: search+'&model=publisher'})
	}, [])
    
    const updateSF = useCallback (data => {
		// if(meta.offset === searchFields.offset && meta.limit === searchFields.limit && searchFields.total === meta.total ) return;
		_dispatch({type: 'update_search_field', data: { ...searchFields, ...data }})
	}, [searchFields])

	const resetSF = useCallback (dataIndex => {
		_dispatch({type: 'update_search_field', data: { ...searchFields, [dataIndex]: null } })
	}, [searchFields])

    const require = useCallback (async (v) => {
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
                    className={'advertiser-form'}
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
                                name='sale'
                                label='Sale'
                                getValueFromEvent={v => {
                                    return requireData['users'].find(item=>item.id === v)
                                }}
                            >
                                <CustomSelectObj notFound={'Not found saler'} data={requireData['users'] ? requireData['users'].map(item => ({label: item.name, value: item.id})) : []}/>
                            </Form.Item>
                        </Col>
                        <Col xs={22} sm={22} md={12}>
                            <Form.Item
                                className='dp-form'
                                {...utility.formItemLayout}
                                name='note'
                                label='Note'
                                >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className='dp-form'
                                {...utility.formItemLayout}
                                name='activated'
                                label='Activated'
                                >
                                <CustomSwitch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            }
            onOpen={v => {
				// edit v
				let fields = [];
				for (let x in v) {
					if (fields.includes(x) && !Array.isArray(v[x])) {
						v[x] = JSON.parse(v[x])
					}
				}
				console.log(v)
				setBaseForm(v);
				form.resetFields();
				form.setFieldsValue(v);
			}}
            onOk={() => form.submit()}
            editData={editData}
            fn='accounts'   
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
					...filerColumn(searchFields, 'name')
				},
                {
					title: 'Sales',
					dataIndex: 'sale',
					key: 'sale',
                    render: s => s ? s.name : ''
				},
                {
					title: 'Notes',
					dataIndex: 'notes',
					key: 'notes',
				},
                {
					title: 'Activated',
					dataIndex: 'activated',
					key: 'activated',
					render: v => v === 0 ? <Switch/> : <Switch checked/>
				},
                
            ]}
            searchFields={searchFields}
			updateSF={updateSF}
            tableProps={{
            }}
            resetSF = {resetSF}
            require={require}
			requireData = {requireData}
            fieldsRequire={[
				{name: 'users', meta : {limit: 1000, offset: 1,}}, 
			]}
            action={['Update', 'View Log']}
        />
    ])
}
export default Publisher;
