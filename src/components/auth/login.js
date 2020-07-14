/* eslint no-extra-boolean-cast: 0 */

import React, { useState, useEffect } from 'react';

import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';

import { messageError } from '@components/commons';
import { signin } from '@api';

const Login = props => {
  const { onLogin } = props;
  const [ check, setCheck ] = useState(false);
  const [ form ] = Form.useForm();

  // check current token
  useEffect(() => {
    const { phone, token } = localStorage;
    const checkUser = async () => {
      if (!phone || !token) return setCheck(true);
      try {
        const _r = await signin.withToken(token);
        if (!_r.success) {
          localStorage.removeItem('phone');
          localStorage.removeItem('token');
          setCheck(true);
        }
        onLogin(_r.result);
      } catch (e) {
        console.log('checkToken', e);
        delete localStorage.token;
        setCheck(true);
      }
    }
    if (!check) {
      if (phone && token) checkUser();
      else setCheck(true);
    }
  }, [check, onLogin]);

  const onFinish = async values => {
    try {
      const { phone, password } = values;
      const _r = await signin.withPw(phone, password);
      if (!_r.success) return messageError(_r.error);
      onLogin(_r.result);
    } catch (e) {
      messageError(e);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if (!check) return <div>loading</div>;

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
                initialValues={{ phone: '+84' }}
              >
                <Form.Item
                  name='phone'
                  rules={[{ required: true, message: 'Phone required' }]}
                  validateTrigger='onSubmit'
                >
                  <Input
                    onChange={function(e) { //for this
                      if (!e || !e.target) {
                        return e;
                      }
                      let { value } = e.target;
                      value = value.replace(/[^\d]/g, '');

                      form.setFieldsValue({ phone: value ? `+${value}` : '' });
                    }}
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
