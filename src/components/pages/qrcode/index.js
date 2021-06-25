import React, { useState, useEffect, useContext } from 'react';
import QRCode from 'qrcode';
import { _getRequest } from '../../../pkg/api';
import { User } from '@pkg/reducers';
import { Table, Button, Modal, DatePicker, Row, Col, Tag } from 'antd';
import { QrcodeOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { filter } from 'lodash';


export const Qrcode = props => {
  const [ data, setData ] = useState({behavior: 'init', data: []});
  const [ popup, setPopup ] = useState({open: false, shift: {}});
  const [ qrcode, setQrcode ] = useState({status: false, src: ""});
  const [ filter, setFilter ] = useState({have: false, date: {}});
  const [ user ] = useContext(User.context);
  
  const getData = async (check, options) => {
    if(check) {
      const res = await _getRequest(`hotel/${user.auth.hotel}/hotel-shifts`, options);
      if(res.success) {
        setData({
          behavior: 'stall',
          data: res.result.hotelShifts
        })
      }
    } else {
      const res = await _getRequest(`hotel/${user.auth.hotel}/hotel-shifts`);
      if(res.success) {
        setData({
          behavior: 'stall',
          data: res.result.hotelShifts
        })
      }
    }
    
  }

  useEffect(()=>{
    if(data.behavior === 'init') {
      getData(false, {});
    }
  },[data.behavior]);
  useEffect(()=>{
    if(filter.have) {
      const options = {
        date: filter.date.date(),
        month: filter.date.month() + 1,
        year: filter.date.year(),
      }
      getData(true, options);
    } 
    if (!filter.have) {
      getData(false, {});
    }
  },[filter])
  const filterDate = (date, dateString) => {
    setFilter({have: true, date: date});
  }
  const closeTag = () => {
    setFilter({have: false, date: {}});
  }
  // console.log(filter)
  return <>
    <Row gutter={[16,16]} style={{margin: "0px 0px 10px", background: "#fff"}}>
      <Col span={12}>
        <Button shape="round" type="primary"> 
          Filter
          <DatePicker className="qrcode-filter-date" allowClear={false}
            onChange={filterDate}
          />
        </Button>
      </Col>
      <Col span={12} style={{display: 'flex', alignItems: 'center'}}>
        {filter.have && (<Tag closable onClose={closeTag}>{ filter.date instanceof moment? filter.date.format("DD-MM-YYYY") : ''}</Tag>)}
      </Col>
    </Row>
    <Table 
      rowKey='_id'
      tableLayout="auto"
      title={() => 'Qr Code'}
      dataSource={data.data}
      columns={[
        {
          title: 'Date',
          align: 'center',
          key: 'date', 
          render: (text, record, index) => moment({date: record.date, month: record.month - 1, year: record.year}).format("DD-MM-YYYY"),
        },
        {
          title: 'timeInOut',
          dataIndex: 'timeInOut',
          align: 'center',
          key: 'timeInOut', 
        },
        {
          title: 'QrCode',
          align: 'center',
          key: 'qrcode',
          render: (text, record, index) => <Button type="primary" shape="circle" icon={<QrcodeOutlined />} 
            onClick={()=>{
              const generateQrCode = async () => {
                try {
                  const response = await QRCode.toDataURL(`https://hotel-lv.herokuapp.com/api/hotel-shift/${record._id}`);
                  console.log('url', response, record)
                  setPopup({open:true, shift: record});
                  setQrcode({status:true, src: response});
                }catch (error) {
                  console.log(error);
                }
              }
              generateQrCode();    
            }}
          />
        },
      ]}
    />
    <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'Qr Code'}
      key='modal_qrcode'
      width='40%' 
      visible={popup.open}
      forceRender
      keyboard
      footer={
        <div>
          <Button shape='round' onClick={()=>{
            setPopup({open: false, shift: {}});
            setQrcode({status: false, src: ""});
          }}>Close</Button>
        </div>
      }
      onCancel={() => {
        setPopup({open: false, shift: {}});
        setQrcode({status: false, src: ""});
      }} 
    >
      {
        qrcode.status ? (
          <img src={qrcode.src} alt="qrcode" style={{width: '100%'}}/>
        ) : null
      }
    </Modal>
  </>
}