import React from 'react';
import { Bar } from 'react-chartjs-2';
const rand = () => Math.round(Math.random() * 20 - 10);

const defaultData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      type: 'line',
      label: 'Total',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 2,
      fill: false,
      data: [1000000, 7000000, 5000000, 9000000, 8000000, 15000000, 11000000],
    },
    {
      type: 'bar',
      label: 'Total',
      backgroundColor: '#a0d911',
      data: [1000000, 7000000, 5000000, 9000000, 8000000, 15000000, 11000000],
      borderColor: 'white',
      borderWidth: 2,
    }
  ],
};
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false
    },
  },
};

const numtoMonth = (number) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[number-1];
}
export const MultiTypeChart = (props) => {
  const { data } = props;
  const pdata = data.map(item => {
    return {
      ...item,
      month: numtoMonth(item.month)
    }
  });
  const dlabel = pdata.map(item=>item.month);
  const ddata = pdata.map(item=>item.totalMoney);
  const fdata = {
    labels: dlabel,
    datasets: [
      // {
      //   type: 'line',
      //   label: 'Total',
      //   borderColor: 'rgb(54, 162, 235)',
      //   borderWidth: 2,
      //   fill: false,
      //   data: ddata,
      // },
      {
        type: 'bar',
        label: 'Total',
        backgroundColor: '#a0d911',
        data: ddata,
        borderColor: 'white',
        borderWidth: 2,
      }
    ],
  }
  // console.log(pdata)
  return <>
    <Bar data={fdata} options={options}/>
  </>
}

export const MultiTypeChart2 = (props) => {
  const { data } = props;
  const pdata = data.reverse().map(item => {
    return {
      ...item,
      month: numtoMonth(item.month)
    }
  });
  const dlabel = pdata.map(item=>item.month);
  const ddata = pdata.map(item=>item.bookingMoney);
  const fdata = {
    labels: dlabel,
    datasets: [
      // {
      //   type: 'line',
      //   label: 'Total',
      //   borderColor: 'rgb(54, 162, 235)',
      //   borderWidth: 2,
      //   fill: false,
      //   data: ddata,
      // },
      {
        type: 'bar',
        label: 'Total',
        backgroundColor: '#a0d911',
        data: ddata,
        borderColor: 'white',
        borderWidth: 2,
      }
    ],
  }
  // console.log(pdata)
  return <>
    <Bar data={fdata} options={options}/>
  </>
}

