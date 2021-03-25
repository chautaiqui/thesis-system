import React from 'react';

import {
    Form, Input, Button, Radio, Select, DatePicker, InputNumber, Switch, message, Row, Col
} from 'antd';

export const Addemployee = (props) => {
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
    return  (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{
                    span: 4,
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
                        <Form.Item label="Email" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Name" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="contactNumber">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Hotel" name="hotel">
                                <Select>
                                    <Select.Option value="1">Hotel 1</Select.Option>
                                    <Select.Option value="2">Hotel 2</Select.Option>
                                    <Select.Option value="3">Hotel 3</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={22} sm={22} md={12}>
                            <Form.Item label="Birthdate" name="dateOfBirth">
                                <DatePicker />
                            </Form.Item>
                            <Form.Item label="Role" name="role">
                                <Select>
                                    <Select.Option value="1">Manager</Select.Option>
                                    <Select.Option value="2">Employee</Select.Option>
                                    <Select.Option value="3">Intership</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Department" name="department">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Designation" name="designation">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Type" name="type">
                                <Select
                                    mode="tags"
                                    placeholder="Choose skill"
                                >
                                    <Select.Option value="1">English</Select.Option>
                                    <Select.Option value="2">Chinese</Select.Option>
                                    <Select.Option value="3">France</Select.Option>
                                    <Select.Option value="4">Other</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button offset={8} onClick={()=>form.submit()}>Submit</Button>
                        </Col>
                </Row>
            </Form>
            
        </>
    )
}