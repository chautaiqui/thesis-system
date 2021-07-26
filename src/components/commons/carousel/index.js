import React, { useRef} from 'react';
import { Carousel, Row, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

export const ImageCarousel = (props) => {
  var carousel = useRef(null);
  const { img = [], autoplay = false } = props;
  const [ display, setDisplay ] = useState("none");
  const action = (action, event) => {
    event.stopPropagation();
    switch (action) {
      case 'next':
        carousel.next();
        return;
      case 'prev':
        carousel.prev();
        return;
      default:
        return;
    }
    
  }
  function MouseEvent(event) {
    setDisplay(event ? 'block' : 'none');
  }
  return (
    <Row gutter={[16,16]} onMouseOver={()=>MouseEvent(true)} onMouseOut={()=>MouseEvent(false)}>
      <Col span={24} style={{position: 'relative'}}>
        <Carousel ref={node => (carousel = node)} autoplay={autoplay}>
          {
            img.map((item, index) => <img src={item} alt="" key={index}/>)
          }
        </Carousel>
        <div className="carousel-button-prev" style={{ display: display}}>
          <Button icon={<LeftOutlined />} shape="circle" onClick={(event)=>action('prev', event)}></Button>
        </div>
        <div className="carousel-button-next" style={{ display: display}}>
          <Button icon={<RightOutlined />} shape="circle" onClick={(event)=>action('next', event)}></Button>
        </div>
      </Col>
    </Row>
  )
}