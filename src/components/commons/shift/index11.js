import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { getWeekYearNow, arrayDate, arrayDatetoString } from '../date';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Calendar from '../calendar';

export const Shift = props => {
  const { data } = props;
  const defCol = useMemo(() => getWeekYearNow(), [props]);
  const [ rowDate, setRowDate ] = useState(defCol);
  const toggleWeek = (next) => {
    var firstDate = moment(rowDate[0], "DD-MM-YYYY");
    var week = firstDate.week();
    var year = firstDate.year();
    if(next) {
      // next
      var lstCol = arrayDate(week+1, year);
      setRowDate(lstCol)
    } else {
      // prev
      var lstCol = arrayDate(week-1, year);
      setRowDate(lstCol)
    }
  }
  const chooseWeek = (date, dateString) => {
    console.log(date, dateString);
    var temp = dateString.split("-");
    var year = Number(temp[0]);
    var week = Number(temp[1].match(/\d+/g));
    console.log(week)
    var lstCol = arrayDate(week, year);
    setRowDate(lstCol);
  };
  return (
    <>
      <div className="title-calendar">
        <div className="title-button" onClick={()=>toggleWeek(false)}><LeftOutlined /></div>
        <div style={{position: "relative", width: 200}}>
            <DatePicker
              allowClear={false}
              picker="week"
              style={{opacity: 0, zIndex: 1}}
              onChange={chooseWeek}
              disabledDate={(current) => {
                return (
                  current && current < moment().endOf("day").subtract(7, "days")
                );
              }}
            />
            <div className="title-calendar-item">{arrayDatetoString(rowDate)}</div>
        </div>
        <div className="title-button" onClick={()=>toggleWeek(true)}><RightOutlined /></div>
      </div>
      <Calendar rowDate={rowDate} data={data}/>
    </>
  )
}