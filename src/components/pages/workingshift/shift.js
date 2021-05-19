import React, {useState, useEffect} from 'react';
import { Calendar, Badge, Select, Modal, Col, Row, Typography, message, Button } from 'antd';
import moment from 'moment';
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

export const Shift = props => {
  const { data } = props;
  const current = new Date();
  const [ fdata, setFdata] = useState([]);
  const [ param, setParam ] = useState({
    month: current.getUTCMonth() + 1,
    year: current.getUTCFullYear()
  })
  const [ popup, setPopup ] = useState({open: false, data: {}});
  
  const onPanelChange = (value, mode) => {
    setParam({month: value.month() + 1, year: value.year()})
  }
  useEffect(()=>{
    // filter param
    var t1 = data.filter(item => Number(item.year) === Number(param.year));
    var t2 = t1.filter(item => item.month === param.month);
    setFdata(t2);
  },[param, data])

  const getListData = (value, attendance) => {
    var listData;
    // console.log('att', attendance.map(item=> item.format('DD-MM-YYYY')))
    var d = attendance.find(item => item.format('DD-MM-YYYY') === value.format('DD-MM-YYYY'));
    if (d) {
      listData = [
        { type: 'success', content: 'isShift' }
      ];
    } else {
      listData = []
    }
    return listData || [];
  }
  const dateCellRender = (value, fdata) => {
    const listData = getListData(value, fdata);
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
    var lstData = fdata.find(item => moment(`${item.year}-${item.month}-${item.date}`).format('DD-MM-YYYY') === date.format('DD-MM-YYYY'));
    if( lstData) {
      setPopup({open: true, data: lstData})
    }
  }
  return <>
    <Calendar 
      dateCellRender={(v)=>{
        return dateCellRender(v, fdata.map(item=> moment(`${item.year}-${item.month}-${item.date}`)))
      }}
      headerRender={renderHeader}
      onPanelChange={onPanelChange}
      onSelect={onSelect}
    />
     <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'Shift infomation'}
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
          <p>{popup.data.date ? popup.data.date :  'empty' }</p>
        </div>
        <div>
          <label>Month</label>
          <p>{popup.data.month ? popup.data.month :  'empty' }</p>
        </div>
        <div>
          <label>Year</label>
          <p>{popup.data.year ? popup.data.year :  'empty' }</p>
        </div>
        <div>
          <label>salaryCoefficient</label>
          <p>{popup.data.salaryCoefficient ? popup.data.salaryCoefficient :  'empty' }</p>
        </div>
        <div>
          <label>timeInOut</label>
          <p>{popup.data.shifts ? popup.data.shifts.timeInOut :  'empty' }</p>
        </div>
      </div>
    </Modal>
  </>
}