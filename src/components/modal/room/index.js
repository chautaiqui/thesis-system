import React, {useState, useEffect} from 'react';
import { Space, Button, Table, Modal, message, Form, Upload } from 'antd';
import { PlusCircleOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export const ModalRoom = props => {
  const { popup, closePopup, submitForm, hotelId = ''} = props;

  useEffect(()=> {
    // get roomType
  }, [])

  return <Modal
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
    onOk={submitForm}
    cancelText='Close'
    onCancel={closePopup}
  >
    <Form >
      <Form.Item
        
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={upload}
          beforeUpload={beforeUpload}
        >
          {
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
          }
        </Upload>
      </Form.Item>
    </Form>

  </Modal>
}