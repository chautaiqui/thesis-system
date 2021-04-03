import React, { useEffect, useReducer } from 'react';
import Media from "react-media";
// import { User } from '@pkg/reducers';
import { _getRequest, _putRequest, _postRequest } from '@pkg/api';

import { Table, Tag, Modal } from 'antd';
import {
    Form, Input, Button, message, Row, Col, Carousel
} from 'antd';
import { EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import { filerColumn } from '../../commons';
// import { MultiSelect } from '../../commons';

const HotelReducer = (state, action) => {
    switch (action.type) {
        case 'GET_DATA_SUCCESS':
            return { ...state, data: action.data, behavior: 'stall' }
        case 'GET_DATA_ERROR':
            return { ...state, data: [], behavior: 'stall' };
        case 'TOOGLE_POPUP':
            return { ...state, popup: action.popup, behavior: 'stall' };
        case 'TOOGLE_VIEW':
            return { ...state, view: action.view, behavior: 'stall' };
        case 'RELOAD':
            return { ...state, behavior: 'init', popup: action.popup };
        default:
            return state;
    } 
}

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export const Hotel = (props) => {
    const [ state, dispatch ]= useReducer(HotelReducer, {
        behavior: 'init',
        data: [],
        popup: {open: false, data: {}},
        view: {open: false}
    });
    const { data, popup, behavior, view } = state;
    const [ form ] = Form.useForm();
    
    const getData = async () => {
        try {
            let re = await _getRequest('hotel');
            if (!re.success) {
                message.error(re.error); // param = res.error
            }
            // setLstemp(re.result.hotels);
            dispatch({type:'GET_DATA_SUCCESS', data: re.result.hotels});
        } catch (e) {
            message(e);
            dispatch({type: 'GET_DATA_ERROR'});
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

    const onFinish = async values => {
        try {
            // post employee 
            let re = await _putRequest('hotel', values, popup.data.id);
            if(re.success) {
                message.success(re.result.message);
                // dispatch({type: 'CLOSE_POPUP', popup: {open:false, data:{}}})
                dispatch({type: 'RELOAD', popup: {open:false, data:{}}});
                form.resetFields();
            }
        } catch (e) { 
            message.error(e);
        }
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        message.error(errorInfo);
    };
    console.log(behavior)
    return (
        <Media query="(min-width: 599px)">
        {
        matchs => {   
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
                    title: 'Phone',
                    dataIndex: 'contactNumber',
                    align: 'center',
                    key: 'contactNumber',
                    render: tags => (
                      <>
                        <Tag color={'blue'} key={'phone'}>
                            {tags}
                        </Tag>
                      </>
                    ),
                },
                {
                    title: 'Action',
                    align: 'center',
                    key: 'action',
                    render: (text, record, index) => {
                        return (<>
                            <Button
                                style={{display: 'inline-block',marginLeft:4,borderRadius:'50%',background: 'white'}}
                                size='small'
                                onClick={()=>{
                                    dispatch({type: 'TOOGLE_POPUP', popup: {open: true, data:record}})
                                    form.setFieldsValue(record);             
                                }}
                            ><EditOutlined /></Button>
                            <Button
                                style={{display: 'inline-block',marginLeft:4,borderRadius:'50%',background: 'white'}}
                                size='small'
                                onClick={()=>{
                                    dispatch({type: 'TOOGLE_VIEW', view: {open: true}})
                                }}
                            ><FolderViewOutlined /></Button>
                        </>)
                    }
                },
                
            ]
            var expandtable = {
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>
            }
            var temp = [{
                title: 'description',
                dataIndex: 'description',
                align: 'center',
                key: 'description',
                hideOn: ['xs', 'sm'],
            }, 
            {
                title: 'Address',
                dataIndex: 'address',
                align: 'center',
                key: 'address',
            }]
            matchs && (tCol = [...tCol,...temp])
            matchs && (expandtable = {
                rowExpandable: record => true
            })
            return <><Table 
                rowKey='id'
                loading={data.length === 0}
                dataSource={data} 
                columns={tCol} 
                expandable={expandtable}
            />; 
            <Modal
                centered
                closable={false}
                maskClosable={false}
                title= {popup.data.name ? `Edit ${popup.data.name}`: 'Edit' }
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
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 12,
                    }}
                    layout="horizontal"
                >
                    <Row gutter={16}>
                        <Col xs={22} sm={22} md={24}>
                            <Form.Item label="Name" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="contactNumber">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description" name="description">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                centered
                closable={false}
                maskClosable={false}
                // title= {popup.data.name ? `View hotel${popup.data.name}`: 'View hotel' }
                key='modal_view'
                width='70%' 
                visible={view.open}
                maskClosable={false}
                keyboard={true} // esc to onCancel
                forceRender
                footer={
                    <Button onClick={()=>dispatch({type: 'TOOGLE_VIEW', view: {open: false}})}>Close</Button>
                }    
                onCancel={()=>dispatch({type: 'TOOGLE_VIEW', view: {open: false}}) }
            >
                <Carousel autoplay>
                    <div>
                        <h3 style={contentStyle}>Image hotel</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>Image hotel</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>Image hotel</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>Image hotel</h3>
                    </div>
                </Carousel>
            </Modal></>
            }
        }
        </Media>
    )
}