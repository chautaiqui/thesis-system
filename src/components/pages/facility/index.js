import React, { useState, useContext } from 'react';
import { Row, Col } from 'antd';
import { FacilityType } from './facilitytype';
import { User } from '@pkg/reducers';
// import QrReader from 'react-qr-scanner';

// var QRCode = require('qrcode.react');

export const Facility = props => {
  const [ _user ] = useContext(User.context); 
  return <>
    <FacilityType hotelid={_user.auth.hotel}/> 
  </>
}
