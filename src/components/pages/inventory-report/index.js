import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Form, message, DatePicker, Button } from 'antd';
import { SelectHotel } from '../../commons/select-hotel';
import { User } from '@pkg/reducers';
import { HotelReport } from '../../commons/hotel-report';
import { _getRequest } from '../../../pkg/api';
import moment from 'moment';
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};

export const InventoryReport = props => {

  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [query, setQuery] = useState({month: month, year: year});
  const [data, setData] = useState([]);
  const [ form ] = Form.useForm();
  const [ user, dispatchUser ] = useContext(User.context);
  const [ hotel, setHotel ] = useState({});

  const selectedHotel = (hotel) => {
    setHotel(hotel);
  }
  useEffect(()=>{
    if(!hotel) return;
    dispatchUser({
      type: "UPDATE", user: { hotel: hotel._id}
    })
  }, [hotel])
  useEffect(()=>{
    form.setFieldsValue({month: moment({...query, date: 1, month: query.month - 1})});
    const getData = async () => {
      const res = await _getRequest("admin/report", query);
      if(res.success) {
        setData(res.result);
        return;
      } else {
        message.error(res.error)
      }
    }
    getData();
  },[query])
  const onSearch = values => {
    setQuery({
      month: values.month.month() + 1,
      year: values.month.year()
    })
  }
  console.log(data)
  return <>
    <SelectHotel selectedHotel={selectedHotel}/>
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
      <Form.Item
        name="month" label="Month"
      > 
        <DatePicker picker="month" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" shape="round">
          View
        </Button>
      </Form.Item>
    </Form>
    {
      data.map((item, index) => <HotelReport key={index} hotel={item}/>)
    }
  </>
}