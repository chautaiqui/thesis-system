import React, { useState, useEffect, useContext } from 'react';
import { DatePicker, Row, Col, Button, Form, Input, InputNumber, Tabs, Modal, message, Drawer } from 'antd';
import { Shift } from '../../commons/shift';
import { _getRequest } from "@pkg/api";
import { User } from '@pkg/reducers';
import { messageError, messageSuccess } from '../../commons';
import { postMethod, putMethod } from '../../../pkg/api';
import { PlusCircleOutlined, FormOutlined } from '@ant-design/icons';
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
var calcTime = (timeIn, timeOut) => {
  var _i = timeIn.split("h").map(item=>Number(item))
  var _o = timeOut.split("h").map(item=>Number(item))
  return (_o[0]*60 + _o[1] - (_i[0]*60 + _i[1]))/60 
}
const { TabPane } = Tabs;
const initState = { behavior: 'init', shift: [], employee: [] };
const initSalary = { open: false, data: {}, exist: false, behavior: 'init' };
export const HotelShift = (props) => {
  const [ user ] = useContext(User.context);
  const [ data, setData ] = useState(initState);
  const [ salary, setSalary ] = useState(initSalary);
  const [ popup, setPopup ] = useState({open: false});
  const [ form ] = Form.useForm();
  const [ form_salary ] = Form.useForm();
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
  const getSalaryHourly = async () => {
    const res = await _getRequest(`hourlysalary/hotel/${user.auth.hotel}`); 
    if(res.success) {
      if(res.result.hourlySalaries[0]) {
        setSalary({
          ...salary, data: res.result.hourlySalaries[0], behavior: 'stall', exist: true
        })
      }
    } else {
      messageError(res.error);
    }
  }
  useEffect(()=>{
    if(salary.behavior === 'init') {
      getSalaryHourly();
    } 
    console.log({number: salary.data})
    form_salary.setFieldsValue({number: salary.data.salary ? salary.data.salary : 0})
    
  }, [salary])
  const onFinish = (v) => {
    if(!v.salaryCoefficient && !salary.data.salary) {
      messageError("Please input salary coefficient or config salary!");
      return;
    }
    var timeInOut = v.timeInOut.split("-");
    var finalSalary = v.salaryCoefficient ? v.salaryCoefficient : salary.data.salary * calcTime(timeInOut[0], timeInOut[1]);
    const createShift = async () => {
      const res = await postMethod(`hotel/${user.auth.hotel}/create-hotel-shift`, {
        shift: [{
          ...v,
          salaryCoefficient: finalSalary,
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
    if(!v.salaryCoefficient && !salary.data.salary) {
      messageError("Please input salary coefficient or config salary!");
      return;
    }
    var start = v.time[0];
    var timeIn = `${start.hour()}h${start.minutes() > 30 ? 30 : 0}`;
    var end = v.time[1];
    var endplus = end.add(1, 'days')
    var timeOut = `${end.hour()}h${end.minutes() > 30 ? 30 : 0}`;
    var timeInOut = `${timeIn} - ${timeOut}`;
    var _s = [];
    var finalSalary = v.salaryCoefficient ? v.salaryCoefficient : salary.data.salary * calcTime(timeIn, timeOut);
    // console.log(finalSalary)
    while (!start.isSame(endplus, 'day')) {
      var _t = {
        hotel: user.auth.hotel,
        date: start.date(),
        month: start.month() + 1,
        year: start.year(),
        salaryCoefficient: finalSalary,
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
  const openPopupSalary = () => {
    setSalary({
      ...salary, open: true
    })
  }
  const onNumberChange = (value) => {
    console.log(salary, value)
    if(salary.exist && salary.data._id) {
      // update
      const updateSalary = async () => {
        const res = await putMethod("hourlysalary", { salary: Number(value.number)} ,salary.data._id);
        if(res.success) {
          console.log(res.result)
          setSalary({
            ...salary, data: res.result.hourlySalary, open: false
          })
          messageSuccess("Update salary hourly successfully!")
        } else {
          messageError(res.error)
        }
      }
      updateSalary();
    } else {
      // create
      const createSalary = async () => {
        if(!user.auth.hotel) {
          messageError("Not manage hotel!");
          return;
        }
        const res = await postMethod(`hourlysalary/hotel/${user.auth.hotel}`, { salary: Number(value.number)});
        if(res.success) {
          console.log(res.result)
          setSalary({
            ...salary, data: res.result.hourlySalary, open: false
          })
          messageSuccess("Config salary hourly successfully!")
        } else {
          messageError(res.error)
        }
      }
      createSalary();
    }
  }
  console.log(salary)
  return ( 
    <>
      <Row gutter={16,16} >
        <Col span={24} style={{marginBottom: 10, marginRight: 10}}>
          <Button 
            onClick={addMultiShift}
            type="primary" 
            shape="round" 
            icon={<PlusCircleOutlined/>}
            style={{marginRight: 20}}
          > Add Multi Shift</Button>
          <Button 
            type="primary" 
            shape="round" 
            icon={<FormOutlined />}
            onClick={openPopupSalary}
          >
            Config Salary
          </Button>
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
            <CustomInput 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: "80%"}}
            />
          </Form.Item>
          <Form.Item name="time" label="Date Time" {...rangeConfig}>
            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="Config salary"
        placement={"left"}
        closable={true}
        onClose={()=>{
          setSalary({
            ...salary, open: false
          })
        }}
        visible={salary.open}
        key={"top"}
        width={"50%"}
      >
        <Form onFinish={onNumberChange} form={form_salary}>
          <Form.Item
            labelCol={{span: 24}}
            wrapperCol={{span: 24}}
            label="Salary in hour"
            name="number"
          >
            <CustomInput 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: "80%"}}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 4
            }}
          >
            <Button className="btn-box-shawdow" type="primary" htmlType="submit" style={{width: "100%"}}>
              Config
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )  
};

const CustomInput = (props) => {
  return <>
    <InputNumber {...props}/>
    <span>VND</span>
  </>
}