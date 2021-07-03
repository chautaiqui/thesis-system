import React, { useState } from 'react';

const url = "";
export const HotelItem = props => {
  const { hotel, onSelect = () => {}, selected } = props;
  const { name, imgs } = hotel;
  const [ ishover, setIshover ] = useState(false);
  function MouseEvent(event) {
    setIshover(event);
  }
  return <>
    <div style={{width: "200px", cursor: 'pointer'}} onMouseOver={()=>MouseEvent(true)} onMouseOut={()=>MouseEvent(false)} onClick={()=>onSelect(props.hotel)}>
      <img src={imgs ? imgs[0] : url} style={{height: "100px"}}/>
      <h1 className={selected ? 'hotel-item-choose' : 'hotel-item'} style={{color: ishover ? 'green' : 'black'}}>{name}</h1>
    </div>
  </>
}