import React, { useEffect, useReducer, useState, useCallback, useContext } from 'react';
import { User } from '@pkg/reducers';
import List from '@components/commons/list';

import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, CustomSelectObj } from '@components/commons';

import Form from 'antd/lib/form';
import { Switch, Row, Col, Input } from 'antd';
import { EditOutlined, SolutionOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

// import { getRequest } from '@api';


const Advertiser = (props) => {
    const { model } = props;
    const { search } = useLocation();
	
    const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}, editData: {}, baseForm: {}});
	const { searchFields, requireData, editData, baseForm } = _state
	const [ user ] = useContext(User.context);
	
    const [ popup, setPopup ] = useState({open: false, title: '', option: 'update'});
    
    const listRef = React.useRef();

    useEffect(() => {
        let isCancelled = false;
		if(!isCancelled) _dispatch({type: 'init_search_field', data: search+`&model=${model}`})
        return () => isCancelled = true;
	}, [model, search])
    
    const onChangeSF = data => _dispatch({type: 'update_search_field', data: { ...searchFields, ...data }}) 

    const require = async (v) => {
		_dispatch({type: 'get_require_data', data: v})
	}

    if (!searchFields) return <div />;
	const onFinish = values => {
        // let new_values = {...values, ...{sale_id: values.sale.id}};
        /* update sale_id */
        _dispatch({type: 'set_editdata', data: { ...baseForm, ...values }});
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
   
    const updateRecord = (record) => {
        // console.log('update', record)
        setPopup({...popup,...{open: true,title: `Update Advertiser : ${record.id} ${record.name}`}})
        let fields = []; // field JSON stringtify
        for (let x in record) {
            if (fields.includes(x) && !Array.isArray(record[x])) {
                record[x] = JSON.parse(record[x])
            }
        }
        console.log(record)
        _dispatch({type: 'set_baseform', data: record});
        form.resetFields();
        form.setFieldsValue(record);
    }
    return ([
        <List 
            key='list'
            ref={listRef}
            contentEdit={
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
                                // getValueFromEvent={v => {
                                //     return requireData['users'].find(item=>item.id === v)
                                    // return typeof v === 'object' ? v : requireData['users'].find(item=>item.id === v)
                                    // return requireData['users'].find(item=>item.id === v) || null
                                // }}
                            >
                                <CustomSelectObj
                                    disabled={!requireData['users']} 
                                    notFound={'Not found saler'} 
                                    data={requireData['users'] ? requireData['users'].map(item => ({label: item.name, value: item.id})) : [{label: 'Loading', value: ''}]}
                                />
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
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            }
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
                    render: s => s ? s.name : '',
                    ...filerColumn(searchFields, 'sale')
				},
                {
					title: 'Notes',
					dataIndex: 'notes',
					key: 'notes',
				}, 
            ]}
            tActions={
                [
                    {name: 'Update', label: <EditOutlined />, event: ()=>{}},
                    {name: 'View Log', label: <SolutionOutlined />, event: (record) => listRef.current.toogleLog(record)},
                ]
            }
            ableCreate={true}
            searchFields={searchFields}
			onChangeSF={onChangeSF}
            tableProps={{
            }}
            require={require}
			requireData = {requireData}
            fieldsRequire={[
				{ name: 'users', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {users: data}})}, 
			]}
            popup={popup}
            togglePopup={(v)=>setPopup(v)}
            // openPopup={(v)=>setPopup(v)}
            // closePopUp={()=>setPopup({...popup,...{open:false}})}
            confirmPopup={()=>form.submit()}
            // action={['Update', 'View Log']}

        />
    ])
}
export default Advertiser;
