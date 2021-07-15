import React, {useReducer, useEffect, useContext, useState } from 'react';
import { User } from '@pkg/reducers';
import { filerColumn } from '../../commons';

import { Space, Button, Table, Modal, message, Form, DatePicker, Input, Select, InputNumber, Tabs, Tag } from 'antd';
import { PlusCircleOutlined, HighlightOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import { CustomUpload } from '../../commons';
import { _getRequest, postMethod, putMethod } from '@api';

const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const RoomReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
          return { ...state, data: action.data, data_room_type: action.data_room_type, facility: action.facility, behavior: 'stall' }
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


export const Room = ({hotelId}) => {
  const [loading,setLoading] = useState(false); 
  const [ state, dispatch ] = useReducer(RoomReducer, {
    behavior: 'init',
    data: [],
    data_room_type: [],
    facility: [],
    popup: {open: false, data: {}},
    roomType: {open: false, data: {}},
    view: {open: false}
  });

  const { data, popup, roomType, behavior, facility, data_room_type } = state;
  const [ form ] = Form.useForm();
  const [ rt_form ] = Form.useForm();

  const getData = async () => {
    try {
      const res_room = await _getRequest(`hotel/${hotelId}/room`);
      const res_roomtype = await _getRequest(`hotel/${hotelId}/roomtype`);
      const res_facility = await _getRequest(`/hotel/${hotelId}/facilitytype`);
      // const res = await _getRequest(`hotel/${_user.auth.hotel}/room`);
      if (!res_room.success) {
          message.error(res_room.error); // param = res.error
          return;
      }
      if (!res_roomtype.success) {
        message.error(res_roomtype.error); // param = res.error
        return;
      }
      if(!res_facility.success) {
        message.error(res_facility.error);
        return;
      }
      dispatch({type:'GET_DATA_SUCCESS', data: res_room.result.rooms, data_room_type: res_roomtype.result.roomTypes, facility: res_facility.result.facilititypes});
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
      dataIndex: 'status',
      align: 'center',
      key: 'status',  
      render: (text, record, index) => <Tag color={ record.status ===  'available' ?'green' : 'red'}>{record.status}</Tag>
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
      render: (text, record, index) => <span style={{paddingLeft: 10}}>
        {record.roomType.price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}{" "}
      </span>
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
        // style={{display: 'inline-block',marginLeft:4,borderRadius:'50%',background: 'white'}}
        size='small'
        type="primary" shape="circle" icon={<HighlightOutlined />}
        onClick={()=>{
            dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:r}})
            form.setFieldsValue({
              name: r.name,
              status: r.status,
              facilities: r.facilities.map(item=>({facility: item.facility.name, amount: item.amount})),
              roomType: r.roomType.name,
              price: r.roomType.price,
              capacity: r.roomType.capacity,
            });             
        }}
        ></Button>
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

  useEffect(()=>{
		dispatch({type: "RELOAD", popup: {open: false, data: {}}, roomType: {open: false, data: {}} });
	},[hotelId])

  const actionRoomtype = (values)=>{
    setLoading(true)
    if(state.roomType.data._id) {
      // update
      const update = async () => {
        const res = await putMethod('roomType', values, roomType.data._id);
        if(res.success) {
          setLoading(false);
          message.success('Update roomtype successfully!')
          dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
          rt_form.resetFields();
        } else {
          message.error(res.error);
          setLoading(false)
          return;
        }
      }
      update();
    } else {
      console.log('add roomtype');
      // add 
      const add = async () => {
        const res = await postMethod(`/hotel/${hotelId}/create-roomtype`, values);
        if(res.success) {
          setLoading(false);
          message.success('Add roomtype successfully!')
          dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
          rt_form.resetFields();
        } else {
          message.error(res.error);
          setLoading(false)
          return;
        }
      }
      add();
    }
  }
  const actionRoom = (v)=>{
    console.log(v)
    const room = async() => {
      const data = {
        name: v.name,
        roomType: v.roomType,
        status: v.status,
        facilities: v.facilities
      }
      if(popup.data.name) {
        // update -> update roomtype, room
        console.log('update: ',popup.data)
        const res = await putMethod('room',data, popup.data._id);
        if(res.success) {
          message.success('Update room successfully!');
          dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}}) 
          return;
        }
      } else {
        const add = async () => {
          const res = await postMethod(`hotel/${hotelId}/create-room`, data);
          if (res.success) {
            message.success('Create room sucessfully');
            dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}})
          } else {
            message.error(res.error);
            return;
          }
        }
        add();
      }
    }
    room();
  }

  return (<>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Room" key="1">
          <Button 
            type="primary" 
            shape="round" 
            icon={<PlusCircleOutlined/>}
            onClick={()=>{
              dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:{}}})
              form.resetFields();             
            }}
            >Add Room
          </Button>
          <Table 
            rowKey='_id'
            bordered
            // loading={data.length === 0}
            tableLayout="auto"
            title={() => 'Room'}
            dataSource={data} 
            columns={tCol} 
            style={{marginTop: 10}}
            expandable={
              {
                expandedRowRender: record => {
                  const col = [
                    {
                      title: 'Facility type',
                      align: 'center',
                      key: 'facilitytype',  
                      render: (text, r, index) => r.facility.type.name
                    },,
                    {
                      title: 'Name',
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
                    // title="Faclity"]
                    bordered
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Room type" key="2">
          <Button 
            type="primary" 
            shape="round" 
            icon={<PlusCircleOutlined/>}
            onClick={()=>{
              rt_form.resetFields();
              dispatch({type: 'TOOGLE_POPUP_ROOMTYPE', roomType: {open: true, data:{}}})
            }}
            >Add Room Type
          </Button>
          <Table
            rowKey='_id'
            bordered
            tableLayout="auto"
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
              render: (text, record, index) => <span style={{paddingLeft: 10}}>
                {record.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
              </span> 
            },{
              title: 'Edit',
              align: 'center',
              key: 'edit', 
              render: (text, record, index) => <Button type="primary" shape="circle" icon={<HighlightOutlined />}
                onClick={()=>{
                  rt_form.setFieldsValue({
                    name: record.name,
                    capacity: record.capacity,
                    price: record.price,
                  })
                  console.log(record)
                  dispatch({type: 'TOOGLE_POPUP_ROOMTYPE', roomType: {open: true, data:record}})
                }}
              ></Button>
            }
            ]}
            style={{marginTop: 10}}
          />
        </Tabs.TabPane>   
        {/* <Tabs.TabPane tab="History" key="3">
            History
        </Tabs.TabPane> */}
      </Tabs>
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
        footer={
          <div>
            <Button className="btn-box-shawdow" type='primary' onClick={()=>{
              form.submit();
            }} loading={loading}>Confirm</Button>
            <Button className="btn-box-shawdow" onClick={()=>{
              dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
              form.resetFields();
            }}>Close</Button>
          </div>
        }
        onOk={()=>{form.submit()}}
        onCancel={() => {
            dispatch({type: 'TOOGLE_POPUP', popup: {open:false, data:{}}})
            form.resetFields();
        }} 
      >
        {/* {JSON.stringify(popup.data)} */}
        <Form
          {...layout} 
          form={form} name="room-form"
          onFinish={actionRoom}
        >
          <Form.Item name='name' label="Name">
            <Input placeholder="Name"/>
          </Form.Item>
          <Form.Item name='roomType' label="Room Type">
            <Select 
              placeholder="Please choose room type of hotel"
              options={data_room_type.map(item => ({label: item.name, value:item.name}))}
            />
             {/* <Input /> */}
          </Form.Item>
          <Form.Item name='status' label="Status">
            <Select 
              placeholder="Select a status"
              options={[{label: 'Available', value: 'available'}, {label: 'Unavailable', value: 'unavailable'}]}
            />
          </Form.Item>
          { popup.data.name && (<Form.Item name='price' label="Price">
            <InputNumber 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: '100%'}}
              placeholder="Capacity of room type"
              disabled
            />
          </Form.Item>
          )}
          { popup.data.name && (<Form.Item name='capacity' label="Capacity">
            <InputNumber 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: '100%'}}
              placeholder="Capacity of room type"
              disabled
            />
          </Form.Item>
          )}
          <Form.Item
            label="Facility"
          >
              <Form.List 
                name='facilities'
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', justifyContent: 'space-between'}} size={'small'} className="room-facility">
                        <Form.Item
                          {...restField}
                          name={[name, 'facility']}
                          fieldKey={[fieldKey, 'facility']}
                          rules={[{ required: true, message: 'Missing facility' }]}
                          className="facility-item"
                        >
                          <Select 
                            placeholder="Select facility" 
                            options={state.facility ? state.facility.reduce((cur,next)=>{
                              var t = next.facilities.reduce((c,n)=>[...c,n],[])
                              return [...cur,...t]
                              },[])
                              .map(item => ({label: item.type.name + " - " + item.name, value: item.name})) : []
                            }
                            allowClear
                            showSearch
                            filterOption={(inputValue, options) => {
                              return options.label.toLowerCase().includes(inputValue.toLowerCase())
                            }}
                            notFoundContent={'Not found item'}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          fieldKey={[fieldKey, 'amount']}
                          rules={[{ required: true, message: 'Missing amount' }]}
                        >
                          <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{width: '100%'}}
                            placeholder="Amount facility"
                          />
                        </Form.Item>
                        <Form.Item><MinusCircleOutlined onClick={() => remove(name)} /></Form.Item>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add attribute
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        centered
        closable={false}
        maskClosable={false}
        title= {roomType.data._id ? 'Update Room Type' : 'Add Room Type'}
        key='modal_roomtype'
        width='70%' 
        visible={roomType.open}
        forceRender
        keyboard
        footer={
          <div>
            <Button className="btn-box-shawdow" type='primary' onClick={()=>{
              rt_form.submit();
              // dispatch({type: 'RELOAD', popup:{open:false, data:{}}, roomType: {open:false, data:{}}} )
            }} loading={loading}>Confirm</Button>
            <Button className="btn-box-shawdow" onClick={()=>{
              setLoading(false);
              dispatch({type: 'TOOGLE_POPUP_ROOMTYPE', roomType: {open:false, data:{}}})
              rt_form.resetFields();
            }}>Close</Button>
          </div>
        }
        onOk={()=>{
            
          }
        }
        cancelText='Close'
        onCancel={() => {
            // roomType.resetFields();
        }} 
      >
        <Form 
          {...layout}
          form={rt_form} name="roomtype-form"
          onFinish={actionRoomtype}
        >
          <Form.Item name='name' label="Name"
            rules={[
            {
              required: true,
              message: 'Please input name of room type!',
            }]}
          >
            <Input placeholder="Name of room type"/>
          </Form.Item>
          <Form.Item name='capacity' label="Capacity"
            rules={[
            {
              required: true,
              message: 'Please input capacity of room type!',
            }]}
          >
            <InputNumber 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: '100%'}}
              placeholder="Capacity of room type"
            />
          </Form.Item>
          <Form.Item name='price' label="Price"
            rules={[
            {
              required: true,
              message: 'Please input price of room type!',
            }]}
          >
            <InputNumber 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{width: '100%'}}
              placeholder="Price of room type"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}