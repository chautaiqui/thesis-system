import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Tag } from 'antd';
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';


export const SearchHotel = props => {
  const [ hotel, setHotel ] = useState({search: false, text: ""});
  const [ form ] = Form.useForm();
  const { onSearch = () => {} } = props;

  const onFinish = (values) => {
    setHotel({
      search: true,
      text: values.hotel
    })
  }
  const closeTag = () => {
    setHotel({
      search: false,
      text: ""
    })
    form.resetFields();
  }
  useEffect(()=>{
    onSearch(hotel.text);
  },[hotel])

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="hotel" label=""
      > 
        <Input placeholder="Search text"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" shape="round" className="btn-color">
          Search
        </Button>
      </Form.Item>
      {hotel.search && (<Form.Item>
        <Tag closable onClose={closeTag} color="#1eaae7">{hotel.text}</Tag>
      </Form.Item>)}
    </Form>
  )
}