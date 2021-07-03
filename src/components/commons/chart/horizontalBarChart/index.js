import React from 'react';
import { Bar } from 'react-chartjs-2';

export const HorizontalBarChart = (props) => {
  const { data, options } = props;
  
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
};
