import React, { useReducer, useEffect } from 'react';
import { Input, List, message, Button, Form, Modal, Row, Col, Table, Select } from 'antd';
import { HighlightOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { _getRequest } from '@api';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FacilityReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
      case 'GET_DATA_SUCCESS':
          return { ...state, data: action.data, behavior: 'stall' }
      case 'RELOAD':
          return { ...state, behavior: 'init'};
      case 'TOOGLE_POPUP': 
        return { ...state, facility: action.facility, behavior: action.behavior}
        case 'TOOGLE_POPUP_FACILITY': 
        return { ...state, facs: action.facs, behavior: action.behavior}
      default:
          return state;
  } 
}

export const FacilityType = props => {
  const { hotelid } = props;
  const [ form ] = Form.useForm();
  const [ form_update ] = Form.useForm();
  const [ form_facility ] = Form.useForm();
  const [ state, dispatch ] = useReducer(FacilityReducer, { data: [], facility: {open:false, data:{}}, behavior: 'init', facs: {open:false, data:{}}})
  const add = async(name) => {
    try {
      var myHeaders = new Headers(); 
      myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
      const res = await axios.post(`https://hotel-lv.herokuapp.com/api/hotel/${hotelid}/create-facilitytype`, 
        {
          name: name
        }, {headers: myHeaders})
      console.log(res);
      message.success("Create new facility type")
      form.resetFields();
      dispatch({type:'RELOAD'});
    } catch (error) {
      message.error(error.response)
    } 
  }
  const getData = async () => {
    console.log('3')
    try {
      const res = await _getRequest(`hotel/${hotelid}/facilitytype`);
      if (!res.success) {
          message.error(res.error); // param = res.error
          return;
      }
      dispatch({type:'GET_DATA_SUCCESS', data: res.result.facilititypes});
    } catch (e) {
        message.error(e);
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
  console.log(state.data)
  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form
          form={form}
          {...layout}
          onFinish={(value)=>{
            if(value.name) {
              add(value.name)
            } else {
              message.error('Facility type name is empty')
            }
          }}
        >
          <Form.Item name="name" label="Facility type">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round">
              Add facility type
            </Button>
          </Form.Item>
        </Form>
        {state.data.length !== 0 && (<List 
          itemLayout="horizontal"
          dataSource={state.data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
              />
              <Button type="primary" shape="circle" icon={<HighlightOutlined />} onClick={()=>{
                  form_update.setFieldsValue({name: item.name});
                  dispatch({type: 'TOOGLE_POPUP', facility: {open: true, data: item}, behavior: 'stall'});
                }}
              />
            </List.Item>
            )}
          />)}
      </Col>
      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
        <Button 
          type="primary" shape="round" icon={<PlusCircleOutlined/>}
          onClick={()=>{
            dispatch({type: 'TOOGLE_POPUP_FACILITY', facs: {open: true, data: {}}, behavior: 'stall'})
            form_facility.resetFields();
          }}
          >Add Facility
        </Button>
        <Table
          style={{marginTop: 10}} 
          rowKey="_id"
          dataSource={state.data.map(item => {
            return item.facilities.map(i => ({...i, facilititype: item.name}))
            // return item.facilities
          }).reduce((acc, val) => acc.concat(val), [])}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              align: 'center',
              key: 'name',
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              align: 'center',
              key: 'amount',
            },
            {
              title: 'Facility Type',
              dataIndex: 'facilititype',
              align: 'center',
              key: 'facilititype',
            },
            {
              title: 'Available Amount',
              dataIndex: 'availableAmount',
              align: 'center',
              key: 'availableAmount',
            },
            {
              title: 'Update',
              align: 'center',
              key: 'update',
              render: (t,r,i) => <Button
              type="primary"
              // style={{display: 'inline-block',marginLeft:4,borderRadius:'50%',background: 'white'}}
              size='small'
              onClick={()=>{
                  dispatch({type: 'TOOGLE_POPUP_FACILITY', facs: {open: true, data: r}, behavior: 'stall'})
                  form_facility.setFieldsValue({
                    name: r.name,
                    amount: r.amount
                  });             
              }}
              type="primary" shape="round" icon={<EditOutlined/>}
              ></Button>
            }
          ]}
          title={() => 'Facility'}
        />        
      </Col>
    </Row>
    <Modal 
      centered
      closable={false}
      maskClosable={false}
      title= {'Update Facility Type'}
      key='facility'
      width='50%' 
      visible={state.facility.open}
      forceRender
      keyboard
      okText={'Update'}
      onOk={()=>{
          form_update.submit();
        }
      }
      cancelText='Close'
      onCancel={() => {
          dispatch({type: 'TOOGLE_POPUP', facility: {open:false, data:{}}, behavior: 'init'})
          form_update.resetFields();
      }} 
    >
      <Form
        form={form_update}
        {...layout}
        onFinish={(value)=>{
          console.log(value);
          var myHeaders = new Headers(); 
          myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
          var newFa = {
            name: value.name
          }
          const upd = async() => {
            try {
              const res = await axios.put(`https://hotel-lv.herokuapp.com/api/facilitytype/${state.facility.data._id}`, newFa, {headers: myHeaders})
              console.log(res);
              dispatch({type: 'TOOGLE_POPUP', facility: {open:false, data:{}}, behavior: 'init'})
            } catch (e) {
              message.error(e.response);
            }
          }
          upd();
        }}
      >
        <Form.Item name="name" label="Facility type">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      centered
      closable={false}
      maskClosable={false}
      title= {'Facility'}
      key='facilities'
      width='50%' 
      visible={state.facs.open}
      forceRender
      keyboard
      okText={'Confirm'}
      cancelText='Close'
      onOk={()=>{
        form_facility.submit();
      }}
      onCancel={() => {
        dispatch({type: 'TOOGLE_POPUP_FACILITY', facs: {open:false, data:{}}, behavior: 'init'})
        form_facility.resetFields();
      }} 
    >
      <Form
        form={form_facility}
        {...layout}
        onFinish={(v)=>{
          console.log(v, state.facs.data)
          const uc = async () => {
            var myHeaders = new Headers(); 
            myHeaders.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
            if(state.facs.data.name) {
              //update
              try {
                var d = {
                  name: v.name,
                  amount: Number(v.amount)
                }
                const res = await axios.put(`https://hotel-lv.herokuapp.com/api/facility/${state.facs.data._id}`, d, {headers: myHeaders});
                console.log(res)
                message.success('Update facility sucessfully')
              } catch (e) {
                message.error(e.response.data.message)
                return;
              }
            } else {
              //create
              try {
                var d = {
                  name: v.name,
                  amount: Number(v.amount),
                  type: v.type
                }
                const res = await axios.post(`https://hotel-lv.herokuapp.com/api/hotel/${hotelid}/create-facility`, d, {headers: myHeaders});
                console.log(res)
                message.success('Create facility sucessfully')
              } catch (e) {
                console.log(e.response)
                message.error(e.response.data.message)
                return;
              }
            }
            dispatch({type: 'TOOGLE_POPUP_FACILITY', facs:{open:false, data:{}}, behavior: 'init'})
          }
          uc();
        }}
      >
        <Form.Item name="name" label="Facility name"
          rules={[
            {
              required: true,
              message: 'Please input name of facility!',
            }]}
        >
          <Input />
        </Form.Item>
        { !state.facs.data.name && (<Form.Item name="type" label="Facility Type"
            rules={[
              {
                required: true,
                message: 'Please input name of facility!',
            }]}
          >
          <Select 
            placeholder="Select facility type"
            allowClear
            showSearch
            options={state.data.map(item => ({label: item.name, value: item.name}))}
            filterOption={(inputValue, options) => {
              return options.label.toLowerCase().includes(inputValue.toLowerCase())
            }}
            notFoundContent={'Not found item'}
          />
        </Form.Item>)}
        <Form.Item name="amount" label="Amount"
          rules={[
          {
            required: true,
            message: 'Please input name of facility!',
          }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  </>
}