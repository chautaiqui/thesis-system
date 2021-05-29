import React, {useContext, useEffect} from 'react'
import { Row, Col, Tabs, Space, Form, Input, Button, DatePicker, message } from 'antd';
import { User } from '@pkg/reducers';
import { CustomUploadImg } from '../../commons';
import moment from 'moment';
import { _getRequest, _putRequest, _postRequest } from '@api';
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
export const AdminInfo = (props) => {
  const [ user, dispatchUser ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const [ form_pass ] = Form.useForm();
  const [ form_add ] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue({
      email: user.auth.email,
      address: user.auth.address,
      birthday: moment(user.auth.birthday),
      name: user.auth.name,
      phone: user.auth.phone,
      img: user.auth.img,
    })
  },[user])
  const onFinish = (values) => {
    console.log(values)
  }
  const changePassword = (v)=>{
    const validate = async () => {
      const res = await _postRequest('auth/login',{email:user.auth.email, password: v.current_password});
      if(!res.success) {
        message.error("Password error!");
        return;
      }
      var data = {
        password: v.new_password
      }
      var fd = new FormData();
      for (const [key, value] of Object.entries(data)){
        if(value) {
          fd.append(key, value)
        }
      }
      var myHeaders = new Headers(); 
      myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
      try {
        const res1 = await axios.put(`https://hotel-lv.herokuapp.com/api/admin/${user.auth._id}`, fd, {headers: myHeaders})
        console.log(res1)
        if(res.success && res1.status === 200){
          message.success('Change successfull!');
          // dispatchUser({ user: res.result, email: res.result.auth.email, password: v.new_password, type: 'LOGIN' })
          // window.location.reload();
          localStorage.setItem('password', v.new_password);
        }  
      } catch (e) {
        message.error(e.response.message || 'Something well wrong!');
      }
    }
    validate();
  }
  const addAdmin = (values) => {
    console.log(values);
  }
  return (
  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
    <Space direction="vertical" align='center'>
      <Tabs defaultActiveKey="1">
          <TabPane tab="Infomation" key="1">
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
              <Form.Item name="img" label="Img">
                <CustomUploadImg />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
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
                <Button type="primary" htmlType="submit">
                  Change
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Add admin" key="3">
          <Form
              form={form_add}
              {...formItemLayout}
              name="info"
              onFinish={addAdmin}
            >
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email empty!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name empty!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: 'Birthday empty!' }]}>
                <DatePicker/>
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone empty!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Address empty!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="img" label="Img">
                <CustomUploadImg />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
      </Tabs>
    </Space>
  </div>)
}
