import React, { useRef} from 'react';
import { Carousel, Row, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export const ImageCarousel = (props) => {
  var carousel = useRef(null);
  function onChange(a, b, c) {
    console.log(a, b, c);
  }
  const { img = [], autoplay = false } = props;
  const action = (action, event) => {
    event.stopPropagation();
    switch (action) {
      case 'next':
        carousel.next();
        return;
      case 'prev':
        carousel.next();
        return;
      default:
        return;
    }
    
  }
  return (
    <Row gutter={[16,16]}>
      <Col span={24} style={{position: 'relative'}}>
        <Carousel afterChange={onChange} ref={node => (carousel = node)} autoplay={autoplay}>
          {
            img.map((item, index) => <img src={item} alt="" key={index}/>)
          }
        </Carousel>
        <div className="carousel-button-prev">
          <Button icon={<LeftOutlined />} shape="circle" onClick={(event)=>action('next', event)}></Button>
        </div>
        <div className="carousel-button-next">
          <Button icon={<RightOutlined />} shape="circle" onClick={(event)=>action('prev', event)}></Button>
        </div>
      </Col>
    </Row>
  )
}