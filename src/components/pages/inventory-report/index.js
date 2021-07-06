import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Form, message, DatePicker, Button, Tag, Row, Col } from 'antd';
import { User } from '@pkg/reducers';
import { _getRequest } from '../../../pkg/api';
import moment from 'moment';
import { Item } from '../../commons/report-item/item';
import { MultiTypeChart } from '../../commons/chart/multiTypeChart';
import { TableReport } from '../../commons/table-report';
import { CustomHorizontalBarChart } from '../../commons/chart/horizontalBarChart';
import { GoogleMap } from '../../commons/google-map';
import { RankChart } from '../../commons/rank-chart';
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};
const formatNumber = (num, currency = "") => 
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.') + currency
;
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
        setData(res.result);
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
  console.log(data, data.hotelsReport ? data.hotelsReport[0].booking[0].totalMoney : "")
  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={12} md={12} lg={14} xl={16}>
        <h1>Dashboard</h1>
      </Col>
      <Col xs={24} sm={12} md={12} lg={10} xl={8}>
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
          {/* <Form.Item> 
            <Tag color="#108ee9">{query.year}</Tag>
          </Form.Item> */}
        </Form>
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <Row gutter={[16,16]}> 
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            {/* <Item title="Booking" value={"123312"} /> */}
            <Item title="Booking" value={data.hotelsReport ? formatNumber(data.hotelsReport[0].booking[0].totalAmount) : ""} />
          </Col>
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            <Item title="Total Revenue" value={data.hotelsReport ? formatNumber(data.hotelsReport[0].booking[0].totalMoney, " VND") : ""} />
          </Col>
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            <Item title="Total Customer" value={data.customerReport ? formatNumber(data.customerReport[0].totalCustomer[0].total) : ""}/>
          </Col>
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            <Item title="New Customer" value={data.customerReport ? formatNumber(data.customerReport[0].newCustomer[0].total) : ""}/>
          </Col>
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            <Item title="Customer Booking" value={data.customerBookingReport ? formatNumber(data.customerBookingReport[0].customerAmount[0].total) : "" }/>
          </Col>
          <Col xs={12} sm={8} md={4} lg={4} xl={4}>
            <Item title="Guest Booking" value={data.customerBookingReport ? formatNumber(data.customerBookingReport[0].guest[0].bookingAmount) : "" }/>
          </Col>
        </Row>
      </Col>
      
    </Row>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={12}>
        <MultiTypeChart data={data.hotelsReport ? data.hotelsReport[0].bookingByMonth : []}/>
      </Col>
      <Col xs={24} sm={12}>
        <CustomHorizontalBarChart data={tophotel}/>
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={12}>
        <TableReport data={data.hotelsReport? data.hotelsReport[0].hotel : []}/>
      </Col>
      <Col span={12}>
        <RankChart data={data.customerBookingReport ? data.customerBookingReport[0].customerTopTen : []}/>
      </Col>
    </Row>
    {/* {
      data.map((item, index) => <HotelReport key={index} hotel={item}/>)
    } */}
  </>
}