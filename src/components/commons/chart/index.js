import React from 'react';
import { Bar } from 'react-chartjs-2';

export const VerticalBar = (props) => {
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return <>
    <div className='header'>
      <h1 className='ant-descriptions-title'>{props.title}</h1>
    </div>
    <Bar data={props.data} options={options} />
  </>
}