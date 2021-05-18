import React, {useState, useRef, useEffect} from 'react';
import QRCode from 'qrcode';
import { _getRequest } from '@api';
import QrReader from 'react-qr-reader';
import './attendance.style.css';
import { Button, Row, Col, message } from 'antd';
import axios from 'axios';
export const Attendance = props => {
  const [scanResultFile, setScanResultFile] = useState('');
  const [ scan, setScan ] = useState(true);
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
          // post api attendance
          message.success('co shift id roi');
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

    <Row gutter={[16,16]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Button className="btn" type="primary" onClick={onScanFile}>Scan Qr Code</Button>
        <QrReader
          ref={qrRef}
          delay={300}
          style={{width: '100%'}}
          onError={handleErrorFile}
          onScan={handleScanFile}
          legacyMode
        />
        <h3>Scanned Code: {scanResultFile}</h3>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <h3>Qr Code Scan by camera</h3>
        { scan && (<QrReader
          delay={300}
          style={{width: '100%'}}
          onError={handleErrorWebCam}
          onScan={handleScanWebCam}
        />)}
      </Col>
    </Row>
  </>
}