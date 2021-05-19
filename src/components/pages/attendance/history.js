import React, { useState, useEffect, useContext } from 'react';
import 'antd/dist/antd.css';
import './attendance.style.css';
import { Calendar, Badge, Select, Modal, Col, Row, Typography, message, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';

// function getMonthData(value) {
//   if (value.month() === 8) {
//     return 1394;
//   }
// }

// function monthCellRender(value) {
//   const num = getMonthData(value);
//   return num ? (
//     <div className="notes-month">
//       <section>{num}</section>
//       <span>Backlog number</span>
//     </div>
//   ) : null;
// }

const renderHeader = ({ value, type, onChange, onTypeChange }) => {
  const start = 0;
  const end = 12;
  const monthOptions = [];

  const current = value.clone();
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.monthsShort(current));
  }

  for (let index = start; index < end; index++) {
    monthOptions.push(
      <Select.Option className="month-item" key={`${index}`}>
        {months[index]}
      </Select.Option>,
    );
  }
  const month = value.month();

  const year = value.year();
  const options = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    options.push(
      <Select.Option key={i} value={i} className="year-item">
        {i}
      </Select.Option>,
    );
  }
  return (
    <div style={{ padding: 8 }}>
      <Typography.Title level={4}>History</Typography.Title>
      <Row gutter={8}>
        <Col>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            className="my-year-select"
            onChange={newYear => {
              const now = value.clone().year(newYear);
              onChange(now);
            }}
            value={String(year)}
          >
            {options}
          </Select>
        </Col>
        <Col>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            value={String(month)}
            onChange={selectedMonth => {
              const newValue = value.clone();
              newValue.month(parseInt(selectedMonth, 10));
              onChange(newValue);
            }}
          >
            {monthOptions}
          </Select>
        </Col>
      </Row>
    </div>
  );
}

export const History = props => {
  const current = new Date()
  const [ data, setData ] = useState({
    month: current.getUTCMonth() + 1,
    year: current.getUTCFullYear()
  })
  const [ popup, setPopup ] = useState({open: false, data: {}})
  const [ history, setHistory ] = useState([]);
  const onPanelChange = (value, mode) => {
    setData({month: value.month() + 1, year: value.year()})
  }
  const getListData = (value, attendance) => {
    var listData;
    var d = attendance.find(item => item.format('DD-MM-YYYY')=== value.format('DD-MM-YYYY'));
    if (d) {
      listData = [
        { type: 'Yes', content: 'isAttendance' }
      ];
    } else {
      listData = []
    }
    return listData || [];
  }
  
  const dateCellRender = (value, attendance) => {
    const listData = getListData(value, attendance);
    return (<div className="selected">
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
      </div>);
  }
  const onSelect = (date) => {
    var lstData = history.find(item => moment(item.updatedAt).format('DD-MM-YYYY')=== date.format('DD-MM-YYYY'));
    if( lstData) {
      setPopup({open: true, data: lstData})
    }
  }
  useEffect(()=>{
    const getdata = async() => {
      try {
        const res = await axios.post(`https://hotel-lv.herokuapp.com/api//employee/${props.employeeid}/attendance-by-month-year`, data );
        if(res.status === 200) {
          setHistory(res.data.attendance)
        } else {
          message('Wrong api')
        }
      } catch (e) {
        message.error('Something wrong')
      }
    }
    getdata();
  },[data])
  console.log(popup)
  return <>
    <Calendar 
      dateCellRender={(v)=>{
        return dateCellRender(v, history.map(item=> moment(item.updatedAt)))
      }}
      headerRender={renderHeader}
      onPanelChange={onPanelChange}
      onSelect={onSelect}
    />
    <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'History shift infomation'}
      key='history'
      width='60%' 
      visible={popup.open}
      forceRender
      keyboard
      footer={
        <Button type='primary' shape='round' onClick={()=>setPopup({open: false, data: {}})}>Close</Button>
      }
    >
      <div>
        <div>
          <label>Date</label>
          <p>{popup.data.shifts ? popup.data.shifts.date :  'empty' }</p>
        </div>
        <div>
          <label>Month</label>
          <p>{popup.data.shifts ? popup.data.shifts.month :  'empty' }</p>
        </div>
        <div>
          <label>Year</label>
          <p>{popup.data.shifts ? popup.data.shifts.year :  'empty' }</p>
        </div>
        <div>
          <label>salaryCoefficient</label>
          <p>{popup.data.shifts ? popup.data.shifts.salaryCoefficient :  'empty' }</p>
        </div>
        <div>
          <label>timeInOut</label>
          <p>{popup.data.shifts ? popup.data.shifts.timeInOut :  'empty' }</p>
        </div>
      </div>
    </Modal>
  </>
}