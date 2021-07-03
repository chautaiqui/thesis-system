import React, { useEffect } from 'react';
import OverflowScrolling from 'react-overflow-scrolling';
import { HotelItem } from '../hotel-item';

export const Scroll = props => {
  const { hotels, onSelect = () => {}, hotel = {} } = props;
  useEffect(()=>{
    if(!hotel._id) onSelect(hotels[0]);
  },[hotel])
  return (
    <div className="container-scroll">
      <OverflowScrolling className='overflow-scrolling'>
        {
          hotels.map((item, index) => <HotelItem key={index} hotel={item} onSelect={onSelect} selected={item._id===hotel._id}/>)
        }
      </OverflowScrolling>
    </div>
  )
}