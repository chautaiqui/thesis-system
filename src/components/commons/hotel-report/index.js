import React from 'react';
import { _getRequest} from '@api';
import { message, Form, Input, Button, Descriptions, Row, Col, Statistic, Table } from 'antd';
import { NumberOutlined } from '@ant-design/icons';
import { VerticalBar } from '../chart';
export const HotelReport = ({hotel}) => {
  // console.log(hotel)
  if(!hotel.manager) return <></>
  return <>
    <Row>
      <Col span={24}>
        <Descriptions title="Hotel Information">
          <Descriptions.Item label="Hotel">{hotel.hotel.name}</Descriptions.Item>
          <Descriptions.Item label="Manager">{hotel.manager.name}</Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={24}>
        <Descriptions title="Booking report" >
          <Descriptions.Item label="Booking">
            <Statistic title="Amount" value={hotel.bookingReport.amount} prefix={<NumberOutlined />} />
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Statistic title="Total money" value={hotel.bookingReport.totalMoney} prefix={<NumberOutlined />} />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={20}>
        <VerticalBar title={"Rating Hotel Report"} data={
          {
            labels: ['One', 'Two', 'Three', 'Four', 'Five'],
            datasets: [
              {
                label: '# of Rating',
                data: hotel.ratingReport ? Object.values(hotel.ratingReport).slice(0,5) : [0,0,0,0,0],
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
  </>
}