import React, { useState } from 'react';
import List from '@components/commons/list';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { utility } from '@components/commons';

const Flights = () => {
    const [ editData, setEditData ] = useState();
    const [ baseForm, setBaseForm ] = useState({});
    const [ form ] = Form.useForm();
    const onFinish = values => {
      setEditData({ ...baseForm, ...values });
    };
  
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    return ( 
      <List
        contentEdit={
          <Form 
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
                  name='diamond'
                  label='Diamond'
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className='dp-form'
                  {...utility.formItemLayout}
                  name='price'
                  label='Price'
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={22} sm={22} md={12}>
                <Form.Item
                  className='dp-form'
                  {...utility.formItemLayout}
                  name='description'
                  label='Description'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className='dp-form'
                  {...utility.formItemLayout}
                  name='enabled'
                  label='Enabled'
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form> 
        }
        onOpen={v => {
          setBaseForm(v);
          form.resetFields();
          form.setFieldsValue(v);
        }}
        onOk={() => form.submit()}
        editData={editData}
        fn='flights'
        tColumns={[
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                sorter: true
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                filters: [
                  { text: 'Male', value: 'male' },
                  { text: 'Female', value: 'female' },
                ]
            },
            {
                title: 'Total bookings',
                dataIndex: 'total_bookings',
                key: 'total_bookings',
                sorter: true
            },
            {
                title: 'Daily bookings',
                dataIndex: 'daily_bookings',
                key: 'daily_bookings',
                sorter: true
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Activated',
                dataIndex: 'activated',
                key: 'activated',
                render: v => v === 0 ? <Switch checked={false} /> : <Switch checked={true} />
            },
        ]}
      />
    );
  }
  
  export default Flights;