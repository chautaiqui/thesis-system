import React, { useState, useEffect } from 'react';
import { Bar } from '@ant-design/charts';

function DivData (obj) {
  return [
    {
      hotel: obj.name,
      value: obj.availableAmount,
      type: "Available"
    },
    {
      hotel: obj.name,
      value: obj.usedAmount,
      type: "Used"
    }
  ]
}

const DemoBar1 = (props) => {
  const { data } = props;
  var finalData = [];
  var temp = data.map(item=>{
    finalData = [...finalData, ...DivData(item) ]
  });
  console.log(data)
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

export default DemoBar1;