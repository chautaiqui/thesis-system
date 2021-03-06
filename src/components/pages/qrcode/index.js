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
        <Button className="btn-color" shape="round" type="primary"> 
          Filter
          <DatePicker className="qrcode-filter-date" allowClear={false}
            onChange={filterDate}
          />
        </Button>
      </Col>
      <Col span={12} style={{display: 'flex', alignItems: 'center'}}>
        {filter.have && (<Tag closable onClose={closeTag} color="#1890ff">{ filter.date instanceof moment? filter.date.format("DD-MM-YYYY") : ''}</Tag>)}
      </Col>
    </Row>
    <Table 
      rowKey='_id'
      tableLayout="auto"
      title={() => 'Qr Code'}
      scroll={{ x: 576 }}
      dataSource={data.data}
      columns={[
        {
          title: 'Date',
          align: 'center',
          key: 'date', 
          fixed: 'left',
          render: (text, record, index) => moment({date: record.date, month: record.month - 1, year: record.year}).format("DD-MM-YYYY"),
        },
        {
          title: 'Time In',
          align: 'center',
          key: 'timeIn', 
          render: (text, record, index) => {
            if(record.timeInOut){
              var _t = record.timeInOut.split("-");
              var _min = _t[0].split("h");
              return Number(_min[1]) >= 30 ? _min[0] + "h30" : _min[0] + "h00"
            }
          }
        },
        {
          title: 'Time Out',
          align: 'center',
          key: 'timeOut', 
          render: (text, record, index) => {
            if(record.timeInOut){
              var _t = record.timeInOut.split("-");
              var _min = _t[1].split("h");
              return Number(_min[1]) >= 30 ? _min[0] + "h30" : _min[0] + "h00"
            }
          }
        },
        {
          title: 'QrCode',
          align: 'center',
          key: 'qrcode',
          fixed: 'right',
          render: (text, record, index) => <Button className="btn-color" type="primary" shape="circle" icon={<QrcodeOutlined />} 
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