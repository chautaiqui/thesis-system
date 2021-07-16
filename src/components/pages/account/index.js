import React, { useContext, useEffect, useState } from 'react';
import { Space, Form, Input, Button, DatePicker, Avatar, Select, Tabs, message } from 'antd';
import { User } from '@pkg/reducers';
import { CustomUploadImg, DynamicSelect } from '../../commons';
import moment from 'moment';
import { _getRequest, putMethod, postMethod } from '@api';
import axios from 'axios';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const { TabPane } = Tabs;
export const Account = props => {
  const [ _user, dispatchUser ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const [ form_pass ] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    form.setFieldsValue({
      email: _user.auth.email,
      availableDayoffNumber: _user.auth.availableDayoffNumber,
      birthday: moment(_user.auth.birthday),
      department: _user.auth.department,
      designation: _user.auth.designation,
      name: _user.auth.name,
      phone: _user.auth.phone,
      baseSalary: _user.auth.baseSalary,
      address: _user.auth.address,
      skills: _user.auth.skills,
      img: _user.auth.img
    })
  },[_user])
  const onFinish = (v) => {
    console.log(v);
    setLoading(true);
    const up = async () => {
      var data = {
        email: v.email,
        birthday: v.birthday.format( 'DD-MM-YYYY', 'DD/MM/YYYY'),
        department: v.department,
        designation: v.designation,
        name: v.name,
        phone: v.phone,
        baseSalary: v.baseSalary,
        address: v.address,
        img: typeof v.img === 'object' ? v.img : undefined
      }
      var fd = new FormData();
      for (const [key, value] of Object.entries(data)){
        if(value) {
          fd.append(key, value)
        }
      }
      v.skills.forEach(item => {
        fd.append('skills', item)
      })
      const res = await putMethod('employee', fd, _user.auth._id);
      if (res.success) {
        message.success('Update information successfully');
        setLoading(false);
        dispatchUser({
          type: 'UPDATE', user: res.result
        })
        return;
      } else {
        message.error(res.error);
        return;
      }
    }
    up();
  }
  const changePassword = (values) => {
    const validate = async () => {
      setLoading(true);
      const res = await postMethod('auth/login',{email:_user.auth.email, password: values.current_password});
      if(!res.success) {
        message.error("Password well wrong!");
        setLoading(false);
        return;
      }
      var data = {
        password: values.new_password
      }
      const res_p = await putMethod('employee', data, _user.auth._id);
      if(res_p.success) {
        message.success('Change password successfully!');
        localStorage.setItem('password', values.new_password);
        form_pass.resetFields();
        setLoading(false);
        return;
      } else {
        message.error(res.error);
        setLoading(false);
        return;
      }
    }
    validate();
  }
  return <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
     <Space direction="vertical" align='center'>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Infomation" key="1">
            <div style={{display: 'flex', justifyContent: 'center'}}><Avatar src={_user.auth.img} size={100} style={{marginBottom: 10}}/></div>
            <Form
              form={form}
              {...formItemLayout}
              name="info"
              onFinish={onFinish}
            >
              <Form.Item name="email" label="Email">
                <Input disabled/>
              </Form.Item>
              <Form.Item name="name" label="Name">
                <Input />
              </Form.Item>
              <Form.Item name="birthday" label="Birthday">
                <DatePicker/>
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>
              <Form.Item name="skills" label="Skills">
                <DynamicSelect />
              </Form.Item>
              <Form.Item name="department" label="Department">
                <Input disabled/>
              </Form.Item>
              <Form.Item name="designation" label="Designation">
                <Input disabled/>
              </Form.Item>
              <Form.Item name="baseSalary" label="BaseSalary">
                <Input disabled/>
              </Form.Item>
              <Form.Item name="availableDayoffNumber" label="Day off">
                <Input disabled/>
              </Form.Item>
              <Form.Item name="img" label="Avata">
                <CustomUploadImg/>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading} className="btn-box-shawdow">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Change password" key="2">
            <Form
              form={form_pass}
              {...{
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 10 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 14 },
                },
              }}
              name="password"
              onFinish={changePassword}
            >
              <Form.Item name="current_password" label="Current Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name="new_password" label="New Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                 <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['new_password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading} className="btn-box-shawdow">
                  Change
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        
     </Space>
  </div>
}