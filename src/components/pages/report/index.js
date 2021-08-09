import React, {useState, useMemo, useEffect, useContext } from 'react';
import { _getRequest} from '@api';
import { User } from '@pkg/reducers';
import { message, Form, Input, Button, Descriptions, Row, Col, Statistic, Table, DatePicker } from 'antd';
// import { NumberOutlined, DollarOutlined } from '@ant-design/icons';
// import { VerticalBar } from '../../commons/chart';
import { HorizontalBarChart } from '../../commons/chart/horizontalBarChart';
import { VNDongIcon } from '../../commons/icon/vnd';
import { Item } from '../../commons/report-item/item';
import { MultiTypeChart, MultiTypeChart2 } from '../../commons/chart/multiTypeChart';
import { EmployeeSalaryChart } from '../../commons/chart/EmployeeSalaryChart';
import { FacilityReport1 } from '../../commons/facility-report';

import moment from 'moment';
import DemoBar from '../../commons/chart/stackChart/temp';
import DemoDualAxes, { DemoDualAxes1 } from '../../commons/chart/dualChart';
// import { Horizon }
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};
const formatNumber = (num, currency = "") => 
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.') + currency
;
const numtoMonth = (number) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[number-1];
}

const addMonthReport = (arrReport) => {
  if(!arrReport || arrReport.length === 0) return;
  var lst = arrReport[arrReport.length - 1];
  var mIndex = Number(lst.month);
  console.log(mIndex)
  for (var i = mIndex - 1; i > 0; i--) {
    arrReport.push({
      bookingAmount: 0,
      bookingMoney: 0,
      month: i
    })
  }
  return arrReport;
}
const deleleMonthReport = (arrReport) => {
  console.log('.....----:', arrReport)
  if(!arrReport || arrReport.length === 0) return;
  arrReport.filter(item => {
    return item.bookingAmount !== 0 || item.bookingMoney !== 0 
  })
  console.log('.....---- after:', arrReport)
  return arrReport
}

export const Report = props => {
  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [ user ] = useContext(User.context);
  const [query, setQuery] = useState({year: year});
  const [data, setData] = useState({});
  const [ form ] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue({year: moment({...query, date: 1, month: 1})});
    if(!user.auth.hotel){
      message.error('You no manage hotel');
      return;
    }
    const getData = async () => {
      const res = await _getRequest(`hotel/${user.auth.hotel}/report`, query);
      const res_salary = await _getRequest(`hotel/${user.auth.hotel}/salary-report`, query);
      console.log(res.result)
      console.log(res_salary)
      if(res.success && res_salary.success) {
        setData({...res.result, employeeSalary: res_salary.result.salary});
        return;
      } else {
        message.error(res.error || res_salary.error) 
      }
    }
    getData();
  },[query])
  const onSearch = values => {
    setQuery({
      year: values.year.year()
    })
  }
  console.log(data, query)

  return <div>
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
      <Form.Item
        name="year" label="Year"
      > 
        <DatePicker picker="year" />
      </Form.Item>
      <Form.Item>
        <Button className="btn-color" type="primary" htmlType="submit" shape="round">
          View
        </Button>
      </Form.Item>
    </Form>
    { data.hotelName && (
      <div>
        <Row gutter={[16,16]} style={{marginTop: 20}}>
          <Col span={6}>
            <Item value={data.hotelName? data.hotelName : "Hotel"} title={"Hotel"}/>
          </Col>
          <Col span={6}>
            <Item value={data.managerName ? data.managerName : "Manager"} title={"Manager"}/>
          </Col>
          <Col span={6}>
            <Item value={data.booking[0] ? data.booking[0].bookingAmount : "0"} title={"Amount"}/>
          </Col>
          <Col span={6}>
            <Item value={ data.booking[0] ? formatNumber(data.booking[0].bookingMoney, "VND") : "VND"} title={"Total money"}/>
          </Col>
        </Row>
        <Row gutter={[16,16]}>
          <Col span={24}>
            <h1 style={{textAlign: 'center'}}>Booking Report</h1>
          </Col>
          <Col xs={24} sm={24} md={12}>
            {/* <MultiTypeChart2 data={data.bookingByMonth ? addMonthReport(data.bookingByMonth) : []}/> */}
            <DemoDualAxes1 data={data.bookingByMonth ? data.bookingByMonth : []}/>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Table
              rowKey='month'
              tableLayout="auto"
              size={'small'}
              bordered
              dataSource={data.bookingByMonth ? addMonthReport(data.bookingByMonth) : []}
              pagination={false}
              columns={[
                {
                  title: 'Month',
                  align: 'center',
                  key: 'name', 
                  render: (text, record, index) => numtoMonth(record.month)
                }, 
                {
                  title: 'Booking Amount',
                  dataIndex: 'bookingAmount',
                  align: 'center',
                  key: 'bookingAmount', 
                }, 
                {
                  title: 'Total',
                  dataIndex: 'bookingMoney',
                  align: 'center',
                  key: 'totalMoney', 
                  render: (text, record, index) => <span>
                    {record.bookingMoney.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </span>
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={[16,16]}>
          <Col span={24}>
            <h1 style={{textAlign: 'center'}}>Salary Employee Report</h1>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Table
              rowKey='month'
              tableLayout="auto"
              size={'small'}
              bordered
              dataSource={data.employeeSalary ? data.employeeSalary : []}
              pagination={false}
              columns={[
                {
                  title: 'Month',
                  align: 'center',
                  key: 'name', 
                  render: (text, record, index) => numtoMonth(record.month)
                }, 
                {
                  title: 'Total',
                  dataIndex: 'bookingMoney',
                  align: 'center',
                  key: 'totalMoney', 
                  render: (text, record, index) => <span>
                    {record.totalSalary.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </span>
                },
              ]}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <EmployeeSalaryChart data={data.employeeSalary ? data.employeeSalary : []}/>
          </Col>
        </Row>
        <Row gutter={[16,16]} style={{marginBottom: 30}}>
          <Col span={24}>
            <h1 style={{textAlign: 'center'}}>Facility Report</h1>
          </Col>
          <Col span={24}>
            {/* <FacilityReport1 data={data.facilityReport ? data.facilityReport : []}/> */}
            <DemoBar data={data.facilityReport ? data.facilityReport : []}/>
          </Col>
        </Row>
      </div>
    )}
  </div>
}