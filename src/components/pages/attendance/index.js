import React, {useState, useRef, useEffect, useContext } from 'react';
import QRCode from 'qrcode';
import { User } from '@pkg/reducers';

import { _getRequest } from '@api';
import QrReader from 'react-qr-reader';
import './attendance.style.css';
import { Button, Row, Col, message } from 'antd';
import { History } from './history'
import axios from 'axios';
export const Attendance = props => {
  const [ _user, dispatchUser ] = useContext(User.context);
  const [scanResultFile, setScanResultFile] = useState('');
  const [ scan, setScan ] = useState(false);
  const [ attendence, setAttendence ] = useState(false);
  const qrRef = useRef(null);
  const handleErrorFile = (error) => {
    console.log(error);
    message.error(error);
  }
  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
    message.error(error);
  }
  const handleScanWebCam = (result) => {
    if (result){
      setScanResultFile(result);
    }
  }
  useEffect(()=>{
    if(scanResultFile !== ''){
      console.log(scanResultFile)
      const getShift = async () => {
        const res = await axios.get(scanResultFile)
        console.log(res)
        if(res.status === 200){
          console.log('data: ', res.data)
          if (res.data.employeeList.includes(_user.auth._id)) {
            console.log('co ca')
            // post api diem danh
            const att = await axios.post(`https://hotel-lv.herokuapp.com/api/attendance/${res.data._id}/${_user.auth._id}`, {
              "hotel-shift": res.data._id,
              employee: _user.auth._id
            })
            console.log(att);
            if(res.status === 200) {
              message.success('Attendance success');
              // do something
              setAttendence(true)
            }
          } else {
            message.error('You are not in shift')
            setAttendence(true)
          }
          setScan(false)
        } else {
          message.error('QRCode error url')
        }
      }
      getShift()
    }
  },[scanResultFile])
  return <>
    {/* <Button onClick={()=>{
      const generateQrCode = async () => {
        try {
          const response = await QRCode.toDataURL("https://hotel-lv.herokuapp.com/api/hotel-shift/60a3f4a50b82ca001561f91e");
          setImageUrl(response);
        }catch (error) {
          console.log(error);
        }
      }
      generateQrCode();
    }}>QR to URL</Button>
    <br />
    {
      imageUrl ? (
      <a href={imageUrl} download>
          <img src={imageUrl} alt="img"/>
      </a>) : null
    } */}
    <History employeeid={_user.auth._id} f5={attendence}/>
    { !attendence && (<Row gutter={[16,16]} style={{marginTop: 20}}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Button className="btn-box-shawdow btn-color" type="primary" onClick={onScanFile}>Scan Qr Code</Button>
        <QrReader
          ref={qrRef}
          delay={300}
          style={{width: '100%'}}
          onError={handleErrorFile}
          onScan={handleScanFile}
          legacyMode
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Button className="btn-box-shawdow btn-color" type="primary" onClick={()=>{setScan(!scan)}}>Toogle Camera</Button>
        {
          !scan && <div onClick={()=>{setScan(!scan)}}>
            <img src="https://ads-cdn.fptplay.net/static/banner/2021/07/27_61003077b04a67000134c26d.png" style={{width: "100%", cursor: "pointer"}}/>
          </div>
        }
        { scan && (<QrReader
          delay={300}
          style={{width: '100%'}}
          onError={handleErrorWebCam}
          onScan={handleScanWebCam}
        />)}
      </Col>
    </Row>)}
  </>
}