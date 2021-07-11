import React, { useReducer, useEffect, useState } from 'react';
import { Input, List, message, Button, Form, Modal, Row, Col, Table, Select } from 'antd';
import { HighlightOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { _getRequest, postMethod, putMethod } from '@api';
import { filerColumn } from '../../commons';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

const FacilityReducer = (state, action) => {
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
  const [ loading, setLoading ] = useState(false);
  const [ load, setLoad ] = useState(false);
  const add = async(name) => {
    setLoading(true);
    const res = await postMethod(`hotel/${hotelid}/create-facilitytype`, {name: name});
    if (res.success){
      message.success("Create new facility type")
      form.resetFields();
      dispatch({type:'RELOAD'});
      setLoading(false);
      return;
    } else {
      message.error(res.error);
      setLoading(false);
      return
    }
  }
  const getData = async () => {
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
  useEffect(()=>{
    dispatch({type: 'RELOAD'})
  },[hotelid])
  const onFinishFacility = (v)=>{
    const uc = async () => {
      setLoad(true);
      if(state.facs.data.name) {
        //update
        var d = {
          name: v.name,
          amount: Number(v.amount)
        }
        const res = await putMethod('facility', d, state.facs.data._id);
        if(res.success) {
          message.success('Update facility sucessfully')
        } else {
          message.error(res.error);
        }
      } else {
        //create
        var d = {
          name: v.name,
          amount: Number(v.amount),
          type: v.type
        };
        var res = await postMethod(`hotel/${hotelid}/create-facility`, d);
        if(res.success) {
          message.success('Update facility sucessfully')
        } else {
          message.error(res.error);
        }
      }
      setLoad(false);
      dispatch({type: 'TOOGLE_POPUP_FACILITY', facs:{open:false, data:{}}, behavior: 'init'})
    }
    uc();
  }
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" shape="round" loading={loading} style={{float: "right"}} icon={<PlusCircleOutlined/>}>
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
              <div style={{marginRight: 20}}>{item.amount}</div>
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
          style={{
            float: "right",
            marginBottom: 10,
            zIndex: 2
          }}
          >Add Facility
        </Button>
        <Table
          style={{marginTop: 10}} 
          rowKey="_id"
          bordered
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
              ...filerColumn([], 'name'),
              onFilter: (value, record) =>
                  record.name
                      ? record.name.toString().toLowerCase().includes(value.toLowerCase())
                      : '',
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
      closable={true}
      maskClosable={false}
      title= {'Update Facility Type'}
      key='facility'
      width='50%' 
      visible={state.facility.open}
      forceRender
      keyboard
      // okText={'Update'}
      onOk={()=>{
          form_update.submit();
        }
      }
      // cancelText='Close'
      onCancel={() => {
          dispatch({type: 'TOOGLE_POPUP', facility: {open:false, data:{}}, behavior: 'init'})
          form_update.resetFields();
      }} 
      footer={
				<div>
					<Button className="btn-box-shawdow" type='primary' loading={load} onClick={()=>{
            form_update.submit();
          }} loading={loading}>Update</Button>
					<Button className="btn-box-shawdow" onClick={()=>{
						 dispatch({type: 'TOOGLE_POPUP', facility: {open:false, data:{}}, behavior: 'init'})
             form_update.resetFields();
					}}>Close</Button>
				</div>
			}
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
      closable={true}
      maskClosable={false}
      title= {'Facility'}
      key='facilities'
      width='50%' 
      visible={state.facs.open}
      forceRender
      keyboard
      footer={
				<div>
					<Button className="btn-box-shawdow" type='primary' loading={load} onClick={()=>{
            form_facility.submit();
          }} loading={loading}>Confirm</Button>
					<Button className="btn-box-shawdow" onClick={()=>{
						setLoad(false);
						dispatch({type: 'TOOGLE_POPUP_FACILITY', facs: {open:false, data:{}}, behavior: 'init'})
            form_facility.resetFields();
					}}>Close</Button>
				</div>
			}
      // onOk={()=>{
      //   form_facility.submit();
      // }}
      // onCancel={() => {
      //   dispatch({type: 'TOOGLE_POPUP_FACILITY', facs: {open:false, data:{}}, behavior: 'init'})
      //   form_facility.resetFields();
      // }} 
    >
      <Form
        form={form_facility}
        {...layout}
        onFinish={onFinishFacility}
      >
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
        <Form.Item name="name" label="Facility name"
          rules={[
            {
              required: true,
              message: 'Please input name of facility!',
            }]}
        >
          <Input />
        </Form.Item>
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