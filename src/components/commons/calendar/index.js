import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import DateCol from './date-col';
import moment from 'moment';

const arr = [];
for (var i = 0; i < 24; i++ ) {
  arr.push(i + ':00')
}

const Calendar = ({rowDate, data}) => {
  const render = (<>
    <Row style={{marginTop: 10}} className="custom-shift-row1">
      <Col span={3} className="box-item-row1"></Col>
      {rowDate.map((item, index) => {
        if (index === 0 ) {
          var _c = 'custom-row-left';
        } else if (index === 6) {
          var _c = 'custom-row-right';
        } else {
          var _c = 'custom-row-left-none';         
        }
        return <Col key={item} span={3} className={`box-item-col ${_c}`}>
          <DateCol date={moment(item, "DD-MM-YYYY")}/>
        </Col>
      })}
    </Row>
    <Row className="custom-shift-table-time">
      <Col span={3} className="custom-shift-table-time-left">
        {
          arr.map((item, index)=> {
            return <Col span={24} className="box-item-row1" key={index}> {item} </Col>
          })
        }
      </Col>
      {
        [1,2,3,4,5,6,7].map((item, index)=> {
          return <Col span={3} key={index}>
            {
              arr.map((it, id)=>{
                return <Col span={24} key={id} className="box-item"></Col>
              })
            }
          </Col>
        })
      }
    </Row>
  </>)
  useEffect(()=>{
    data.map((item, index) => {
      var col = document.querySelector(".custom-shift-row1");
      if(!col) return;
      var _i;
      rowDate.map((itm, idx) => {
        if(itm.toString() === item.col.toString()) {
          _i = idx + 1;
        }
      }) // find index of col
      if(!_i) {
        // remove timeIn, time, timeOut
        var timeIn = document.querySelectorAll(".box-item.timeIn");
        timeIn.forEach(item => {
          item.classList.remove("timeIn")
        })
        var timeOut = document.querySelectorAll(".box-item.timeOut");
        timeOut.forEach(item => {
          item.classList.remove("timeOut")
        })
        var time = document.querySelectorAll(".box-item.time");
        time.forEach(item => {
          item.classList.remove("time")
        })
        var contenr = document.querySelectorAll(".box-item.have-content");
        time.forEach(item => {
          item.classList.remove("have-content");
          item.innerText = ""
        })
      }
      if(_i) {
        // draw shift
        var lstCol = document.querySelector(".custom-shift-table-time");
        var nCol = lstCol.childNodes[_i];
        var aveIndex = Math.round((item.timeIn + item.timeOut)/2);
        if(nCol) {
          nCol.childNodes.forEach((i, ix) => {
            if(ix === item.timeIn) {
              i.classList.add("timeIn");
              i.addEventListener('click', ()=> {
                item.click(true, item)
              })
              console.log(ix + 1 === aveIndex)
              if(ix + 1 === aveIndex) {
                i.innerText = item.content;
                i.classList.add("have-content");
              }
            } 
            else if (ix > item.timeIn && ix < item.timeOut - 1) {
              i.classList.add("time");
              if(ix === aveIndex - 1 ) {
                i.innerText = item.content;
                i.classList.add("have-content");
              }
              i.addEventListener('click', ()=> {
                item.click(true, item)
              })
            } 
            else if (ix === item.timeOut) {
              nCol.childNodes[ix-1].classList.add("timeOut");
              i.addEventListener('click', ()=> {
                item.click(true, item)
              })
            }
          })
        }
      }
    })
  },[rowDate, data])
  return render
}

export default Calendar;