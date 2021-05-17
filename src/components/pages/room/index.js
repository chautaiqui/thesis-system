import React, {useReducer, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { _getRequest, _putRequest } from '@api';
import { filerColumn } from '../../commons';
import axios from 'axios';

import { Space, Button, Table, Modal, message, Form, DatePicker, Input, Select, InputNumber } from 'antd';
import { PlusCircleOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomUpload } from '../../commons';

const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const RoomReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
          return { ...state, data: action.data, data_room_type: action.data_room_type, behavior: 'stall' }
      case 'GET_DATA_ERROR':
          return { ...state, data: [], behavior: 'stall' };
      case 'TOOGLE_POPUP':
          return { ...state, popup: action.popup, behavior: 'stall' };
      case 'TOOGLE_POPUP_ROOMTYPE':
        return { ...state, roomType: action.roomType, behavior: 'stall' };
      case 'TOOGLE_VIEW':
          return { ...state, view: action.view, behavior: 'stall' };
      case 'RELOAD':
          return { ...state, behavior: 'init', popup: action.popup, roomType: action.roomType };
      default:
          return state;
  } 
}


export const Room = props => {
  const [ _user ] = useContext(User.context);
  
  const [ state, dispatch ]= useReducer(RoomReducer, {
    behavior: 'init',
    data: [],
    data_room_type: [],
    popup: {open: false, data: {}},
    roomType: {open: false, data: {}},
    view: {open: false}
  });

  const { data, popup, roomType, behavior, view, data_room_type } = state;
  const [ form ] = Form.useForm();
  const [ rt_form ] = Form.useForm();

  const getData = async () => {
    try {
      const res_room = await _getRequest(`hotel/${_user.auth.hotel}/room`);
      const res_roomtype = await _getRequest(`hotel/${_user.auth.hotel}/roomtype`);
      // const res = await _getRequest(`hotel/${_user.auth.hotel}/room`);
      if (!res_room.success) {
          message.error(res_room.error); // param = res.error
      }
      if (!res_roomtype.success) {
        message.error(res_roomtype.error); // param = res.error
      }
      dispatch({type:'GET_DATA_SUCCESS', data: res_room.result.rooms, data_room_type: res_roomtype.result});
    } catch (e) {
        message.error(e);
    }
  }

  var tCol = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      ...filerColumn([], 'name'),
      onFilter: (value, record) =>
          record.name
              ? record.name.toString().toLowerCase().includes(value.toLowerCase())
              : '',
    }, 
    {
      title: 'Status',
      dataIndex: 'docStatus',
      align: 'center',
      key: 'docStatus',  
    },
    {
      title: 'Room type',
      dataIndex: 'roomType',
      align: 'center',
      key: 'roomtype',  
      render: (text, record, index) => record.roomType.name
    },
    {
      title: 'Price',
      dataIndex: 'roomType',
      align: 'center',
      key: 'price',  
      render: (text, record, index) => record.roomType.price
    },
    {
      title: 'Capacity',
      dataIndex: 'roomType',
      align: 'center',
      key: 'capacity',  
      render: (text, record, index) => record.roomType.capacity
    }, 
    {
      title: 'Update',
      align: 'center',
      key: 'update',
      render: (t,r,i) => <Button
        style={{display: 'inline-block',marginLeft:4,borderRadius:'50%',background: 'white'}}
        size='small'
        onClick={()=>{
            dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:r}})
            form.setFieldsValue({
              name: r.name,
              status: r.status,
              roomType: r.roomType.name,
              price: r.roomType.price,
              capacity: r.roomType.capacity,

            });             
            console.log(r)
        }}
        ><EditOutlined /></Button>
    }
  ]

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

  console.log(state)

  return (<>
      <Space>
        <Button 
          type="primary" 
          shape="round" 
          icon={<PlusCircleOutlined/>}
          onClick={()=>{
            dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:{}}})
            form.setFieldsValue({});             
          }}
          >Add Room
        </Button>
        <Button 
          type="primary" 
          shape="round" 
          icon={<PlusCircleOutlined/>}
          onClick={()=>{
            dispatch({type: 'TOOGLE_POPUP_ROOMTYPE', roomType: {open: true, data:{}}})
            // rt_form.setFieldsValue({});             
          }}
          >Add Room Type
        </Button>
      </Space>
      <Table 
        rowKey='_id'
        // loading={data.length === 0}
        title={() => 'Room'}
        dataSource={data} 
        columns={tCol} 
        style={{marginTop: 10}}
        expandable={
          {
            expandedRowRender: record => {
              const col = [
                {
                  title: 'Name',
                  dataIndex: 'facility',
                  align: 'center',
                  key: 'name',  
                  render: (text, r, index) => r.facility.name
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  align: 'center',
                  key: 'amount',  
                }
              ]
              return <Table 
                // title="Faclity"
                rowKey="_id"
                dataSource={record.facilities}
                columns={col}
                pagination={false}
              />
              // return JSON.stringify(record.facilities[0])
            }
          }
        }
      />
      <Table
        rowKey='_id'
        title={() => 'Room Type'}
        dataSource={data_room_type}
        columns={[{
          title: 'Name',
          dataIndex: 'name',
          align: 'center',
          key: 'name', 
        }, {
          title: 'Capacity',
          dataIndex: 'capacity',
          align: 'center',
          key: 'capacity', 
        }, {
          title: 'Price',
          dataIndex: 'price',
          align: 'center',
          key: 'price', 
        }]}
        style={{marginTop: 10}}
      />
      <Modal 
        centered
        closable={false}
        maskClosable={false}
        title= {'Room'}
        key='modal_update'
        width='70%' 
        visible={popup.open}
        forceRender
        keyboard
        okText={'Confirm'}
        onOk={()=>{form.submit()}}
        cancelText='Close'
        onCancel={() => {
            dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
            form.resetFields();
        }} 
      >
        {/* {JSON.stringify(popup.data)} */}
        <Form
          {...layout} 
          form={form} name="room-form"
          onFinish={(v)=>{
            console.log(v)
            var myHeaders = new Headers(); 
            myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
            const room = async() => {
              const data = {
                name: v.name,
                roomType: v.roomType,
                status: v.status
              }
              if(popup.data.name) {
                // update
                console.log('update: ',popup.data)
                var newRoomType = {
                  name: v.roomType,
                  capacity: v.capacity,
                  price: v.price
                }
                try {
                  console.log(data_room_type);
                  const nameRoomType = data_room_type.map(item => item.name);
                  if(!nameRoomType.includes(v.roomType)){
                    const res = await axios.put(`https://hotel-lv.herokuapp.com/api/roomtype/${popup.data.roomType._id}`, newRoomType, {headers: myHeaders})
                    var newRoom = {
                      name: v.name,
                      roomType: res.data.roomType,
                      status: v.status
                    }
                    const res_2 = await axios.put(`https://hotel-lv.herokuapp.com/api/room/${popup.data._id}`, newRoom,{headers: myHeaders})
                    message.success('Create room sucessfully')
                    dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}}) 
                    console.log('khac')
                  } else {
                    console.log('da co')
                    var newRoom = {
                      name: v.name,
                      roomType: v.roomType,
                      status: v.status
                    }
                    const res_2 = await axios.put(`https://hotel-lv.herokuapp.com/api/room/${popup.data._id}`, newRoom,{headers: myHeaders})
                    console.log(res_2)
                    message.success('Create room sucessfully')
                    dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
                  }
                } catch (error) {
                  message.error( error.response.data.message ||"Some field well wrong");
                }
              } else {
                // create
                axios.post("https://hotel-lv.herokuapp.com/api/hotel/60a210c1f09c8100155c4ef7/create-room", data, {headers: myHeaders})
                .then(res => { // then print response status
                  console.log(res)
                  message.success('Create room sucessfully')
                  dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
                })
              }
            }
            room();
          }}
        >
          <Form.Item name='name' label="Name">
            <Input />
          </Form.Item>
          <Form.Item name='roomType' label="Room Type">
            {/* <Select 
              placeholder="Please choose room type of hotel"
              options={data_room_type.map(item => ({label: item.name, value:item.name}))}
            /> */}
             <Input />
          </Form.Item>
          <Form.Item name='status' label="Status">
            <Select 
              placeholder="Select a status"
              options={[{label: 'Available', value: 'available'}, {label: 'Unavailable', value: 'unavailable'}]}
            />
          </Form.Item>
          { popup.data.name && (<Form.Item name='price' label="Price">
            <Input />
          </Form.Item>
          )}
          { popup.data.name && (<Form.Item name='capacity' label="Capacity">
            <Input />
          </Form.Item>
          )}
          {/* <Form.Item
            name='file'
            getValueFromEvent={value => {
              return value;
            }}
          >
            <CustomUpload />
          </Form.Item> */}
          {/* <Form.Item name='time'>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item> */}
          {/* <Form.Item >
            <Button type='primary' htmlType="submit">Submit</Button>
          </Form.Item>   */}
        </Form>
      </Modal>
      <Modal 
        centered
        closable={false}
        maskClosable={false}
        title= {'Room Type'}
        key='modal_roomtype'
        width='70%' 
        visible={roomType.open}
        forceRender
        keyboard
        okText={'Confirm'}
        onOk={()=>{
            rt_form.submit()
            dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
          }
        }
        cancelText='Close'
        onCancel={() => {
            dispatch({type: 'TOOGLE_POPUP_ROOMTYPE', roomType: {open:false, data:{}}})
            // roomType.resetFields();
        }} 
      >
        <Form 
          {...layout}
          form={rt_form} name="roomtype-form"
          onFinish={(v)=>{
            console.log(v, typeof v.price)
            var myHeaders = new Headers(); 
            myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
            axios.post("https://hotel-lv.herokuapp.com/api/hotel/60a210c1f09c8100155c4ef7/create-roomtype", v, {headers: myHeaders})
              .then(res => { // then print response status
                console.log(res)
                message.success("Create room type succesfullly!")
              })
            
          }}
        >
          <Form.Item name='name' label="Name"
            rules={[
            {
              required: true,
              message: 'Please input name of room type!',
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='capacity' label="Capacity"
            rules={[
            {
              required: true,
              message: 'Please input capacity of room type!',
            }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name='price' label="Price"
            rules={[
            {
              required: true,
              message: 'Please input price of room type!',
            }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
  
}