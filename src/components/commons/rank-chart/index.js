import React from 'react';
import { List, Avatar, Button, Skeleton, Row, Col } from 'antd';

const number = [
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a1c377de060001c63a8e.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a1fb77de06000137a540.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a21377de06000111d6ac.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a23177de060001295c2b.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a24077de060001157d6f.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a25877de06000111fad3.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a26777de060001196e9a.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a27d77de06000164321e.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a28a77de0600017aed94.png",
  "https://ads-cdn.fptplay.net/static/banner/2021/07/07_60e4a29a77de06000136a8e6.png"
]
const _style={
  width: "100%",
  borderRadius: 5,
  // marginTop: 20,
  // marginBottom: 20,
  padding: 5,
  // border: "1px solid #DDDDDD",
  // boxShadow: "0px 6px 16px rgb(0 0 0 / 12%)"
};
const rank = (index) => number[index];
export const RankChart = (props) => {
  const { data } = props;
  console.log(data)
  return <div>
    <h1 style={{textAlign: 'center'}}>Top Rank User</h1>
    {/* <List
      className="top-rank-user"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item className="item-top-rank-user">
          <List.Item.Meta
            title={
              <div>
               <Avatar src={item.customerImg[0]} />
                <span style={{marginLeft: 5}}>{item.customerName[0]}</span>
              </div>
            }
            avatar={
              <img src={rank(index)} style={{maxWidth: 30}}/>
            }
          />
          <span>
            {item.totalMoney.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}{" "}
          </span>
        </List.Item>
    )}
    /> */}
    <Row 
      style={{
        borderBottom: "1px solid"
    }}>
      <Col span={4} style={{textAlign: 'center'}}>
        <span style={{
          color: "#000",
          fontWeight: 700
        }}>Rank</span>
      </Col>
      <Col span={4} style={{textAlign: 'center'}}>
      </Col>
      <Col span={8} style={{textAlign: 'center'}}><span style={{
          color: "#000",
          fontWeight: 700
        }}>User</span></Col>
      <Col span={8} style={{textAlign: 'center'}}>
        <span style={{
          color: "#000",
          fontWeight: 700
        }}>Total</span>
      </Col>
    </Row>
    {
      data.map((item, index)=> {
        return <Row style={_style}>
          <Col span={4} style={{textAlign: 'center'}}>
            <img src={rank(index)} style={{maxWidth: 30}}/>
          </Col>
          <Col span={4} style={{textAlign: 'center'}}>
            <Avatar src={item.customerImg[0]} />
          </Col>
          <Col span={8} style={{overflow: "hidden", textOverflow: "ellipsis"}}>{item.customerName[0]}</Col>
          <Col span={8} style={{textAlign: 'center'}}>
            {item.totalMoney.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </Col>
        </Row>
      })
    }
  </div>
}