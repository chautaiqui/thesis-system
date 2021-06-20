import React, { useState, useEffect, useContext } from 'react';
import { DatePicker, Row, Col, Button, Form, Input, InputNumber, Tabs, Modal, message } from 'antd';
import { Shift } from '../../commons/shift';
import { _getRequest } from "@pkg/api";
import { User } from '@pkg/reducers';
import { messageError } from '../../commons';
import { postMethod } from '../../../pkg/api';
import { PlusCircleOutlined } from '@ant-design/icons';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
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
const initState = {behavior: 'init', shift: [], employee: []};
export const HotelShift = props => {
  const [ user ] = useContext(User.context);
  const [ data, setData ] = useState(initState);
  const [ popup, setPopup ] = useState({open: false});
  const [ form ] = Form.useForm();
  const [ multiform ] = Form.useForm();

  const getShift = async () => {
    const res_hotel = await _getRequest(`hotel/${user.auth.hotel}/hotel-shifts`); 
    const res_emp = await _getRequest(`hotel/${user.auth.hotel}/employee`); 
    if(res_hotel.success && res_emp.success) {
      setData({
        behavior: 'stall',
        shift: res_hotel.result.hotelShifts,
        employee: res_emp.result.employees
      })
    } else {
      messageError(res_hotel.error || res_emp.error);
    }
  }
  useEffect(()=>{
    if(data.behavior === 'init') {
      getShift();
    }
  },[data.behavior])
  const onFinish = (v) => {
    if(!v.salaryCoefficient) {
      messageError("Please input salary coefficient!");
      return;
    }
    console.log(v, user.auth.hotel)
    const createShift = async () => {
      const res = await postMethod(`hotel/${user.auth.hotel}/create-hotel-shift`, {
        shift: [{
          ...v,
          hotel: user.auth.hotel
        }]
      })
      if(res.success) {
        message.success("Create shift successfully!");
        setData({
          ...data,
          behavior: 'init'
        })
      } else {
        messageError(res.error)
      }
    }
    createShift();
  }
  const formJSX = <Form
    form={form}
    onFinish={onFinish}
    {...formItemLayout}
  >
    <Form.Item name="salaryCoefficient" label="Salary Coefficient"
    >
      <Input addonAfter={"VND"}/>
    </Form.Item>
    <Form.Item name="date" hidden>
      <Input />
    </Form.Item>
    <Form.Item name="month" hidden>
      <Input />
    </Form.Item>
    <Form.Item name="year" hidden>
      <Input />
    </Form.Item>
    <Form.Item name="timeInOut" hidden>
      <Input />
    </Form.Item>
  </Form>
  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select time!',
      },
    ],
  };
  const addMultiShift = () => {
    setPopup({open: true});
  }
  const submitMultiShift = (v) => {
    if(!v.salaryCoefficient) {
      messageError("Please input salary coefficient!");
      return;
    }
    var start = v.time[0];
    var timeIn = `${start.hour()}h${start.minutes() > 30 ? 30 : 0}`;
    var end = v.time[1];
    var endplus = end.add(1, 'days')
    var timeOut = `${end.hour()}h${end.minutes() > 30 ? 30 : 0}`;
    var timeInOut = `${timeIn} - ${timeOut}`;
    var _s = []
    while (!start.isSame(endplus, 'day')) {
      var _t = {
        hotel: user.auth.hotel,
        date: start.date(),
        month: start.month() + 1,
        year: start.year(),
        salaryCoefficient: v.salaryCoefficient,
        timeInOut: timeInOut
      }
      _s.push(_t)
      start = start.add(1, 'days')
    }
    if(_s.length > 0) {
      const createShift = async () => {
        const res = await postMethod(`hotel/${user.auth.hotel}/create-hotel-shift`, {
          shift: _s
        })
        if(res.success) {
          message.success("Create multi shift successfully!");
          setData({
            ...data,
            behavior: 'init'
          })
          setPopup({open: false})
        } else {
          messageError(res.error)
        }
      }
      createShift();
    }
  }

  const assignSuccess = (shiftid, employeeid) => {
    console.log(shiftid, employeeid);
    const action = async () => {
      if(shiftid, employeeid) {
        const res = await postMethod(`/hotel-shift/${shiftid}/assign-emp/${employeeid}`, {
          "hotel-shift": shiftid,
          "employee": employeeid
        })
        if(res.success) {
          message.success("Add employee successfully!");
          setData({
            ...data,
            behavior: 'init'
          })
        } else {
          return;
        }
      }
    }
    action();
  }
  return ( 
    <>
      <Row gutter={16,16} >
        <Col span={24} style={{marginBottom: 10}}>
          <Button 
            onClick={addMultiShift}
            type="primary" 
            shape="round" 
            icon={<PlusCircleOutlined/>}
          > Add Multi Shift</Button>
        </Col>
        <Col span={24}>
          <Shift data={data.shift} employee={data.employee} formData={formJSX} formControl={form} assign={assignSuccess}/>
        </Col>
      </Row>
      <Modal
        title={"Create multi shift"}
        centered
        visible={popup.open}
        onOk={() => {
          multiform.submit()
        }}
        onCancel={() => setPopup({open: false})}
      >
        <Form
          form={multiform}
          onFinish={submitMultiShift}
          {...formItemLayout}
        >
          <Form.Item name="salaryCoefficient" label="Salary Coefficient"
          >
            <Input addonAfter={"VND"}/>
          </Form.Item>
          <Form.Item name="time" label="Date Time" {...rangeConfig}>
            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )  
};

class Render{
  
}