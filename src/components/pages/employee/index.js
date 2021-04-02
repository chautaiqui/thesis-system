import React, { useReducer, useEffect } from 'react';
import { User } from '@pkg/reducers';
import { _getRequest, _putRequest } from '@pkg/api';

import { Table, Tag, Modal } from 'antd';
import {
    Form, Input, Button, Select, message, Row, Col
} from 'antd';
import { filerColumn } from '../../commons';
import { MultiSelect } from '../../commons';


const EmployeeReducer = (state, action) => {
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

export const Employee = (props) => {
    const [ state, dispatch ]= useReducer(EmployeeReducer, {
        behavior: 'init',
        data: [],
        popup: {open: false, data: {}}
    });
    const [ form ] = Form.useForm(); 
    const { data, popup } = state;
    const getData = async () => {
        try {
            const res = await _getRequest('hotel', {}, ['605c71d6dd9f6b0015132de2','employee']);
            if (!res.success) {
                message.error(res.error); 
            }
            dispatch({type:'GET_DATA_SUCCESS', data: res.result.employees});
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
            console.log(values)
           // post employee
            const re = await _putRequest('employee', values, popup.data.id);
            console.log(re)
            if(re.success) {
                message.success(re.result.message);
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
                            title: 'Phone',
                            dataIndex: 'contactNumber',
                            align: 'center',
                            key: 'contactNumber',
                        },
                        {
                            title: 'Address',
                            dataIndex: 'address',
                            align: 'center',
                            key: 'address',
                        },
                        {
                            title: 'Skills',
                            dataIndex: 'skills',
                            align: 'center',
                            key: 'skills',
                            render: tags => (
                              <>
                                {tags.map((tag,index) => {
                                  let color = 'geekblue';
                                  return (
                                    <Tag color={color} key={index}>
                                      {tag.toUpperCase()}
                                    </Tag>
                                  );
                                })}
                              </>
                            ),
                        },
                        {
                            title: 'Department',
                            dataIndex: 'department',
                            align: 'center',
                            key: 'department',
                        },
                        {
                            title: 'Designation',
                            dataIndex: 'designation',
                            align: 'center',
                            key: 'designation',
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            key: 'action',
                            render: (v,r) => <Button type='primary' onClick={()=>{
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
                width='90%' 
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
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 14
                    }}
                    layout="horizontal"
                >
                    <Row gutter={16}>
                        <Col xs={22} sm={22} md={12}>
                            <Form.Item label="Email" name="email">
                                <Input disabled/>
                            </Form.Item>
                            <Form.Item label="Name" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="contactNumber">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Hotel">
                                <Select>
                                    <Select.Option value="1">Hotel 1</Select.Option>
                                    <Select.Option value="2">Hotel 2</Select.Option>
                                    <Select.Option value="3">Hotel 3</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={22} sm={22} md={12}>
                            {/* <Form.Item label="Birthday" name="dateOfBirth">
                                <DatePicker />
                            </Form.Item> */}
                            <Form.Item label="Role">
                                <Select>
                                    <Select.Option value="1">Manager</Select.Option>
                                    <Select.Option value="2">Employee</Select.Option>
                                    <Select.Option value="3">Intership</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Department" name='department'>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Designation">
                                <Input />
                            </Form.Item>
                            <Form.Item 
                                label="Skills"
                                name="skills"
                                getValueFromEvent={v => {
                                    return v;
                                }}
                            >
                                <MultiSelect
                                    maxTag={3}
                                    listValue={[{label: 'japanese', value: 'japanese'},{label: 'english', value: 'english'},{label: 'other', value: 'other'}]}
                                    placeholder={'choose skill'}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}