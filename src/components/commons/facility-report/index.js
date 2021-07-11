import React from 'react';
import { Table } from 'antd';
import { filerColumn } from '../../commons';

const sumData = (lstFacility, field) => {
  return lstFacility.length === 0 ? 0 : lstFacility.map(item=>
    item[field]
  ).reduce(function(cur,next){ return cur + next},0)
} 

export const FacilityReport = (props) => {
  const { data } = props;
  const columns = [
    {
      title: 'Hotel',
      dataIndex: 'hotelName',
      align: 'center',
      key: 'hotelName',
      ...filerColumn([], 'hotelName'),
      onFilter: (value, record) =>
        record.hotelName
          ? record.hotelName.toString().toLowerCase().includes(value.toLowerCase())
          : '',
    },
    {
      title: 'Amount',
      align: 'center',
      key: 'amount',
      render: (text, record, index) => sumData(record.facilityType,'amount')
      // facilityType
    },
    {
      title: 'Available',
      align: 'center',
      key: 'availableAmount',
      render: (text, record, index) => sumData(record.facilityType,'availableAmount')
    },
    {
      title: 'Used',
      align: 'center',
      key: 'used',
      render: (text, record, index) => sumData(record.facilityType,'usedAmount')
    },
  ];
  return <Table 
    rowKey={"_id"}
    columns={columns}
    dataSource={data}
    pagination={false}
    bordered={true}
    size={'small'}
  />
}