import moment from 'moment';
import React, { useState, useEffect } from 'react';

const _style = {
  background: "lightgreen",
  border: "1px solid",
  borderRadius: "10px",
  cursor: "pointer",
  padding: "10px 10px",
  boxShadow: "0px 0px 10px -1px rgb(0 0 0 / 94%)"
}

export const RoomItem = ({room, action}) => {
  const [ isbooking, setIsbooking ] = useState({have: false, style: _style});

  useEffect(()=>{
    if(room.bookings.length === 0) return;
    room.bookings.map(item => {
      var now = moment();
      var start = moment(item.bookingStart);
      var end = moment(item.bookingEnd);
      const check = (start.isBefore(now, 'days') || start.isSame(now, 'days')) && end.isAfter(now, 'days');
      if(check) setIsbooking({
        have: true,
        style: {
          ...isbooking.style,
          background: "red"
        }
      });
    })
  },[room])
  return <div onClick={()=>{
    if(isbooking.have) return;
    action(room);
  }} style={isbooking.style}>
    <h1>{room.name}</h1>
    <p>{room.roomType.name}</p>
    {/* <p>{room.roomType.price}</p> */}
    <span>
        { room.roomType.price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}{" "}
      </span>
  </div>
}