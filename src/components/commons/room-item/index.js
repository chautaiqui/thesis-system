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
    if(room.bookings.length === 0) {
      setIsbooking({
        have: false,
        style: _style
      })
      return;
    };
    room.bookings.map(item => {
      var now = moment();
      var start = moment(item.bookingStart, "YYYY-MM-DD");
      var end = moment(item.bookingEnd, "YYYY-MM-DD");
      const check = (start.isBefore(now, 'days') || start.isSame(now, 'days')) && end.isAfter(now, 'days');
      if(check) setIsbooking({
        have: true,
        style: {
          ...isbooking.style,
          background: "red"
        }
      });
    })
  },[room, action])
  return <div onClick={()=>{
    if(isbooking.have) return;
    action(room);
  }} style={isbooking.style}>
    <h1>Name: {room.name}</h1>
    <p><strong>Room type:</strong> {room.roomType.name}</p>
    <p><strong>Capacity:</strong> {room.roomType.capacity}</p>
    {/* <p>{room.roomType.price}</p> */}
    <span>
    <strong>Price:</strong> { room.roomType.price.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      })}{" "}
    </span>
  </div>
}