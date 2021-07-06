import React from 'react';
import { Table } from 'antd';


const fdata = [
  {
      "bookingAmount": 2,
      "bookingMoney": 7000000,
      "ratingAmount": 2,
      "ratingAllValue": 5,
      "ratingAvg": 2.5,
      "hotelName": [
          "House Condotel"
      ],
      "hotelId": [
          "60b5156c42452a001561f366"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": [
          "La Maison Grise"
      ],
      "hotelId": [
          "60b5173442452a001561f367"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 1,
      "ratingAllValue": 3,
      "ratingAvg": 3,
      "hotelName": [
          "La Poise"
      ],
      "hotelId": [
          "60b930fb0ecec5001596aeb1"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": [
          "Fami Villa"
      ],
      "hotelId": [
          "60d34e8f01844f0015939c9c"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": ["Villa De Blanc"
      ],
      "hotelId": [
          "60ba1b4e37882400157e218c"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": [
          "Melody Vung Tau"
      ],
      "hotelId": [
          "60b931640ecec5001596aeb2"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": [
          "J3 Superious"
      ],
      "hotelId": [
          "60b931c10ecec5001596aeb3"
      ]
  },
  {
      "bookingAmount": 0,
      "bookingMoney": 0,
      "ratingAmount": 0,
      "ratingAllValue": 0,
      "ratingAvg": 0,
      "hotelName": [
          "Paradise Destination"
      ],
      "hotelId": [
          "60ba17b237882400157e218a"
      ]
  }
];
export const TableReport = (props) => {
  const { data } = props;
  const columns = [
    {
      title: 'Hotel',
      align: 'center',
      key: 'age',
      render: (text, record, index) => record.hotelName[0]
    },
    {
      title: 'Booking amount',
      dataIndex: 'bookingAmount',
      align: 'center',
      key: 'bookingAmount'
    },
    {
      title: 'Total Money',
      dataIndex: 'bookingMoney',
      align: 'center',
      key: 'bookingMoney',
      render: (text, record, index) => <span style={{paddingLeft: 10}}>
        {record.bookingMoney.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}{" "}
      </span>
    },
    {
      title: 'Rating',
      dataIndex: 'ratingAllValue',
      align: 'center',
      key: 'ratingAllValue'
    },
  ];
  return <Table 
    rowKey={record=>record.hotelId[0]}
    columns={columns}
    dataSource={data}
    pagination={false}
    bordered={true}
    size={'small'}
  />
}