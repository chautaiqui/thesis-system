import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { CheckCircleTwoTone, NodeExpandOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';
import { _getRequest } from '@api';
import { messageError, messageSuccess } from '../../commons';
import { postMethod } from '../../../pkg/api';
const initState = {
  data: [],
  behavior: 'init'
}; 

export const ConfirmLeave = props => {
  const [ state, setState ] = useState(initState);
  const [ user ] = useContext(User.context);

  
  const getData = async() => {
    const res = await _getRequest(`hotel/leave-form/${user.auth.hotel}`);
    if(res.success) {
      setState({
        data: res.result,
        behavior: 'init'
      })
    } else {
      messageError(res.error);
    }
  }

  useEffect(()=>{
    switch (state.behavior) {
      case 'init':
        getData();
        return;
      case 'stall':
        return ;
      default:
        break;
    }
  }, [state.behavior]);

  function confirm(record) {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Please confirm leave form last time!',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: ()=>confirmLeave(record)
    });
  }
  const confirmLeave = (record) => {
    const action = async () => {
      const res = await postMethod(`hotel/${record._id}/confirm-leave`);
      if(res.success) {
        messageSuccess("Confirm successfully!");
        setState({
          ...state,
          behavior: 'init'
        })
      }
    }
    action();
  }
  console.log(state)
  return <>
    <Table 
      rowKey='_id'
      title={() => 'Confirm leave'}
      dataSource={state.data.filter(item=>item.status === "pending")} 
      columns={[
        {
          title: 'Title',
          dataIndex: 'title',
          align: 'center',
          key: 'title', 
        },
        {
          title: 'Reason',
          dataIndex: 'reason',
          align: 'center',
          key: 'reason', 
        },
        {
          title: 'Date',
          align: 'center',
          key: 'date',
          render: (text, record, index) => <div>{record.date}-{record.month}-{record.year}</div>
        },
        {
          title: 'Status',
          align: 'center',
          key: 'status',
          render: (text, record, index) => {
            return <Button
              size='small'
              shape="circle" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
              onClick={()=>{
                confirm(record)
              }}
            ></Button>
          }
        },
      ]}
    />
  </>
}