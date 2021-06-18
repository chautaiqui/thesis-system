import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/sass/styles.scss';
import CreateEvent from '../create-event';
import localizer from 'react-big-calendar/lib/localizers/moment';
import moment from 'moment';

const getNumberfromString = (str) => {
  var format = /\d+/;
  return Number(str.match(format))
}

const globalizeLocalizer = localizer(moment)

export const Shift = ({data}) => {
  const [ shift, setShift ] = useState([]);
  useEffect(()=>{
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
        end: end
      }
    });
    setShift(temp)
  }, [data])
  console.log(shift)
  return (
    <div className="example">
      <CreateEvent localizer={globalizeLocalizer} data={shift}/>
    </div>
  );
}