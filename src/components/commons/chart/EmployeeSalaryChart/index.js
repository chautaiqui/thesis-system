import React, { useState } from 'react';
import { Select, Row, Col } from 'antd';
import { CustomHorizontalBarChart1 } from '../horizontalBarChart';
const numtoMonth = (number) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[number-1];
}

export const EmployeeSalaryChart = props => {
  const { data } = props;
  const [ selected, setSelected ] = useState(data[data.length - 1].month);
  if(data.length === 0) return <div></div>
  return <Row gutter={[16,16]}>
    <Col span={24}>
      <Select 
        style={{width: '50%'}}
        allowClear
        showSearch
        value={selected}
        placeholder="Select month"
        notFoundContent={'Not Found'}
        options={data.map(item=>({label: numtoMonth(Number(item.month)), value: item.month}))}
        filterOption={(inputValue, options) => {
          return options.label.toLowerCase().includes(inputValue.toLowerCase())
        }}
        onChange={(v)=>setSelected(v)}
      />
    </Col>
    <Col span={24}>
      <CustomHorizontalBarChart1 data={data.filter(item=>item.month === selected)[0].arr}/>
    </Col>
  </Row>
}