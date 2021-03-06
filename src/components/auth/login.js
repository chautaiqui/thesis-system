/* eslint no-extra-boolean-cast: 0 */

import React, { useState, useEffect } from 'react';

import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Spin } from 'antd';

import { messageError } from '@components/commons';
import { _postRequest } from '@api';

const Login = props => {
  const { onLogin } = props;
  const [ check, setCheck ] = useState(false);
  const [ form ] = Form.useForm();

  // check current token
  useEffect(() => {
    const { email, password } = localStorage;
    const checkUser = async () => {
      try {
        const _r = await _postRequest('auth/login',{email:email, password: password});
        if (!_r.success) {
          localStorage.removeItem('email');
          localStorage.removeItem('api_token');
          setCheck(true);
        }
        onLogin(_r.result, email, password); 
      } catch (e) {
        console.log('checkToken', e);
        delete localStorage.api_token;
        setCheck(true);
      }
    }
    if (!check) {
      if (email && password) checkUser();
      else setCheck(true);
    }
  }, [check, onLogin]);

  const onFinish = async values => {
    try {
      const { email, password } = values;
      const _r = await _postRequest('auth/login',{email:email, password: password});
      if (!_r.success) return messageError(_r.error);
      onLogin(_r.result, email, password); 
     } catch (e) { 
      messageError(e);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if (!check) return <div style={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}>
    <Spin />
  </div>;

  return (
    <div className='login-container'>
      <div className='container'>
        <div className='ant-row'>
          <Col 
            xl={{ span: 10, offset: 7 }}
            lg={{ span: 12, offset: 6 }}
            md={{ span: 14, offset: 5 }}
            sm={{ span: 18, offset: 3 }}
            xs={{ span: 22, offset: 1 }}
            className='form-login'
          >
            <div className='dp-card-body'>
              <h3 className="login-title">Sign in</h3>
              <Form 
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // initialValues={{ email: '+84' }}
              >
                <Form.Item
                  name='email'
                  rules={[{ required: true, message: 'Email required' }]}
                  validateTrigger='onSubmit'
                >
                  <Input
                    // onChange={function(e) { //for this
                    //   if (!e || !e.target) {
                    //     return e;
                    //   }
                    //   let { value } = e.target;
                    //   value = value.replace(/[^\d]/g, '');

                    //   form.setFieldsValue({ email: value ? `+${value}` : '' });
                    // }}
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[{ required: true, message: 'Password required' }]}
                  validateTrigger='onSubmit'
                >
                  <Input type='password' />
                </Form.Item>
                <div className=''>
                  <Button htmlType='submit' size='large' className="signin">SIGN IN</Button>
                </div>
              </Form>
            </div>
          </Col>
        </div>
      </div>
    </div>
  )
}

export default Login;
