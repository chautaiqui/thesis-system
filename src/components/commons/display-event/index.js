import React, { useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import CustomEvent from '../custom-event';
import CustomWeek from '../custom-week';
import { Form, Radio, Modal, Button } from 'antd';

const DisplayEvent = ({localizer, data}) => {
  console.log(data);
  const [ shift, setShift ] = useState([]);
  const [ ashift, setAshift ] = useState({open: false, event: {}})
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
        end: end,
      }
    });
    setShift(temp)
  }, [data]);
  const viewShift = (event) => {
    setAshift({open: true, event: event})
  }
  console.log(shift)
  return <>
    <Calendar
      events={shift}
      defaultView={Views.WEEK}
      views={{ week: CustomWeek }}
      scrollToTime={new Date(2020, 1, 1, 6)}
      defaultDate={new Date()}
      onSelectEvent={event => viewShift(event)}
      dayLayoutAlgorithm={'no-overlap'}
      components={{
        event: CustomEvent
      }}
      localizer={localizer}
    />
    <Modal
        title={"Shift"}
        centered
        visible={ashift.open}
        forceRender
        keyboard
        footer={
          <div>
            <Button shape='round' type='primary' onClick={()=>{
              setAshift({open: false, event: {}})
            }}>Close</Button>
          </div>
        }
        onCancel={() => {
          setAshift({open: false, event: {}})
        }} 
      >
        <Form
        >
          <Form.Item label="Salary Coefficient">
            <span>
              { ashift.event.salaryCoefficient ? ashift.event.salaryCoefficient.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }) : ""}{" "}
            </span>
          </Form.Item>
          <Form.Item label="Date">
            <span>{(function(){
              var _d = new Date(ashift.event.year, ashift.event.month, ashift.event.date);
              console.log(_d)
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              return _d.toLocaleDateString('en-EN', options)
            })()}</span>
          </Form.Item>
          <Form.Item label="Time In">
            <span>{(function(){
              if(ashift.event.timeInOut){
                var _t = ashift.event.timeInOut.split("-");
                return _t[0]
              }
            })()}</span>
          </Form.Item>
          <Form.Item label="Time Out">
          <span>{(function(){
              if(ashift.event.timeInOut){
                var _t = ashift.event.timeInOut.split("-");
                return _t[1]
              }
            })()}</span>
          </Form.Item>
          <Form.Item label="Employee">
            <Radio.Group>
              {
                ashift.event.employeeList && ashift.event.employeeList.map((item, index)=>{
                  return <Radio.Button key={index}>{item.name}</Radio.Button>
                })
              }
            </Radio.Group>
          </Form.Item>
        </Form>
        {/* {JSON.stringify(state.shift.event)} */}
      </Modal>
  </>
}

export default DisplayEvent;