import React from 'react';

export const Item = (props) => {
  const { title, value } = props;
  return  <div className="item-container">
      <a className="item-container-child" href="#">
        <h2 className="item-title">{title}</h2>
        <div className="item-title item-title-value">{value}</div>
      </a>
    </div>
}