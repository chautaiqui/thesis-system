import React from 'react';
import moment from 'moment';

import List from '@components/commons/list';

const Transactions = () => {
  return ( 
    <List
      fn='transactions'
      tColumns={[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          ellipsis: true
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (v, r) => `${v} ${r.currency}`
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: v => moment(v._seconds*1000).format('YYYY-MM-DD hh:mm:ss')
        },
        {
          title: 'Plan',
          dataIndex: 'plan',
          key: 'plan',
          ellipsis: true,
          render: v => v ? v.id : ''
        },
        {
          title: 'User',
          dataIndex: 'user',
          key: 'user',
          ellipsis: true,
          render: v => v ? v.id : ''
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status'
        }
      ]}
    />
  );
}

export default Transactions;