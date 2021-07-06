import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Form, message, DatePicker, Button, Tag, Row, Col } from 'antd';
import { User } from '@pkg/reducers';
import { _getRequest } from '../../../pkg/api';
import moment from 'moment';
import { Item } from '../../commons/report-item/item';
import { MultiTypeChart } from '../../commons/chart/multiTypeChart';
import { TableReport } from '../../commons/table-report';
import { CustomHorizontalBarChart } from '../../commons/chart/horizontalBarChart';
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};

export const InventoryReport = props => {

  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [query, setQuery] = useState({year: year});
  const [data, setData] = useState({});
  const [ form ] = Form.useForm();
  const [ tophotel, setTophotel ] = useState([]);
  
  useEffect(()=>{
    form.setFieldsValue({year: moment({...query, date: 1, month: 1, year: query.year})});
    const getData = async () => {
      const res = await _getRequest("admin/report-all", query);
      const resRating = await _getRequest("hotel/top-rating");
      if(res.success && resRating.success) {
        setData(res.result.hotelsReport[0]);
        setTophotel(resRating.result.hotels);
        return;
      } else {
        message.error(res.error)
      }
    }
    getData();
  },[query])
  const onSearch = values => {
    setQuery({
      year: values.year.year()
    })
  }
  function disabledDate(current) {
    return current && current < moment({date: 1, month: 1, year: 2021});
  }
  // console.log(tophotel)
  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={16}>
        <h1>Dashboard</h1>
      </Col>
      <Col xs={24} sm={8}>
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
          <Form.Item
            name="year" label="Year"
          > 
            <DatePicker picker="year" disabledDate={disabledDate}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round">
              View
            </Button>
          </Form.Item>
          <Form.Item> 
            <Tag color="#108ee9">{query.year}</Tag>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <Row gutter={[16,16]}> 
          <Col span={6} offset={3}>
            <Item title="Booking" value={"1.000"} />
          </Col>
          <Col span={6}>
            <Item title="Total money" value={"100.000.000 VND"} />
          </Col>
          <Col span={6}>
            <Item title="Customer" value={"1.000"}/>
          </Col>
          
        </Row>
      </Col>
      
    </Row>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={12}>
        <MultiTypeChart data={data.bookingByMonth ? data.bookingByMonth : []}/>
      </Col>
      <Col xs={24} sm={12}>
        <CustomHorizontalBarChart data={tophotel}/>
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={12}>
        <TableReport data={data.hotel ? data.hotel : []}/>
      </Col>
      <Col span={12}>
        Maps
      </Col>
    </Row>
    {/* {
      data.map((item, index) => <HotelReport key={index} hotel={item}/>)
    } */}
  </>
}