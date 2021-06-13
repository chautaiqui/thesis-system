import React, { useState, useEffect, useContext } from 'react';
import QRCode from 'qrcode';
import { _getRequest } from '../../../pkg/api';
import { User } from '@pkg/reducers';
import { Table, Button, Modal } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';


export const Qrcode = props => {
  const [ data, setData ] = useState({behavior: 'init', data: []});
  const [ popup, setPopup ] = useState({open: false, shift: {}});
  const [ qrcode, setQrcode ] = useState({status: false, src: ""});
  const [ user ] = useContext(User.context);
  useEffect(()=>{
    if( data.behavior === 'init') {
      const getData = async () => {
        const res = await _getRequest(`hotel/${user.auth.hotel}/hotel-shifts`);
        if(res.success) {
          setData({
            behavior: 'stall',
            data: res.result.hotelShifts
          })
        }
      }
      getData();
    }
  },[data.behavior]);
  useEffect(()=>{
    if(popup.open) {
      const generateQrCode = async () => {
        try {
          // const response = await QRCode.toDataURL("https://hotel-lv.herokuapp.com/api/hotel-shift/60a3f4a50b82ca001561f91e");
          const response = await QRCode.toDataURL(`https://hotel-lv.herokuapp.com/api/hotel-shift/${popup.shift.id}`);
          setQrcode({status: true, src: response});
        }catch (error) {
          console.log(error);
        }
      }
      generateQrCode();
    }
  },[popup.open])
  console.log(data);
  console.log(qrcode);
  return <>
    <Table 
      rowKey='_id'
      tableLayout="auto"
      title={() => 'Qr Code'}
      dataSource={data.data}
      columns={[
        {
          title: 'Year',
          dataIndex: 'date',
          align: 'center',
          key: 'date', 
        },
        {
          title: 'Month',
          dataIndex: 'month',
          align: 'center',
          key: 'month', 
        },
        {
          title: 'Year',
          dataIndex: 'year',
          align: 'center',
          key: 'year', 
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
              setPopup({open:true, shift: record})
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
      width='60%' 
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