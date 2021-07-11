import React, {useReducer, useEffect, useContext } from 'react';
import { Button, Space, Modal, Table, Form, Input, InputNumber,  DatePicker, Row, Col, Drawer, Tabs } from 'antd';
import { User } from '@pkg/reducers';
import { CheckCircleTwoTone, NodeExpandOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { _getRequest, postMethod } from '../../../pkg/api';
import moment from 'moment';
import { messageError, messageSuccess } from '../../commons';
import { RoomItem } from '../../commons/room-item';
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { TabPane } = Tabs;

function disabledDate(current) {
  return current && current < moment().startOf('day');
}

const BookingReducer = (state, action) => {
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
          return { ...state, booking: action.booking, room: action.room, behavior: 'stall' }
      case 'GET_DATA_ERROR':
          return { ...state, data: [], behavior: 'stall' };
      case 'TOOGLE_POPUP':
        return { ...state, popup: action.popup, behavior: 'stall'};
      case 'RELOAD':
        return { ...state, popup: action.popup, behavior: 'init'};  
      default:
          return state;
  } 
}

export const Booking = props => {
  const [ state, dispatch ] = useReducer(BookingReducer, {
    behavior: 'init',
    booking: [],
    room: [],
    popup: {open: false, data: {}},
  });
  const [ user ] = useContext(User.context);
  const [ form ] = Form.useForm();
  const tCol = [
    {
      title: 'Customer',
      align: 'center',
      key: 'customer',
      render: (text, record, index) => {
        if(record.name) {
          return `${record.name} (guest)`;
        } else {
          return record.customer.email
        }
      }
    },
    {
      title: 'Room',
      align: 'center',
      key: 'room',
      render: (text, record, index) => record.room.name
    },
    {
      title: 'Roomtype',
      align: 'center',
      key: 'roomtype',
      render: (text, record, index) => record.room.roomType.name
    },
    {
      title: 'Start date',
      dataIndex: 'bookingStart',
      align: 'center',
      key: 'bookingStart',
      render: (text, record, index) => moment(record.bookingStart, "YYYY-MM-DD").format("DD-MM-YYYY")
    },
    {
      title: 'End date',
      dataIndex: 'bookingEnd',
      align: 'center',
      key: 'bookingEnd',
      render: (text, record, index) => moment(record.bookingEnd, "YYYY-MM-DD").format("DD-MM-YYYY")
    },
    {
      title: 'Total',
      dataIndex: 'totalMoney',
      align: 'center',
      key: 'totalMoney',
      render: (text, record, index) => <span>
        { record.totalMoney.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}{" "}
      </span>
    },
    {
      title: 'Payment',
      dataIndex: 'isPaid',
      align: 'center',
      key: 'isPaid',
      render: (text, record, index) => <Button 
        size='small'
        shape="circle" icon={record.isPaid ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <NodeExpandOutlined />}
        onClick={()=>{
          if(record.isPaid){
            return;
          } 
          confirm(record);
        }}
      ></Button>
    },
  ];

  const getData = async () => {
    const res_booking = await _getRequest(`hotel/${user.auth.hotel}/booking`);
    const res_room = await _getRequest(`hotel/${user.auth.hotel}/room`);
    if(res_booking.success && res_room.success) {
      console.log(res_room.result, res_booking.result)
      dispatch({type: 'GET_DATA_SUCCESS', booking: res_booking.result.bookings, room: res_room.result.rooms})
    } else {
      messageError(res_room.error || res_booking.error);
    }
  }

  useEffect(() => {
    switch (state.behavior) {
      case 'init':
        getData();
        return;
      case 'stall':
        return ;
      default:
        break;
    }
  }, [state.behavior])

  const createBooking = values => {
    console.log(values)
    console.log(values.date[0].format("DD MM YYYY"))
    const data = {
      room: state.popup.data._id,
      name: values.name ? values.name : "guest",
      bookingStart: values.date[0].format('DD-MM-YYYY HH:mm'),
      bookingEnd: values.date[1].format('DD-MM-YYYY HH:mm'),
      totalMoney: values.totalMoney
    }
    const post = async () => {
      const res = await postMethod(`booking/create`, data);
      if(res.success){
        messageSuccess("Create booking successfully!");
        dispatch({type: 'RELOAD', popup: {open: false, data: {}}})
      } else messageError(res.error);
    }
    post();
  }
  const popupBooking = (room) =>{
    dispatch({type: 'TOOGLE_POPUP', popup: {open:true, data:room}})
  }

  const payment = (record) => {
    const action = async()=>{
      const res = await postMethod(`booking/${record._id}/payment`);
      if(res.success) {
        messageSuccess('Payment successfully');
        dispatch({type: 'RELOAD', popup: {open: false, data: {}}})
      }
    }
    action();
  }
  function confirm(record) {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Please confirm payment last time!',
      okText: 'Payment',
      cancelText: 'Cancel',
      onOk: ()=>payment(record)
    });
  }
  useEffect(()=>{
    if(state.popup.open) {
      form.setFieldsValue({
        room: state.popup.data.name,
        totalMoney: state.popup.data.roomType.price
      })
    } else {
      form.resetFields();
    }
  },[state.popup])

  console.log(state.popup);
  return <>
    <h1>List Room</h1>
    <Row gutter={[16,16]}>
      {
        state.room.map((item, index) => {
          return <Col xs={24} sm={12} md={6} key={index}>
            <RoomItem room={item} action={popupBooking}/>
          </Col>
        })
      }
    </Row>
    <Table 
      rowKey='_id'
      title={() => 'Booking'}
      dataSource={state.booking} 
      columns={tCol} 
    />
    <Drawer
      placement={'right'}
      closable={false}
      onClose={()=>{
        dispatch({type: "TOOGLE_POPUP", popup: {open: false, data: {}}});
      }}
      visible={state.popup.open}
      width={'500px'}
      // height={"100%"}
      key={'create-booking'}
    >
      <div onClick={()=>{dispatch({type: "TOOGLE_POPUP", popup: {open: false, data: {}}});}}>
        <img src="https://ads-cdn.fptplay.net/static/banner/2021/06/d13c063446db6193273024ece6946b22_3978.png" alt='back' style={{maxWidth: 40, cursor: 'pointer'}}/>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Create booking" key="1">
          <Form
            form={form}
            {...layout} 
            name="createBooking"
            onFinish={createBooking}
          >
            <Form.Item
              label="Room" name="room"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="Name" name="name"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date" name="date"
              rules={[{ required: true, message: 'Please select date!' }]}
            >
              <RangePicker disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.date !== curValues.date} noStyle>
              {() => {
                var _d = form.getFieldValue("date");
                if(_d && state.popup.open) {
                  var _r = _d[1].diff(_d[0], 'days');
                  form.setFieldsValue({
                    totalMoney: _r*state.popup.data.roomType.price
                  }) 
                }
                return (
                  <Form.Item name="totalMoney" label="Total">
                    <CustomInput 
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{width: "80%"}}
                      disabled
                    />
                    {/* <Input disabled/> */}
                  </Form.Item>
                );
              }}
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" shape="round">
                Create
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Booking" key="2">
          <Table 
            rowKey='_id'
            title={() => 'List Booking'}
            dataSource={state.popup.data.bookings ? state.popup.data.bookings : []} 
            columns={[
              {
                title: 'Customer',
                align: 'center',
                key: 'customer',
                render: (text, record, index) => {
                  if(record.name) {
                    return `${record.name} (guest)`;
                  } else {
                    return record.customer.email
                  }
                }
              },
              {
                title: 'Start date',
                dataIndex: 'bookingStart',
                align: 'center',
                key: 'bookingStart',
                render: (text, record, index) => moment(record.bookingStart).format("DD-MM-YYYY")
              },
              {
                title: 'End date',
                dataIndex: 'bookingEnd',
                align: 'center',
                key: 'bookingEnd',
                render: (text, record, index) => moment(record.bookingEnd).format("DD-MM-YYYY")
              },
              {
                title: 'Total',
                dataIndex: 'totalMoney',
                align: 'center',
                key: 'totalMoney',
                render: (text, record, index) => <span>
                  { record.totalMoney.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </span>
              }
            ]} 
          />
        </TabPane>
       </Tabs>
      
    </Drawer>
  </>
}


const CustomInput = (props) => {
  return <>
    <InputNumber {...props}/>
    <span>VND</span>
  </>
}