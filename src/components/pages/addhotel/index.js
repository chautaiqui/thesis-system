import React from 'react';

import {
    Form, Input, Button, message, Row, Col, Upload
} from 'antd';

import {
    UploadOutlined
} from '@ant-design/icons';

export const AddHotel = (props) => {
    const [ form ] = Form.useForm();
    

    const onFinish = async values => {
        console.log(values)
        try {
          // post employee 
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
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="contactNumber">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="contactNumber">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Address" name="Address">
                            <Input />
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

                    <Col xs={22} sm={22} md={12}>
                        <Form.Item
                            name="image"
                            label="Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e)=>{
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                        >
                            <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>    
        </>
    )
}


const MuiltiUploadImage = (props) => {
    const {value = [], onChange} = props;
    return (
        <>
        
        </>
    )
}