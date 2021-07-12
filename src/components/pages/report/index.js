import React, {useState, useMemo, useEffect, useContext } from 'react';
import { _getRequest} from '@api';
import { User } from '@pkg/reducers';
import { message, Form, Input, Button, Descriptions, Row, Col, Statistic, Table, DatePicker } from 'antd';
import { NumberOutlined, DollarOutlined } from '@ant-design/icons';
import { VerticalBar } from '../../commons/chart';
import { HorizontalBarChart } from '../../commons/chart/horizontalBarChart';
import { VNDongIcon } from '../../commons/icon/vnd';
import { Item } from '../../commons/report-item/item';
import moment from 'moment';
// import { Horizon }
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};
const formatNumber = (num, currency = "") => 
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.') + currency
;


export const Report = props => {
  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [ user ] = useContext(User.context);
  const [query, setQuery] = useState({year: year, month: month});
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
        <Button type="primary" htmlType="submit" shape="round">
          View
        </Button>
      </Form.Item>
    </Form>
    { data.hotel && (<div><Row gutter={[16,16]} style={{marginTop: 20}}>
      <Col span={6}>
        <Item value={data.hotel.name} title={"Hotel"}/>
      </Col>
      <Col span={6}>
        <Item value={data.manager.name} title={"Manager"}/>
      </Col>
      <Col span={6}>
        <Item value={data.bookingReport.amount} title={"Amount"}/>
      </Col>
      <Col span={6}>
        <Item value={formatNumber(data.bookingReport.totalMoney, "VND")} title={"Total money"}/>
      </Col>
    </Row>
   
    <Row gutter={[16,16]}>
      <Col span={24}>
        <VerticalBar title={"Rating Hotel Report"} data={
          {
            labels: ['One', 'Two', 'Three', 'Four', 'Five'],
            datasets: [
              {
                label: '# of Rating',
                data: data.ratingReport ? Object.values(data.ratingReport).slice(0,5) : [0,0,0,0,0],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
              },
            ],
          }
        }/>
      </Col>
    </Row>

    <Row gutter={[16,16]}>
      <Col span={24}>
        <div className='ant-descriptions-title'>Room Type Report</div>
        <Table
            rowKey='_id'
            tableLayout="auto"
            dataSource={data.roomTypeReport}
            columns={[
              {
                title: 'Name',
                align: 'center',
                key: 'name', 
                render: (text, record, index) => record.roomType.name
              }, 
              {
                title: 'Booking Amount',
                dataIndex: 'bookingAmount',
                align: 'center',
                key: 'bookingAmount', 
              }, 
              {
                title: 'Total money',
                dataIndex: 'totalMoney',
                align: 'center',
                key: 'totalMoney', 
                render: (text, record, index) => <span>
                  {record.totalMoney.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </span>
              },
            ]}
          />
      </Col>
      <Col span={24}>
        <div className='ant-descriptions-title'>Employee Report Salary</div>
        <Table
            rowKey={(record=>record.employee._id)}
            tableLayout="auto"
            dataSource={data.employeeSalary.arr}
            columns={[
              {
                title: 'Email',
                align: 'center',
                key: 'email', 
                render: (text, record, index) => record.employee.email
              }, 
              {
                title: 'Name',
                align: 'center',
                key: 'name', 
                render: (text, record, index) => record.employee.name
              }, 
              {
                title: 'Salary',
                align: 'center',
                key: 'salary', 
                render: (text, record, index) => <span>
                  {record.salary.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </span>
              },
            ]}
          />
      </Col>
      <Col span={24}>
          <HorizontalBarChart data={{
              labels: data.employeeSalary.arr.map(item=>item.employee.name),
              datasets: [{
                label: "# Employee",
                data: data.employeeSalary.arr.map(item=>item.salary),
                backgroundColor: data.employeeSalary.arr.map(item=>'rgba(54, 162, 235, 0.2)')
              }]
            }}
            options={
              {
                indexAxis: 'y',
                elements: {
                  bar: {
                    borderWidth: 2,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Employee report salary',
                  },
                },
              }
            }
          />
      </Col>
    </Row>
    </div>)}
  </div>
}