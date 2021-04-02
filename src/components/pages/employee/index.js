import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { _getRequest, _putRequest } from '@pkg/api';

import { Table, Tag, Modal } from 'antd';
import {
    Form, Input, Button, Radio, Select, DatePicker, message, Row, Col
} from 'antd';
import { filerColumn } from '../../commons';
import { FormProvider } from 'antd/lib/form/context';
import { MultiSelect } from '../../commons';
const dataSource = [
    {
        email: "employee1.5@gmail.com",
        password: "1234",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town123",
        skills: [
            "english",
            "japanese"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "employee2@gmail.com",
        password: "88888888",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town",
        skills: [
            "english"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "employee3@gmail.com",
        password: "88888888",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town",
        skills: [
            "english"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "manager2@gmail.com",
        password: "88888888",
        name: "manager2",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town123",
        skills: [
            "english",
            "japanese"
        ],
        department: "None",
        designation: "Hotel manager"
    }
]

// export const EmployeeReducer = (state, action) => {
//     switch (action.type) {
//       case 'init':
//         return { ...state, searchFields: extractSearch(action.data)}
//       case 'get_employee':
//         return { ...state, searchFields: action.data };
//       default:
//         return state;
//     } 
// }

export const Employee = (props) => {
    const [ user ] = useContext(User.context);
    const [ lstemp, setLstemp ] = useState([]);
    const [ popup, setPopup ] = useState({open: false, data: {}});
    const [ form ] = Form.useForm();
    useEffect(()=>{
        // reset form
        console.log(popup.open)
        // get employee
        const getData = async () => {
            const res = await _getRequest('hotel', {}, ['605c71d6dd9f6b0015132de2','employee']);
            if (!res.success) {
                message.error('This is an error message'); // param = res.error
            }
            setLstemp(res.result.employees);
            
        }
        getData();
    },[])

    const onFinish = async values => {
        console.log(values)
        const employee = lstemp.find(item => item.email === values.email)
        console.log(employee, employee.id)
        try {
           // post employee
            const res = _putRequest('employee', values, employee.id)
            // console.log(res)
            // window.location.reload()
        } catch (e) { 
            message.error(e);
        }
      };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    // dataSource = lstemp
    return (
        <>
            <Table 
                rowKey='id'
                loading={lstemp.length === 0}
                dataSource={lstemp} 
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
                                setPopup({open: true, data:v});
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
                onOk={()=>{form.submit();setPopup({open:false, data:{}});}}
                cancelText='Close'
                onCancel={() => {setPopup({open:false, data:{}}); form.resetFields()}}
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
                                getValueFromEvent={v => {
                                    console.log(v)
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