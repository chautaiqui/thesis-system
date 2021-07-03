import React, { useState, useContext, useEffect } from 'react';
import { User } from '@pkg/reducers';
import { Row, Col, Form, Table, DatePicker, Input, Button, Divider, Select } from 'antd';
import { CheckCircleTwoTone, NodeExpandOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';
import { postMethod, _getRequest } from '../../../pkg/api';
const initialState = { behavior: 'init', data: [], form: []}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

export const FormResquest = props => {
  const [ user ] = useContext(User.context);
  const [ data, setData ] = useState(initialState);
  const [ loading, setLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const getAllLeaveForm = async () => {
    return;
  }

  useEffect(()=>{
    if(data.behavior === 'init') {
      const date = moment();
      haveShift(date.date(), date.month()+ 1, date.year());
      // getAllLeaveForm();
    }
  }, [data.behavior])

  const haveShift = (date, month, year) => {
    const getShift = async () => {
      const res = await postMethod(`/employee/${user.auth._id}/shift-by-specific-time`, {year, month});
      const res_1 = await _getRequest(`/employee/${user.auth._id}/view-leave`);
      console.log(res_1)
      if(res.success && res_1.success) {
        setData({
          behavior: 'stall',
          data: res.result.shift.filter(item=>item.date >= date),
          form: res_1.result
        })
      }
    }
    getShift();
  }
  const onFinish = (values) => {
    console.log(values);
    const data = {
      title: values.title,
      reason: values.reason
    }
    // console.log(data);
    // /employee/:shift_id/:emp_id/:hotel_id/apply-leave
    const req = async() => {
      const res = await postMethod(`employee/${values.shift}/${user.auth._id}/${user.auth.hotel}/apply-leave`, data);
      if(res.success) {
        form.resetFields();
        setData({
          ...data,
          behavior: 'init'
        })

      }
    }
    req();
  };
  // console.log(data)
  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} xs={8}>
        <Divider orientation="left">Form Request</Divider>
        <Form 
          form={form}
          onFinish={onFinish}
          {...layout}
        >
          <Form.Item
            name={"title"}
            label="Title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select 
              options={["Nghỉ phép", "Nghỉ phép không lương", "Điểm danh muộn"].map(item=>({label:item, value:item}))}
              placeholder="Nghỉ phép"
            />
          </Form.Item>
          <Form.Item
            name={"shift"}
            label="Shift"
            rules={[
              {
                required: true,
              },
            ]}
          >
            {/* <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
            /> */}
            <Select 
              options={data.data ? data.data.map((item)=>({label: `${item.date}-${item.month}-${item.year}`, value: item._id})): []}
            />
          </Form.Item>
          <Form.Item
            name={"reason"}
            label="Reason"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit" type="primary" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col xs={24} xs={16}>
        <Divider orientation="left">History</Divider>
        <Table 
          rowKey='_id'
          tableLayout="auto"
          dataSource={data.form}
          columns={[
            {
              title: 'Title',
              dataIndex: 'title',
              align: 'center',
              key: 'title', 
            },
            {
              title: 'Reason',
              dataIndex: 'reason',
              align: 'center',
              key: 'reason', 
            },
            {
              title: 'Date',
              align: 'center',
              key: 'date',
              render: (text, record, index) => <div>{record.date}-{record.month}-{record.year}</div>
            },
            {
              title: 'Status',
              align: 'center',
              key: 'status',
              render: (text, record, index) => {
                const _icon = record.status === 'accepted' ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : (record.status === 'pending' ? <SyncOutlined style={{color: 'red'}}/> : <NodeExpandOutlined />);
                return <Button
                  size='small'
                  shape="circle" icon={_icon}
                  onClick={()=>{
                    
                  }}
                ></Button>
              }
            },
          ]}
        />
      </Col>
    </Row>
  </>
}