import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { _getRequest } from '../../../pkg/api';
import { SelectHotel } from '../../commons/select-hotel';
import { Voucher } from '../../admin-components/voucher';
export const AdminVoucher = props => {
	const [ user, dispatchUser ] = useContext(User.context);
  const [ hotel, setHotel ] = useState({});

  const selectedHotel = (hotel) => {
    setHotel(hotel);
  }
  useEffect(()=>{
    if(!hotel) return;
    dispatchUser({
      type: "UPDATE", user: { hotel: hotel._id}
    })
  }, [hotel])
  return <>
    <SelectHotel selectedHotel={selectedHotel}/>
    <div className="hotel-selected-admin">
      { hotel._id && (<Voucher hotelId={hotel._id}/>)}
    </div>
    
  </>
}