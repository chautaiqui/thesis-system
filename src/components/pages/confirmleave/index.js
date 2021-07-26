import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { CheckCircleTwoTone, NodeExpandOutlined, SyncOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Space, Calendar } from 'antd';
import { _getRequest } from '@api';
import { messageError, messageSuccess } from '../../commons';
import { postMethod } from '../../../pkg/api';
import moment from 'moment';
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
        behavior: 'stall'
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
  function reject(record) {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Check reject last time!',
      okText: 'Reject',
      cancelText: 'Cancel',
      onOk: ()=>rejectLeave(record)
    });
  }
  const rejectLeave = (record) => {
    const action = async () => {
      const res = await postMethod(`hotel/${record._id}/unaccept-leave`);
      if(res.success) {
        messageSuccess("Reject successfully!");
        setState({
          ...state,
          behavior: 'init'
        })
      }
    }
    action();
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
  return <>
    <Table 
      rowKey='_id'
      title={() => 'Confirm leave'}
      dataSource={state.data} 
      columns={[
        {
          title: 'Employee',
          align: 'center',
          key: 'employee', 
          render: (text, record, index) => <div>{record.employee.email}</div>
        },
        {
          title: 'Title',
          dataIndex: 'title',
          align: 'center',
          key: 'title', 
          filters: [
            {
              text: "Nghỉ phép",
              value: "Nghỉ phép",
            },
            {
              text: "Nghỉ phép không lương",
              value: "Nghỉ phép không lương",
            },
            {
              text: "Điểm danh muộn",
              value: "Điểm danh muộn",
            },
          ],
          onFilter: (value, record) => record.title.indexOf(value) === 0,
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
          render: (text, record, index) => <div>{record.date}-{record.month}-{record.year}</div>,
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <Calendar fullscreen={false} onChange={(date) => {
                if(date) {
                  console.log('onchange: ', date)
                  confirm();
                  setSelectedKeys(date);
                }
                clearFilters();
              }}/>
          ),
          filterIcon: (filtered) => (
            <DownOutlined style={{ color: filtered ? "#1890ff" : undefined }}/>
          ),
          onFilter: (value, record) => {
            console.log(moment([record.year, record.month-1, record.date]).isSame(value))
            return moment([record.year, record.month-1, record.date]).isSame(value)
          }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align: 'center',
          key: 'status',
          filters: [
            {
              text: "accepted",
              value: "accepted",
            },
            {
              text: "unaccepted",
              value: "unaccepted",
            },
            {
              text: "pending",
              value: "pending",
            },
          ],
          onFilter: (value, record) => record.status.indexOf(value) === 0,
          render: (text, record, index) => {
            const color = record.status === "accepted" ? "#a0d911" : record.status === "unaccepted" ? "#cf1322" : "#722ed1"
            return <p style={{color}}>{record.status}</p>
          }
        },
        {
          title: 'Action',
          align: 'center',
          key: 'action',
          render: (text, record, index) => {
            return (record.status === "accepted" || record.status === "unaccepted") ? <div></div> :<Space size={[16, 16]}>
              <Button size="small" shape="round" style={{background: "#a0d911"}} onClick={()=>confirm(record)}>Accpet</Button>
              <Button size="small" shape="round" style={{background: "#cf1322"}} onClick={()=>reject(record)}>Reject</Button>
            </Space>
          }
        },
      ]}
    />
  </>
}