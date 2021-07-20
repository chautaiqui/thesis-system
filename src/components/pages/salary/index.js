import React, {useState, useContext} from 'react';
import { Form, Select, Input, Steps, Button, message, Modal, Row, Col, Table, DatePicker } from 'antd';
import { User } from '@pkg/reducers';
import { postMethod } from '../../../pkg/api';
import { messageError } from '../../commons';
import { useEffect } from 'react';
import moment from 'moment';

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
const _style ={
  border: "1px solid",
  borderRadius: "10px",
  padding: "10px 10px",
  boxShadow: "0px 0px 10px -1px rgb(0 0 0 / 94%)"
}
export const Salary = props => {
  const [ _user, dispatchUser ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const [ current, setCurrent ] = useState({current: 0, data: {}, attendance: [], open: false});

  useEffect(()=>{
    var _n = moment();
    const value = {
      date: 1,
      month: _n.month() + 1,
      year: _n.year()
    }
    form.setFieldsValue({month: _n});
    onFinish({month: _n});
  },[props])

  const onFinish = (v)=>{
    // if(!v.month) {
    //   message.error('Please select month');
    //   return;
    // }
    // if(!v.year){
    //   message.error('Year invalid');
    //   return;
    // }
    // if(Number.isNaN(Number(v.year))) {
    //   message.error('Year invalid');
    //   return;
    // }
    // if(Number(v.year) < 1000 || Number(v.year) > 10000) {
    //   message.error('Year invalid');
    //   return;
    // }
    console.log(v)
    const getSalary = async () => {
      const res_salary = await postMethod(`employee/${_user.auth._id}/view-salary`, {
        year: Number(v.month.year()), 
        month: v.month.month() + 1
      });
      const res_history = await postMethod(`employee/${_user.auth._id}/attendance-by-month-year`, {
        year: Number(v.month.year()), 
        month:v.month.month() + 1
      })
      if(res_salary.success && res_history.success) {
        message.success("Successfull");
        // console.log(res_salary.result, res_history.result)
        setCurrent({current: 3, data: res_salary.result, attendance: res_history.result.attendance ,open: true})
      }
      else {
        messageError(res_salary.error || res_history.error);
      }
    }
    getSalary()
  }
  console.log(current)
  return <div>
    {/* <Steps size="small" current={current.current}>
      <Steps.Step title="Input" />
      <Steps.Step title="In Progress" />
      <Steps.Step title="Finish" />
    </Steps> */}
    <Row gutter={[16,16]}>
      <Col span={24}>
        <Form
          form={form}
          // {...formItemLayout}
          layout="inline"
          style={{marginTop: 10, marginBottom: 10}}
          onFinish={onFinish}
        >
          {/* <Form.Item label="Month" name="month">
            <Select 
              placeholder="Month"
              options={[1,2,3,4,5,6,7,8,9,10,11,12].map(item => ({label: item, value: item}))}
            />
          </Form.Item>
          <Form.Item label="Year" name="year">
            <Input placeholder="Year" />
          </Form.Item> */}
          <Form.Item label="Month" name="month">
            <DatePicker picker="month" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round">
              View
            </Button>
          </Form.Item>
        </Form>
      </Col>
      {current.open && (<Col span={24}>
        <Row gutter={[16,32]}>
          <Col xs={24} sm={12}>
            <div style={_style}>
              <div>
                <h1>
                  <img src="https://ads-cdn.fptplay.net/static/banner/2021/06/ce78a88e02f8d881a47e4b7d6f0ec3c0_1116.png" alt="icon" style={{maxWidth: 40}}/>
                  Salary
                </h1>
                <span style={{paddingLeft: 10}}>
                  {current.data.salary.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24}>
            <Table 
              rowKey='_id'
              tableLayout="auto"
              dataSource={current.attendance ? current.attendance : []}
              columns={[
                {
                  title: 'Date',
                  align: 'center',
                  key: 'title', 
                  render: (text, record, index) => <div>{record.shifts.date}-{record.shifts.month}-{record.shifts.year}</div>
                },
                {
                  title: 'Time In',
                  align: 'center',
                  key: 'timeIn', 
                  render: (text, record, index) => {
                    if(record.shifts.timeInOut){
                      var _t = record.shifts.timeInOut.split("-");
                      var _min = _t[0].split("h");
                      return Number(_min[1]) >= 30 ? _min[0] + "h30" : _min[0] + "h00"
                    }
                  }
                },
                {
                  title: 'Time Out',
                  align: 'center',
                  key: 'timeOut', 
                  render: (text, record, index) => {
                    if(record.shifts.timeInOut){
                      var _t = record.shifts.timeInOut.split("-");
                      var _min = _t[1].split("h");
                      return Number(_min[1]) >= 30 ? _min[0] + "h30" : _min[0] + "h00"
                    }
                  }
                },
                {
                  title: 'Salary',
                  align: 'center',
                  key: 'salaryCoefficient', 
                  render: (text, record, index) => 
                    <span >
                      {record.shifts.salaryCoefficient.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                    </span>
                },
              ]}
            />
          </Col>
        </Row>
      </Col>)}
    </Row>
    
    {/* <Modal
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
    </Modal> */}
    {/* {current.open && (<div>
      <div>
        <label>Salary</label>
        <p>{current.data.salary ? current.data.salary :  'empty' } VND</p>
      </div>
    </div>)} */}
  </div>
}