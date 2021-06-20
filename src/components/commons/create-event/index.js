import React, { useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import ExampleControlSlot from './ExampleControlSlot';
import CustomEvent from '../custom-event';
import CustomWeek from '../custom-week';
import { Modal } from 'antd';

const initState = {
  events: [],
  shift: {
    open: false,
    event: {}
  },
  newshift: {
    open: false,
    start: undefined,
    end: undefined
  },
  dayLayoutAlgorithm: 'no-overlap',
}
const CreateEvent = ({localizer, data, formData, formControl}) => {
  const [state, setState] = useState(initState);

  const handleSelect = ({ start, end }) => {
    setState({
      ...state,
      newshift: {
        open: true,
        start: start,
        end: end
      }
    })
  }
  const viewShift = (event) => {
    setState({
      ...state,
      shift: {
        open: true,
        event: event
      }
    })
  }
  useEffect(()=>{
    setState({
      ...state,
      events: data
    })
  }, [data]);
  // console.log(state.events)
  useEffect(()=>{
    if(!state.newshift.open) {
      formControl.resetFields();
    }
  },[state.newshift])
  return (
    <>
      <ExampleControlSlot.Entry waitForOutlet>
        
      </ExampleControlSlot.Entry>
      <Calendar
        selectable
        localizer={localizer}
        events={state.events}
        defaultView={Views.WEEK}
        views={{ week: CustomWeek }}
        scrollToTime={new Date(2020, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={event => viewShift(event)}
        onSelectSlot={handleSelect}
        dayLayoutAlgorithm={state.dayLayoutAlgorithm}
        components={{
          event: CustomEvent
        }}
      />
      <Modal
        title={"Shift"}
        centered
        visible={state.shift.open}
        onOk={() => setState({
          ...state,
          shift: {
            open: false,
            event:{}
          }
        })}
        onCancel={() => setState({
          ...state,
          shift: {
            open: false,
            event:{}
          }
        })}
      >
        {JSON.stringify(state.shift.event)}
      </Modal>
      <Modal
        title={"Create shift"}
        centered
        visible={state.newshift.open}
        onOk={() => {
         var start = state.newshift.start;
         var end = state.newshift.end;
          formControl.setFieldsValue({
            date: start.getDate(),
            month: start.getUTCMonth() + 1,
            year: start.getUTCFullYear(),
            timeInOut: `${start.getHours()}h${start.getMinutes()} - ${end.getHours()}h${end.getMinutes()}`
          })
          formControl.submit();
          setState({
            ...state,
            newshift: {
              open: false,
              event:{}
            }
          });
          // setState({
          //   ...state,
          //   events: [
          //     ...state.events,
          //     {
          //       start: state.newshift.start,
          //       end: state.newshift.end,
          //       title: "shift",
          //       employeeList: []
          //     },
          //   ],
          // })
        }}
        onCancel={() => setState({
          ...state,
          newshift: {
            open: false,
            event:{}
          }
        })}
      >
        {formData}
      </Modal>
    </>
  )
}

export default CreateEvent;