import React, {useState, useMemo, useEffect, useContext } from 'react';
import { _getRequest} from '@api';
import { User } from '@pkg/reducers';
import { message, Form, Input, Button, Descriptions, Row, Col, Statistic, Table, DatePicker } from 'antd';
import { NumberOutlined, DollarOutlined } from '@ant-design/icons';
import { VerticalBar } from '../../commons/chart';
import { HorizontalBarChart } from '../../commons/chart/horizontalBarChart';
import { VNDongIcon } from '../../commons/icon/vnd';
import moment from 'moment';
// import { Horizon }
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};



export const Report = props => {
  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [ user ] = useContext(User.context);
  const [query, setQuery] = useState({month: month, year: year});
  const [data, setData] = useState({});
  const [ form ] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue({month: moment({...query, date: 1, month: query.month - 1})});
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
    console.log(values)
    setQuery({
      month: values.month.month() + 1,
      year: values.month.year()
    })
  }
  console.log(data, query)
  return <div>
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
    { data.hotel && (<div><Row gutter={[16,16]} style={{marginTop: 20}}>
      <Col span={24}>
        <Descriptions title="Hotel Information">
          <Descriptions.Item label="Hotel">{data.hotel.name}</Descriptions.Item>
          <Descriptions.Item label="Manager">{data.manager.name}</Descriptions.Item>
        </Descriptions>
      </Col>
      
    </Row>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <Descriptions title="Booking report" >
          <Descriptions.Item label="Booking">
            <Statistic title="Amount" value={data.bookingReport.amount} prefix={<NumberOutlined />} />
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Statistic title="Total money" value={data.bookingReport.totalMoney} prefix={<VNDongIcon />} />
          </Descriptions.Item>
        </Descriptions>
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

    {/* 
      const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
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
      text: 'Chart.js Horizontal Bar Chart',
    },
  },
};
    <Row gutter={[16,16]}>
      <Col span={24}>
        <div className='ant-descriptions-title'>Facility Report</div>
        <Table
            rowKey='_id'
            tableLayout="auto"
            dataSource={data.facilityReport}
            columns={[{
              title: 'Name',
              align: 'center',
              key: 'name', 
              render: (text, record, index) => record.facility.name
            }, {
              title: 'Action',
              dataIndex: 'action',
              align: 'center',
              key: 'action', 
            }, {
              title: 'Amount',
              dataIndex: 'amount',
              align: 'center',
              key: 'amount', 
            }]}
          />
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <div className='ant-descriptions-title'>Employee Report</div>
        <Table
            rowKey='_id'
            tableLayout="auto"
            dataSource={data.employeeReport}
            columns={[{
              title: 'Name',
              align: 'center',
              key: 'name', 
              render: (text, record, index) => record.employee.name
            }, {
              title: 'Action',
              dataIndex: 'action',
              align: 'center',
              key: 'action', 
            }]}
          />
      </Col>
    </Row> */}
    </div>)}
  </div>
}