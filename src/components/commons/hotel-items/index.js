import React from 'react';
import { Row, Col, Rate } from 'antd';
import { ImageCarousel } from '../carousel';

const defaulfHotel = {
  imgs: [
    'https://ads-cdn.fptplay.net/static/banner/2021/07/16_60f071e55140f700012e53ec.jpeg'
  ]
 
}

export const HotelItems = (props) => {
  const { hotel, editHotel = () => {} } = props;
  return <Row gutter={[16,16]} style={{margin: "5px 0px 5px", background: "#fff", borderRadius: 10}} onClick={editHotel}>
    <Col span={12}>
      <ImageCarousel img={hotel.imgs.length !== 0 ? hotel.imgs : defaulfHotel.imgs}/>
    </Col>
    <Col span={12}>
      <Row gutter={[16,0]}>
        <Col span={24}>
          <h1>
            {hotel.name}
          </h1>
        </Col>
        <Col span={24}>
          <span>{hotel.address}</span>
        </Col>
        <Col span={24}>
          <Rate value={hotel.rated.avgValue} disabled/>
        </Col>
        <Col span={24}>
          <span>
            Price: {hotel.averagePrice.avgValue.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}{" "}
          </span>
        </Col>
      </Row>
    </Col>
  </Row>
}