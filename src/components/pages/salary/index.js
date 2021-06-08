import React, {useState, useContext} from 'react';
import { Form, Select, Input, Steps, Button, message, Modal } from 'antd';
import axios from 'axios';
import { User } from '@pkg/reducers';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 9,
    },
    sm: {
      span: 16,
      offset: 12,
    },
  },
};

export const Salary = props => {
  const [ _user, dispatchUser ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const [ current, setCurrent ] = useState({current: 0, data: {}, open: false});
  console.log(current.data)
  return <div>
    <Steps size="small" current={current.current}>
      <Steps.Step title="Input" />
      <Steps.Step title="In Progress" />
      <Steps.Step title="Finish" />
    </Steps>
    <Form
      form={form}
      {...formItemLayout}
      style={{marginTop: 50}}
      onFinish={(v)=>{
        console.log(v);
        if(!v.month) {
          message.error('Please select month');
          return;
        }
        if(!v.year){
          message.error('Year invalid');
          return;
        }
        if(Number.isNaN(Number(v.year))) {
          message.error('Year invalid');
          return;
        }
        if(Number(v.year) < 1000 || Number(v.year) > 10000) {
          message.error('Year invalid');
          return;
        }
        console.log(Number(v.year))
        const getSalary = async () => {
          try {
            const res = await axios.post(`https://hotel-lv.herokuapp.com/api//employee/${_user.auth._id}/view-salary`, {
              year: Number(v.year), 
              month:v.month
            });
            if (res.status === 200 ) {
              message.success("Successfull");
              setCurrent({current: 3, data: res.data, open: true})
            }
          } catch (e) {
            message.error('Something wrong');
          }  
        }
        getSalary()
      }}
    >
      <Form.Item label="Month" name="month">
        <Select 
          placeholder="Month"
          options={[1,2,3,4,5,6,7,8,9,10,11,12].map(item => ({label: item, value: item}))}
        />
      </Form.Item>
      <Form.Item label="Year" name="year">
        <Input placeholder="Year" />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" shape="round">
          View
        </Button>
      </Form.Item>
    </Form>
    <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'View Salary'}
      key='salary'
      width='60%' 
      visible={current.open}
      forceRender
      keyboard
      footer={
        <Button type='primary' shape='round' onClick={()=>setCurrent({current: 1, data: {}, open: false})}>Close</Button>
      }
    >
      <div>
        <div>
          <label>Salary</label>
          <p>{current.data.salary ? current.data.salary :  'empty' } VND</p>
        </div>
      </div>
    </Modal>
    {/* {current.open && (<div>
      <div>
        <label>Salary</label>
        <p>{current.data.salary ? current.data.salary :  'empty' } VND</p>
      </div>
    </div>)} */}
  </div>
}