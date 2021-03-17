import React from 'react';

import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
import { Tag, Button } from 'antd';

import { SolutionOutlined } from '@ant-design/icons';


export const ViewLogModal = (props) => {
    const { data = [], onClose = () => {} } = props;
    return (
        <Modal 
            key={'viewlog'}
            centered
            closable={false}
            visible={data.visible}
            maskClosable={false}
            onCancel={onClose} 
            title={<><SolutionOutlined/>{data.title}</>}
            footer={
                <Button onClick={onClose}>Close</Button>
            }
            keyboard={true} // can onCancel
            size={'small'}
            width={'90%'}
        >
            <Table 
                key={'log-table'}
                bordered
                loading={data.data.length === 0}
                dataSource={data.data}
                size={'small'}
                scroll={{ y: 600 }} 
                columns={[
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        key: '_date',
                        render: (value, row) => {
                            return {
                                children: value,
                                props: {
                                    rowSpan: row.rowSpan
                                }
                            }				
                        }
                    },
                    {
                        title: 'User',
                        dataIndex: 'user',
                        key: '_user',
                        render: (value, row) => {
                            return {
                                children: value,
                                props: {
                                    rowSpan: row.rowSpan
                                }
                            }				
                        }
                    },
                    {
                        title: 'Event',
                        dataIndex: 'event',
                        key: '_event',
                        render: (value, row) => {
                            return {
                                children: <Tag color={value === 'updated' ? 'green': 'blue'}>{value}</Tag>,
                                props: {
                                    rowSpan: row.rowSpan
                                }
                            }				
                        }
                    },
                    {
                        title: 'Field',
                        dataIndex: 'field',
                        key: '_field',
                    },
                    {
                        title: 'Old value',
                        dataIndex: 'old_value',
                        key: '_old_value',
                    },
                    {
                        title: 'New value',
                        dataIndex: 'new_value',
                        key: '_new_value',
                    },
                ]}
                pagination={false}
                rowKey='user'
                loading={data.data.length === 0}
            />
        </Modal>
    )
}

export const FormModal = (props) => {
    const { data, options, component, loading, editData } = props;
    return (
        <Modal 
            centered
            closable={false}
            maskClosable={false}
            confirmLoading={loading}
            title= {data.title}
            key='modal_update_create'  
            width='90%' 
            keyboard
            visible={options.open}
            footer={[
                // <Button key="cancel" onClick={() => togglePopUp({ open: false })}>Close</Button>,
                // <Button key="ok" onClick={()=>_dispatch({type: 'CONFIRM', confirm: true})}>{!editData? 'Create ' : 'Update'}</Button>,
                <Button key="cancel">Close</Button>,
                <Button key="ok" >{!editData? 'Create ' : 'Update'}</Button>,
            ]}
        >
            {component}
        </Modal>
    )
}
