import React, { useState } from 'react';
import List from '@components/commons/list';

import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { utility } from '@components/commons';

const Permissions = () => {
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
        fn='permissions'
        tColumns={[
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Guard name',
                dataIndex: 'guard_name',
                key: 'guard_name',
            },
            {
                title: 'Created at',
                dataIndex: 'created_at',
                key: 'created_at',
            },
            {
                title: 'Updated at',
                dataIndex: 'updated_at',
                key: 'updated_at',
            },
            
        ]}
      />
    );
  }
  
  export default Permissions;