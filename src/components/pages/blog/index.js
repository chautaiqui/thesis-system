import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, message, Modal, Form } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { _getRequest } from '@api';
export const Blog = props => {
  const [ blog, setBlog ] = useState([]);
  const [ popup, setPopup ] = useState({open: false, data: {}});
  const [ form ] = Form.useForm();
  useEffect(()=>{
    const getData = async() => {
      const res = await _getRequest('blog');
      if(!res.success) {
        message.error(res.error);
      }
      setBlog(res.result);
    }
    getData();
  },[])
  const showConfirm = () => {
		Modal.confirm({
			title: 'Do you confirm new blog?',
			icon: <CheckOutlined />,
			onOk() {
				form.submit();
			}
		});
	}
  return (
    <div>
      <Row gutter={[16,16]} style={{marginTop: 50}}>
        {
          blog.map((item, index) => {
            return (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}
                onClick={()=>{
                  setPopup({open: true, data: item})
                }}
              >
                <img src={item.img} alt='blog' style={{maxWidth: '100%'}}/>
                <p>{item.title}</p>
              </Col>
            )
          })
        }
      </Row>
      <Pagination 
        style={{display: 'flex',justifyContent: 'center',marginTop: 10}}
        defaultCurrent={1} 
        total={blog.length}
        onChange={(page)=>{
          console.log(page)
        }}
      />  
      <Modal 
        centered
        width='90%'
        closable={false}
        maskClosable={false}
        title="Hotel" 
        visible={popup.open} 
        okText='Save'
        cancelText='Close'
        onOk={showConfirm} 
        onCancel={()=>{
          setPopup({open: false, date: {}});
          form.resetFields();
        }}
      >
        heo
      </Modal>
    </div>
  )
}
