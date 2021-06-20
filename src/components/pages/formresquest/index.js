import React, { useState, useContext, useEffect } from 'react';
import { User } from '@pkg/reducers';
import { Row, Col, Form, Table, DatePicker, Input, Button, Divider } from 'antd';
import moment from 'moment';
import { postMethod } from '../../../pkg/api';
const initialState = { behavior: 'init', data: []}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

export const FormResquest = props => {
  const [ user ] = useContext(User.context);
  const [ data, setData ] = useState(initialState);
  const [ loading, setLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const getAllLeaveForm = async () => {
    return;
  }

  useEffect(()=>{
    if(data.behavior === 'init') {
      getAllLeaveForm();
    }
  }, [data.behavior])

  const haveShift = (date, month, year) => {
    
    const getShift = async () => {
      var check =  false;
      const res = await postMethod(`/employee/${user.auth._id}/shift-by-specific-time`, {year, month});
      if(res.success) {
        res.result.shift.map(item => {
          console.log(date, item.date)
          if(Number(date) === Number(item.date)) check = true
        })
      }
      return check;
    }
    var res = false;
    var t = getShift();
    t.then(value => res = value);
    return res
  }
  const onFinish = (values) => {
    const { title, date, reason } = values;
    const _hs = haveShift(date.date(), date.month()+ 1, date.year());
    console.log(_hs);
  };

  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} xs={8}>
        <Divider orientation="left">Form Request</Divider>
        <Form 
          form={form}
          onFinish={onFinish}
          {...layout}
        >
          <Form.Item
            name={"title"}
            label="Title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"date"}
            label="Date"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            name={"reason"}
            label="Reason"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit" type="primary" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col xs={24} xs={16}>
        <Divider orientation="left">History</Divider>
      </Col>
    </Row>
  </>
}