import React, { useState, useEffect, useContext } from 'react';
import 'antd/dist/antd.css';
import './workingshift.style.css';
import axios from 'axios';
import { User } from '@pkg/reducers';
import { Shift } from './shift';
import DisplayEvent from '../../commons/display-event';
import moment from 'moment';
import localizer from 'react-big-calendar/lib/localizers/moment';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const globalizeLocalizer = localizer(moment);

export const WorkingShift = props => {
  const [ data, setData ] = useState([]);
  const [ _user, dispatchUser ] = useContext(User.context);
  useEffect(()=>{
    const getData = async () => {
      const res = await axios.get(`https://hotel-lv.herokuapp.com/api/employee/${_user.auth._id}/shifts`);
      if(res.status === 200) {
        setData(res.data)
      }
    }
    getData();
  },[])
  return <>
    {/* <Shift data={data}/> */}
    <DndProvider backend={HTML5Backend}>
      <DisplayEvent localizer={globalizeLocalizer} data={data}/>
    </DndProvider>
  </>
}