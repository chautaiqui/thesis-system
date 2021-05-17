import React, { useState } from 'react';
import { Input, List, message, Button, Form } from 'antd';
import axios from 'axios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const FacilityType = props => {
  const { hotelid } = props;
  const [ form ] = Form.useForm();
  const add = async(name) => {
    try {
      var myHeaders = new Headers(); 
      myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
      const res = await axios.post(`https://hotel-lv.herokuapp.com/api/hotel/${hotelid}/create-facilitytype`, 
        {
          name: name
        }, {headers: myHeaders})
      console.log(res);
      message.success("Create new facility type")
    } catch (error) {
      message.error(error.response)
    } 
  }
  return <>
    <Form
      form={form}
      {...layout}
      onFinish={(value)=>{
        add(value.name)
      }}
    >
      <Form.Item name="name" label="Facility type">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add facility
        </Button>
      </Form.Item>
    </Form>
  </>
}