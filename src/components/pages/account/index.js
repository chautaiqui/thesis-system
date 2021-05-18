import React, { useContext, useEffect} from 'react';
import { Space, Form, Input, Button, DatePicker, Avatar, Select, Tabs, message } from 'antd';
import { User } from '@pkg/reducers';
import { CustomUpload } from '../../commons';
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
export const Account = props => {
  const [ _user, dispatchUser ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const [ form_pass ] = Form.useForm();

  useEffect(()=>{
    console.log(moment(_user.auth.birthday))
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
    })
  },[_user])
  const onFinish = (v) => {
    console.log(v) 
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
        skills: v.skills,
        img: v.img[0] || undefined
      }
      var fd = new FormData();
      for (const [key, value] of Object.entries(data)){
        if(value) {
          fd.append(key, value)
        }
      }
      console.log(fd)
      // var myHeaders = new Headers(); 
      // myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
      // try {
      //   const res = await axios.put(`https://hotel-lv.herokuapp.com/api//employee/${_user.auth._id}`, fd, {headers: myHeaders})
      //   console.log(res)
      //   if(res.status === 200){
      //     message.success('Change successfully, system will be auto relogin after a second');
      //     window.location.reload();
      //   }  
      // } catch (e) {
      //   message.error(e.response.message || 'Something well wrong!');
      // }
    }
    up();
  }
  return <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
     <Space direction="vertical" align='center'>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Infomation" key="1">
            <Avatar src={_user.auth.img} size={100} style={{marginBottom: 10}}/>
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
                <Select 
                  mode={"tags"}
                  placeholder="Select skills"
                  maxTagCount={2}
                  options={[{label: 'English', value: 'english'},{label: 'China', value: 'china'},{label: 'Colleague', value: 'colleague'},{label: 'High school', value: 'high school'}]}
                />
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
                <CustomUpload/>
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
              onFinish={(v)=>{
                const validate = async () => {
                  const res = await _postRequest('auth/login',{email:_user.auth.email, password: v.current_password});
                  if(!res.success) {
                    message.error("Password error!");
                    return;
                  }
                  var data = {
                    email: _user.auth.email,
                    birthday: moment(_user.auth.birthday).format( 'DD-MM-YYYY', 'DD/MM/YYYY'),
                    department: _user.auth.department,
                    designation: _user.auth.designation,
                    name: _user.auth.name,
                    phone: _user.auth.phone,
                    baseSalary: _user.auth.baseSalary,
                    address: _user.auth.address,
                    skills: _user.auth.skills,
                    password: v.new_password
                  }
                  var myHeaders = new Headers(); 
                  myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
                  try {
                    const res1 = await axios.put(`https://hotel-lv.herokuapp.com/api//employee/${_user.auth._id}`, data, {headers: myHeaders})
                    console.log(res1)
                    if(res.success && res1.status === 200){
                      message.success('Change successfully, system will be auto relogin after a second');
                      dispatchUser({ user: res.result, email: res.result.auth.email, password: v.new_password, type: 'LOGIN' })
                      window.location.reload();
                    }  
                  } catch (e) {
                    message.error(e.response.message || 'Something well wrong!');
                  }
                }
                validate();
              }}
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
        </Tabs>
        
     </Space>
  </div>
}