import React from 'react';
import { Row, Col, Avatar, Popover, Button } from 'antd';

var manager1 = {
  address: "75/8 Tan Lap, Dong Hoa, Di An Binh Duong",
  availableDayoffNumber: 12,
  baseSalary: 9000000,
  birthday: "1997-10-14T00:00:00.000Z",
  createdAt: "2021-05-31T13:33:38.986Z",
  department: "Manager",
  designation: "Manger",
  docStatus: "available",
  email: "quict@gmail.com",
  img: "http://res.cloudinary.com/hotellv/image/upload/v1622548244/yjsdtbhi2dtpbn1bw1av.jpg",
  name: "Qui Manager",
  password: "$2a$08$C0Kr69b8CEAd/pTRhhiyhOapi3qPue1ODttJwueWsBbZV7eAI7FCG",
  phone: "0353051289",
  remainingDayoffNumber: 12,
  shift: [],
  skills: ["Math", "English"],
  status: "available",
  type: "manager",
  updatedAt: "2021-07-12T14:34:20.958Z",
  __v: 0,
  _id: "60b4e5b2283927001537b1fa"
}

export const ManagerItem = (props) => {
  const { manager, edit = () => {}, setHotel = () => {} } = props;
  return <>
    <div className="manager-item" onClick={edit}>
      <div style={{display: 'flex',justifyContent: "center", width: '100%'}}>
        <img
          src={manager.img}
          alt=""
          style={{borderRadius: "50%",height: 150, width: 150, marginTop: 5}}
        />
        
      </div>
      <div style={{display: 'flex',justifyContent: "center"}}>
        <span>{manager.name}</span>
      </div>
      <div style={{display: 'flex',justifyContent: "center"}}>
        {/* <p style={{textAlign: 'center'}}>{manager.address}</p> */}
        {manager.address.length > 20? (<Popover key="0" content={manager.address}trigger="hover" style={{ width: '50%' }}>
						{manager.address.slice(0,20) + '...'}
					</Popover>) : manager.address
        }
      </div>
      <div style={{display: 'flex',justifyContent: "center"}}>
        {
          manager.hotel ? 
            <div>Hotel: {manager.hotel.name}</div> 
            : <Button type="primary" className="btn-box-shawdow btn-color" onClick={setHotel}>Set hotel</Button>
        }
      </div>
    </div>
  </>
}