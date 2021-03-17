import React, { useEffect, useReducer, useState, useCallback, useContext } from 'react';
import { User } from '@pkg/reducers';
import List from '@components/commons/list';

import { PageReducer } from '@pkg/reducers';
import { utility, filerColumn, CustomSwitch, CustomSelectObj } from '@components/commons';

import Form from 'antd/lib/form';
import { Switch, Row, Col, Input, Button } from 'antd';
import { FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

import { getRequest } from '@api';


const Advertiser = (props) => {
    const { model } = props;
    const { search } = useLocation();
	const [ editData, setEditData ] = useState();
	const [ baseForm, setBaseForm ] = useState({});
	const [ form ] = Form.useForm();

    const [ _state, _dispatch] = useReducer(PageReducer, {searchFields: undefined, requireData: {}});
	const { searchFields, requireData } = _state;
	const [ user ] = useContext(User.context);
	const [ logData, setLogData] = useState({visible: false, title: "", data: []});
    const [ popup, setPopup ] = useState({open: false, title: ''});
    useEffect(() => {
        let isCancelled = false;
		if(!isCancelled) _dispatch({type: 'init_search_field', data: search+`&model=${model}`})
        return () => isCancelled = true;
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
        let new_values = {...values, ...{sale_id: values.sale.id}};
        /* update sale_id */
		setEditData({ ...baseForm, ...new_values });
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};
    const viewLog = (id) => {
        // console.log('view log', id)
        // console.log(user)
        // set visiable modal
        (async()=>{
            try {
                const reps = await getRequest('accounts', user.api_token, {} , [id, 'audit']);
                const {success, result} = reps;
                if (!success) return;
                let span_data = [];
                result.data.map(item => {
                    let temp_arr = [];
                    for (let x in item.new_values) {
                        temp_arr = [... temp_arr, {
                            date: item.created_at,
                            user: `${item.user.id} - ${item.user.name} ${item.user.email}`,
                            event: item.event,
                            field: x,
                            old_value: item.old_values[x] || null,
                            new_value: item.new_values[x] ,
                            rowSpan: Object.keys(item.new_values)[0] === x ? Object.keys(item.new_values).length : 0,
                        }]
                    }
                    span_data = [...span_data, ...temp_arr]
                })
                setLogData({...logData, ...{visible: true, title: `Changelog: accounts/${id}`, data: span_data}})
            } catch(e) {
                return;
            }
        })()
    }
    const closeViewLog = () => {
        setLogData({...logData, ...{visible:false}})
    }
    const closePopUp = () => {
        setPopup({...popup,...{open:false}});
    }
    const openPopUp = (data) => {
        setPopup(data);
    }
    const tooglePopup = (data) => {
        setPopup(data);
    }
    const UpdateRecord = (record) => {
        // console.log('update', record)
        openPopUp({open: true,title: `Update Advertiser : ${record.id} ${record.name}`})
        let fields = []; // field JSON stringtify
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
    return ([
        <List 
            key='list'
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
					...filerColumn(searchFields, 'id')
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
                    title: 'Action',
                    align: 'center',
                    dataIndex: 'activated',
					key: 'activated',
					render: (text, record, index) => ([
                        <Switch key='sw' checked={text===0?false:true} style={{display: 'inline-block', marginLeft:10}}/>,
                        <Button title="Update" key='edit' size='small' style={{display: 'inline-block',marginLeft:2,borderRadius:'50%',background: 'white'}} 
                            // onClick={()=>{Object.keys(requireData).length===0?(()=>{})(): UpdateRecord(record)}}><FormOutlined /></Button>,
                            onClick={() =>UpdateRecord(record)}><FormOutlined /></Button>,
                        <Button title="ViewLog" key='viewlog' size='small' style={{display: 'inline-block',marginLeft:2,borderRadius:'50%',background: 'white'}} onClick={()=> viewLog(record.id)}><SolutionOutlined /></Button>,
                    ])
                }
                
            ]}
            searchFields={searchFields}
			updateSF={updateSF}
            tableProps={{
            }}
            resetSF = {resetSF}
            require={require}
			requireData = {requireData}
            fieldsRequire={[
				{ name: 'users', meta : {limit: 1000, offset: 1}, onChange: data => _dispatch({type: 'get_require_data', data: {users: data}})}, 
			]}
            logData={logData}
            closeViewLog={closeViewLog}
            popup={popup}
            openPopUp={openPopUp}
            tooglePopup={tooglePopup}
            // action={['Update', 'View Log']}
        />
    ])
}
export default Advertiser;
