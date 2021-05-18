import React, { useState, useContext } from 'react';
import { Row, Col } from 'antd';
import { FacilityType } from './facilitytype';
import { User } from '@pkg/reducers';
// import QrReader from 'react-qr-scanner';

// var QRCode = require('qrcode.react');

export const Facility = props => {
  const [ _user ] = useContext(User.context); 
  // const [ data, setData ] = useState({deplay: 100, result: 'No result'});
  
  // const handleScan = (d) => {
  //   setData({...data, result: d});
  // }
  // const handleError = (err) => {
  //   console.error(err)
  // }
  // const previewStyle = {
  //   height: 240,
  //   width: 320,
  // }
  return <>
    <Row gutter={[16,16]}>
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <FacilityType hotelid={_user.auth.hotel}/> 
    </Col>
    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
    </Col>
    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
    </Col>
    </Row>
  </>
}
