import React from 'react';
import { Bar } from 'react-chartjs-2';


const def_data = {
  // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      // data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const def_options = {
  indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  // responsive: true,
  // plugins: {
  //   legend: {
  //     display: false,
  //     position: 'right',
  //   },
  // },
};

const randomColor = (number) => {
  const arrColor = ['#ff4d4f', '#ffbb96', '#fa8c16', '#7cb305', '#fadb14', '#1890ff', '#36cfc9', '#c41d7f', '#1d39c4', '#434343'];
  return arrColor[number];
}

export const HorizontalBarChart = (props) => {
  const { data, options } = props;
  
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
};

export const CustomHorizontalBarChart = (props) => {
  const { data } = props;
  if(data.length === 0 ) return <></>;
  const dlabel = data.map(item => item.name);
  const ddata = data.map(item => item.rated.avgValue);
  const fdata = {
    labels: dlabel,
    datasets: [
      {
        label: '# of Rating',
        data: ddata,
        backgroundColor: dlabel.map((item, index)=> randomColor(index)),
        borderColor: dlabel.map(item=> "white"),
        borderWidth: 1,
      },
    ],
  }
  console.log(dlabel, ddata)
  return (
    <>
      <Bar data={fdata} options={def_options} />
    </>
  )
};