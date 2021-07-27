import React, { useState, useEffect } from 'react';
import { DualAxes } from '@ant-design/charts';

const numtoMonth = (number) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[number-1];
}

const DemoDualAxes = (props) => {
  const { data = []} = props;
  const pdata = data.reverse().map(item => {
    return {
      ...item,
      month: numtoMonth(item.month)
    }
  });
  console.log(pdata)
  var config = {
    data: [pdata, pdata],
    xField: 'month',
    yField: ['totalMoney', 'totalAmount'],
    // meta: {
    //   consumeTime: {
    //     alias: 'Total booking',
    //     formatter: function formatter(v) {
    //       var t = new Intl.NumberFormat('de-DE').format(v);
    //       return ''.concat(t, " VND"); 
    //     },
    //   },
    //   completeTime: {
    //     alias: 'Total amount',
    //     formatter: function formatter(v) {
    //       return Number(v);
    //     },
    //   },
    // },
    // tooltip: {
    //   formatter: (data) => {
    //     return { 
    //       totalMoney: new Intl.NumberFormat('de-DE').format(data.totalMoney), 
    //       totalAmount: data.totalAmount }
    //   },
    // },
    geometryOptions: [
      {
        geometry: 'column',
        color: '#52c41a',
      },
      {
        geometry: 'line',
        color: '#096dd9',
      },
    ],
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
      // tickCount: data.length / 2,
    },
    yAxis: {
      totalMoney: {
        label: {
          formatter: function formatter(v) {
            var t = new Intl.NumberFormat('de-DE').format(v);
            return ''.concat(t, " VND");
          },
        },
      },
      totalAmount: {
        label: {
          formatter: function formatter(v) {
            return ''.concat(v);
          },
        },
      },
    },
    legend: {
      itemName: {
        formatter: function formatter(text, item) {
          return item.value === 'totalMoney' ? 'Total booking' : 'Amount booking';
        },
      },
    },
  };
  return <DualAxes {...config} />;
};

export default DemoDualAxes;