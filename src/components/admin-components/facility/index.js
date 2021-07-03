import React, { useContext } from 'react';
import { FacilityType } from './facilitytype';
import { User } from '@pkg/reducers';
// import QrReader from 'react-qr-scanner';

// var QRCode = require('qrcode.react');

export const Facility = ({hotelId}) => {
  return <>
    <FacilityType hotelid={hotelId}/> 
  </>
}
