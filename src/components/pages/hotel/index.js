import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
<<<<<<< HEAD
import { _getRequest } from '@pkg/api';
=======
import { _getRequest, _putRequest } from '@pkg/api';
>>>>>>> 41a9fb724437c4000cfb60b724c35fa641405ba0

import { Table, Tag, Modal } from 'antd';
import {
    Form, Input, Button, Radio, Select, DatePicker, message, Row, Col
} from 'antd';
import { filerColumn } from '../../commons';
import { FormProvider } from 'antd/lib/form/context';
import { MultiSelect } from '../../commons';
<<<<<<< HEAD
import { _putRequest } from '../../../pkg/api';
=======
>>>>>>> 41a9fb724437c4000cfb60b724c35fa641405ba0
const dataSource = [
    {
        "id": "605c71d6dd9f6b0015132de2",
        "name": "My Le",
        "description": "none",
        "contactNumber": "0912",
        "image": "placholder.jpg",
        "address": "Phuoc Long, Binhf Phuoc",
        "timeIn": "2021-03-25T11:14:32.012Z",
        "timeOut": "2021-03-25T11:14:32.012Z"
    },
    {
        "id": "605c73c348e7a0001538d0a9",
        "name": "Hoa Hong",
        "description": "nonenonenenoasi",
        "contactNumber": "0910291209",
        "image": "1616671681653JPEG_example_flower.jpg",
        "address": "KTX khu A",
        "timeIn": "2021-03-25T11:23:58.604Z",
        "timeOut": "2021-03-25T11:23:58.604Z"
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

export const Hotel = (props) => {
    const [ user ] = useContext(User.context);
    const [ lstemp, setLstemp ] = useState([]);
    const [ popup, setPopup ] = useState({open: false, data: {}});
    const [ form ] = Form.useForm();
    useEffect(()=>{
        // reset form
        console.log(popup.open)
        // get employee
        const getData = async () => {
            let re = await _getRequest('https://hotel-hrms.herokuapp.com', 'hotel')
            console.log(re)
            if (!re.success) {
                message.error('This is an error message'); // param = res.error
            }
            setLstemp(re.result.hotels);
        }
        getData();
    },[])

    const onFinish = async values => {
        console.log(values, popup.data)
        try {
          // post employee 
          let re = await _putRequest('https://hotel-hrms.herokuapp.com', 'hotel', values, popup.data.id);
        } catch (e) { 
            message(e);
        }
      };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    // dataSource = lstemp
    console.log(lstemp)
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
                width='70%' 
                visible={popup.open}
                forceRender
                keyboard
                okText={'Confirm'}
                onOk={()=>{form.submit()}}
                cancelText='Close'
                onCancel={() => {setPopup({open:false, data:{}}); form.resetFields()}}
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