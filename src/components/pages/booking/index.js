import React, {useReducer, useEffect} from 'react';
import { Button, Space, Modal, Table, Form, Input, DatePicker } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const BookingReducer = (state, action) => {
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
          return { ...state, data: action.data,behavior: 'stall' }
      case 'GET_DATA_ERROR':
          return { ...state, data: [], behavior: 'stall' };
      case 'TOOGLE_POPUP':
        return { ...state, popup: action.popup, behavior: 'stall'};
      default:
          return state;
  } 
}

export const Booking = props => {
  const [ state, dispatch ] = useReducer(BookingReducer, {
    behavior: 'init',
    data: [],
    data_room_type: [],
    popup: {open: false, data: {}},
  });
  const [ form ] = Form.useForm();
  const getData = async () => {
    // try {
    //   //
    //   const res = await getRequest('...') ;
    //   if (!res.success) {
    //     message.error(res.error); // param = res.error
    //   }
    //   dispatch({type:'GET_DATA_SUCCESS', data: [12,3,2]});
    // } catch (e) {
    //     message.error(e);
    // }
    dispatch({type:'GET_DATA_SUCCESS', data: [12,3,2]});
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

  const onFinish = values => {
    console.log(values)
  }
  return <>
    <Space>
      <Button 
        type="primary" 
        shape="round" 
        icon={<PlusCircleOutlined/>}
        onClick={()=>{
          dispatch({type: 'TOOGLE_POPUP', popup: {open:true, data:{}}})
        }}
        >Create Booking
      </Button>
    </Space>
    <Table 
    
    />
    <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'Booking'}
      key='bookings'
      width='70%' 
      visible={state.popup.open}
      forceRender
      keyboard
      okText={'Confirm'}
      onOk={()=>{form.submit()}}
      cancelText='Close'
      onCancel={() => {
        dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
          // form.resetFields();
      }} 
    >
      <Form
        {...layout} 
        form={form} name="booking-form"
        onFinish={onFinish}
      >
        <Form.Item name='room' label="Room"
          rules={[
          {
            required: true,
            message: 'Please choose room',
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='customer' label="Customer"
          rules={[
          {
            required: true,
            message: 'Please input customer',
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="start-end" label="Date"
          rules={[{ type: 'array', required: true, message: 'Please select date!'}]}
        >
          <RangePicker 
            disabledDate={
              (current) => {return current && current < moment().startOf('day');}
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  </>
}