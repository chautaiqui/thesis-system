import React, { useEffect, useReducer } from 'react';
// import { User } from '@pkg/reducers';
import { _getRequest, _putRequest, _postRequest } from '@pkg/api';

import { Table, Tag, Modal } from 'antd';
import {
    Form, Input, Button, message, Row, Col
} from 'antd';
import { filerColumn } from '../../commons';
// import { MultiSelect } from '../../commons';

const HotelReducer = (state, action) => {
    switch (action.type) {
        case 'GET_DATA_SUCCESS':
            return { ...state, data: action.data, behavior: 'stall' }
        case 'GET_DATA_ERROR':
            return { ...state, data: [], behavior: 'stall' };
        case 'OPEN_POPUP':
            return { ...state, popup: action.popup, behavior: 'stall' };
        case 'CLOSE_POPUP':
            return { ...state, popup: action.popup, behavior: 'stall' };
        case 'RELOAD':
            return { ...state, behavior: 'init', popup: action.popup };
        default:
            return state;
    } 
}
export const Hotel = (props) => {
    const [ state, dispatch ]= useReducer(HotelReducer, {
        behavior: 'init',
        data: [],
        popup: {open: false, data: {}}
    });
    const { data, popup, behavior } = state;
    const [ form ] = Form.useForm();
    
    const getData = async () => {
        try {
            let re = await _getRequest('hotel');
            if (!re.success) {
                message.error(re.error); // param = res.error
            }
            // setLstemp(re.result.hotels);
            dispatch({type:'GET_DATA_SUCCESS', data: re.result.hotels});
        } catch (e) {
            message(e);
            dispatch({type: 'GET_DATA_ERROR'});
        }
    }

    useEffect(() => {
        switch (state.behavior) {
            case 'init':
                getData();
                return;
            case 'stall':
                return ;
            default:
                break;
        }
    }, [state.behavior])

    const onFinish = async values => {
        try {
            // post employee 
            let re = await _putRequest('hotel', values, popup.data.id);
            if(re.success) {
                message.success(re.result.message);
                // dispatch({type: 'CLOSE_POPUP', popup: {open:false, data:{}}})
                dispatch({type: 'RELOAD', popup: {open:false, data:{}}});
                form.resetFields();
            }
        } catch (e) { 
            message.error(e);
        }
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        message.error(errorInfo);
    };
    console.log(behavior)
    return (
        <>
            <Table 
                rowKey='id'
                loading={data.length === 0}
                dataSource={data} 
                columns={
                    [
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            align: 'center',
                            key: 'name',
                            ...filerColumn([], 'name'),
                            onFilter: (value, record) =>
                                record.name
                                    ? record.name.toString().toLowerCase().includes(value.toLowerCase())
                                    : '',
                        },
                        {
                            title: 'description',
                            dataIndex: 'description',
                            align: 'center',
                            key: 'description',
                        },
                        {
                            title: 'Address',
                            dataIndex: 'address',
                            align: 'center',
                            key: 'address',
                        },
                        {
                            title: 'Phone',
                            dataIndex: 'contactNumber',
                            align: 'center',
                            key: 'contactNumber',
                            render: tags => (
                              <>
                                <Tag color={'blue'} key={'phone'}>
                                    {tags}
                                </Tag>
                              </>
                            ),
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            key: 'action',
                            render: v => <Button onClick={()=>{
                                dispatch({type: 'OPEN_POPUP', popup: {open: true, data:v}})
                                form.setFieldsValue(v);
                            }}>Edit</Button>
                        },
                        
                    ]
                } 
            />; 
            <Modal
                centered
                closable={false}
                maskClosable={false}
                title= {popup.data.name ? `Edit ${popup.data.name}`: 'Edit' }
                key='modal_update'
                width='70%' 
                visible={popup.open}
                forceRender
                keyboard
                okText={'Confirm'}
                onOk={()=>{form.submit()}}
                cancelText='Close'
                onCancel={() => {
                    dispatch({type: 'CLOSE_POPUP', popup: {open:false, data:{}}})
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 12,
                    }}
                    layout="horizontal"
                >
                    <Row gutter={16}>
                        <Col xs={22} sm={22} md={24}>
                            <Form.Item label="Name" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="contactNumber">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description" name="description">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}