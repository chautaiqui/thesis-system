import React, {useState, useMemo, useEffect, useContext } from 'react';
import { _getRequest} from '@api';
import { User } from '@pkg/reducers';
import { message, Form, Input, Button, Descriptions, Row, Col, Statistic, Table } from 'antd';
import { NumberOutlined } from '@ant-design/icons';
import { VerticalBar } from '../../commons/chart';
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
    form.setFieldsValue(query)
    if(!user.auth.hotel){
      message.error('You no manage hotel');
      return;
    }
    const getData = async () => {
      const res = await _getRequest(`hotel/${user.auth.hotel}/report`, query);
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
    setQuery(values)
  }
  console.log(data, query)
  return <div>
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
      <Form.Item
        name="month" label="Month"
      > 
        <Input />
      </Form.Item>
      <Form.Item
        name="year" label="Year"
      > 
        <Input />
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
            <Statistic title="Total money" value={data.bookingReport.totalMoney} prefix={<NumberOutlined />} />
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <VerticalBar title={"Rating Report"} data={
          {
            labels: ['One', 'Two', 'Three', 'Four', 'Five'],
            datasets: [
              {
                label: '# of Rating',
                data: [1,2,3,4,5],
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
    </Row>
    </div>)}
  </div>
}