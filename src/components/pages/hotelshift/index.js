import React, { useState } from 'react';
import { DatePicker, Row, Col, Button, Drawer, Form, Input, InputNumber, Tabs, Modal } from 'antd';
import { Shift } from '../../commons/shift';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const { TabPane } = Tabs;

export const HotelShift = props => {
  const [ popup, setPopup ] = useState(false);
  const [ shift, setShift ] = useState({open: false, data: {}});
  const [ data, setData ] = useState([]);
  const [ form ] = Form.useForm();
  const onFinish = values => {
    console.log(values);
    var _d = { ...values, col: values.col.format("DD-MM-YYYY"), click: function(open, data){ setShift({open: open, data: data})}};
    setData([...data, _d]);
  }
  console.log('shift: ', shift)
  return ( 
    <>
      <Row gutter={16,16} >
        <Col span={24}>
          <Button onClick={()=>setPopup(true)}> Add shift</Button>
        </Col>
        <Col span={19}>
          <Shift data={data}/>
        </Col>
        <Col span={5}>
          Employee shift
        </Col>
      </Row>
      <Drawer
        title="Shift"
        placement={'left'}
        width="50%"
        closable={false}
        onClose={()=>setPopup(false)}
        visible={popup}
        key={'left'}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Create shift" key="1">
            <Form
              form={form}
              name="form-shift"
              className="form-shift"
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item 
                name="content" label="Name"
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name="col" label="Date"
              >
                <DatePicker />
              </Form.Item>
              <Form.Item 
                name="timeIn" label="timeIn"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item 
                name="timeOut" label="timeOut"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" shape="round">
                  Create shift
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="List shift" key="2">
            Content of Tab Pane 2
          </TabPane>

        </Tabs>
      </Drawer>
      <Modal title={shift.data.content ? shift.data.content : "Shift"} visible={shift.open} onOk={()=>{}} onCancel={()=>setShift({open: false, data: {}})}>
        { shift.data.content && (
          <p>{shift.data.content}</p>
        )}
      </Modal>
    </>
  )  
};

class Render{
  
}