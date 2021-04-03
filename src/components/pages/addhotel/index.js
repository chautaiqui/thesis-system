import React from 'react';
import { UploadImage, CustomInputNumber } from '../../commons';
import {
    Form, Input, Button, message, Row, Col
} from 'antd';

import {
    UploadOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const AddHotel = (props) => {
    const [ form ] = Form.useForm();
    

    const onFinish = async values => {
        console.log(values);
        try {
          // post hotel
          // validate values
          // const _r = await _postRequest('/api/hotel/create',values);
        } catch (e) { 
            message(e);
        }
      };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 12,
                }}
                layout="horizontal"
                initialValues={{
                    email: 'default',
                }}
            >
                <Row gutter={16}>
                    <Col xs={22} sm={22} md={12}>
                    <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Average Price" name="averagePrice">
                            <CustomInputNumber label='VND'/>
                        </Form.Item>
                        <Form.Item label="Phone" name="contactNumber">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                        
                    </Col>

                    <Col xs={22} sm={22} md={12}>
                        <Form.Item
                            name="image"
                            label="Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e)=>{
                                if (Array.isArray(e)) {
                                    return e.map(item=>item.url)[0];
                                }
                                return e && e.fileList;
                            }}
                        >
                            <UploadImage />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                span: 12,
                                offset: 6,
                            }}
                        >
                            <Button type="primary" htmlType="submit" onClick={()=>form.submit()}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>    
        </>
    )
}


