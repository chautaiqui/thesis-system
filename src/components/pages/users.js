import React, { useState } from 'react';
import List from '@components/commons/list';
import Select from 'antd/lib/select';

import Form from 'antd/lib/form';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';

import { utility } from '@components/commons';

const Users = () => {
  const [ editData, setEditData ] = useState();
  const [ baseForm, setBaseForm ] = useState({});
  const [ form ] = Form.useForm();
  const onFinish = values => {
    const _v = {
      roles: values.roles.split(',').map(i => i.trim())
    }
    setEditData({ ...baseForm, ..._v });
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
            <Col xs={22} sm={22} md={22}>
              <Form.Item
                className='dp-form'
                {...utility.formItemLayout}
                name='id'
                label='Phone'
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={22} sm={22} md={22}>
              <Form.Item
                className='dp-form'
                {...utility.formItemLayout}
                name='roles'
                label='Roles'
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form> 
      }
      onOpen={v => {
        setBaseForm(v);
        form.resetFields();
        form.setFieldsValue({ ...v, roles: v.roles.join(',') });
      }}
      onOk={() => form.submit()}
      editData={editData}
      fn='users'
      tColumns={[
        {
          title: 'Phone',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Roles',
          dataIndex: 'roles',
          key: 'roles',
          render: v => <Select mode="multiple" style={{ width: '100%' }} value={v.filter(i => typeof i === 'string' && i.length > 0)}></Select>
        }
      ]}
    />
  );
}

export default Users;