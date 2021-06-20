import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/sass/styles.scss';
import CreateEvent from '../create-event';
import localizer from 'react-big-calendar/lib/localizers/moment';
import moment from 'moment';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Row, Col } from 'antd';
import { Box } from '../box';
const getNumberfromString = (str) => {
  var format = /\d+/;
  return Number(str.match(format))
}

const globalizeLocalizer = localizer(moment)

export const Shift = ({data, employee=[], formData, formControl, assign=()=>{}}) => {
  const [ shift, setShift ] = useState({shift: [], employee: []});
  useEffect(()=>{
    console.log(employee)
    var temp = data.map(item => {
      var _temp = item.timeInOut.split("-");
      var _t = _temp.map(i => {
        var _our = i.split('h');
        return {
          hour: Number(_our[0]),
          minute: Number(_our[1])
        }
      }); // 0: start, 1: end
      var start = new Date(item.year, item.month-1, item.date, _t[0].hour, _t[0].minute, 0);
      var end = new Date(item.year, item.month-1, item.date, _t[1].hour, _t[1].minute, 0);
      return {
        ...item,
        start: start,
        end: end,
        assign: assign
      }
    });
    setShift({shift: temp, employee: employee})
  }, [data, employee]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Row gutter={[16,16]}>
        <Col span={20}>
          <div className="example">
            <CreateEvent localizer={globalizeLocalizer} data={shift.shift} formData={formData} formControl={formControl}/>
          </div>
        </Col>
        <Col span={4}>
          {
            shift.employee.map((item, index)=> <Box employee={item} key={index}/>)
          }
        </Col>
      </Row>
    </DndProvider>
  );
}