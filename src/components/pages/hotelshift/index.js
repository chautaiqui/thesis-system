import React, { useState, useEffect, useContext } from 'react';
import { DatePicker, Row, Col, Button, Drawer, Form, Input, InputNumber, Tabs, Modal } from 'antd';
import { Shift } from '../../commons/shift';
import { _getRequest } from "@pkg/api";
import { User } from '@pkg/reducers';
import { messageError } from '../../commons';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 10,
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
const initState = {behavior: 'init', data: []};
export const HotelShift = props => {
  const [ user ] = useContext(User.context);
  const [ data, setData ] = useState(initState);
  const [ form ] = Form.useForm();


  const getShift = async () => {
    const res = await _getRequest(`hotel/${user.auth.hotel}/hotel-shifts`);
    if(res.success) {
      setData({
        behavior: 'stall',
        data: res.result.hotelShifts
      })
    } else {
      messageError(res.error);
    }
  }
  const addshift = () => {}  
  useEffect(()=>{
    if(data.behavior === 'init') {
      getShift();
    }
  },[data.behavior])
  return ( 
    <>
      <Row gutter={16,16} >
        <Col span={24}>
          <Button onClick={addshift}> Add shift</Button>
        </Col>
        <Col span={24}>
          <Shift data={data.data}/>
        </Col>
      </Row>
    </>
  )  
};

class Render{
  
}