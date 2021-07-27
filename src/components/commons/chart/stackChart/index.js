import React, { useState, useEffect } from 'react';
import { Bar } from '@ant-design/charts';

const sumData = (lstFacility, field) => {
  return lstFacility.length === 0 ? 0 : lstFacility.map(item=>
    item[field]
  ).reduce(function(cur,next){ return cur + next},0)
} 

function DivData (obj) {
  return [
    {
      hotel: obj.hotelName,
      value: obj.available,
      type: "Available"
    },
    {
      hotel: obj.hotelName,
      value: obj.used,
      type: "Used"
    }
  ]
}

const DemoBar = (props) => {
  console.log(props.data);
  var preData = props.data.map(item => {
    return {
      hotelName: item.hotelName,
      amount: sumData(item.facilityType,'amount'),
      available: sumData(item.facilityType,'availableAmount'),
      used: sumData(item.facilityType,'usedAmount')
    }
  })
  var finalData = [];
  var temp = preData.map(item=>{
    finalData = [...finalData, ...DivData(item) ]
  });
  var config = {
    data: finalData.reverse(),
    isStack: true,
    xField: 'value',
    yField: 'hotel',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  };
  return <Bar {...config} />;
};

export default DemoBar;