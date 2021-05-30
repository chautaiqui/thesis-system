import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, message, Modal, Form, Button, Input, Typography,Drawer } from 'antd';
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { CustomUploadImg } from '../../commons';
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { _getRequest, postMethod, putMethod } from '@api';


const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 24 },
};


export const Blog = props => {
  const [ blog, setBlog ] = useState([]);
  const [ popup, setPopup ] = useState({open: false, data: {}});
  const [ draw, setDraw ] = useState({open: false, data: {}});
  const [ loading, setLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const [ form_blog ] = Form.useForm();
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
  useEffect(()=>{
    if(popup.open) {
      console.log(popup.data)
      form_blog.setFieldsValue({
        title: popup.data.title,
        content: popup.data.content,
        img: popup.data.img
      });
    }
    if(draw.open) {
      form_blog.resetFields();
    }
  }, [popup, draw])
  const showConfirm = () => {
		Modal.confirm({
			title: 'Do you confirm your blog?',
			icon: <CheckOutlined />,
			onOk() {
        setLoading(true)
				form_blog.submit();
			}
		});
	}
  const onSearch = (values) => {
    console.log(values);
  }
  const updateBlog = (values) => {
    console.log(values);
		var data = new FormData();
    for (const [key, value] of Object.entries(data)){
			if(value) {
				data.append(key, value)
			}
		}
    const action = async () => {
      if(popup.open) {
        // update blog
        const res = await putMethod('blog', data, popup.data._id);
        if(res.success){
          message.success("Update blog successfully");
          setLoading(false);
          setPopup({open: false, data: {}});
        } else {
          message.error(res.error);
          setLoading(false);
        }
      }
      if(draw.open) {
        // add blog
        const res = await postMethod('blog/create', data);
        if(res.success){
          message.success("Add blog successfully");
          setLoading(false);
          setDraw({open: false, data: {}})
        } else {
          message.error(res.error);
          setLoading(false);
        }
      }
    }
    action();
  }
  console.log(popup, draw)
  return (
    <div>
      <Button type="primary" shape="round" icon={<PlusCircleOutlined/>} onClick={()=>{setDraw({open:true, data:{}})}}> Add Blog</Button>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch} style={{marginTop: 15}}>
        <Form.Item
          name="name" label="Blog"
        > 
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" shape="round">
            Search
          </Button>
        </Form.Item>
      </Form>
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
        footer={
          <div>
            <Button shape='round' type='primary' onClick={showConfirm} loading={loading}>Confirm</Button>
            <Button shape='round' onClick={()=>{
              setLoading(false);
              setPopup({open:false, data:{}})
              form_blog.resetFields();
            }}>Close</Button>
          </div>
        }
        onOk={showConfirm} 
        onCancel={()=>{
          setPopup({open: false, date: {}});
          form.resetFields();
        }}
      >
        <Form
          onFinish={updateBlog}
          name="blog_form"
          form={form_blog}
        >
          <Form.Item name="title">
            <EditText className='custom-input'/>
          </Form.Item>
          <Form.Item name="img">
            <CustomUploadImg/>
          </Form.Item>
          <Form.Item name="content">
            <EditTextarea className='custom-input' rows={15}/>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title={"Create blog" }
        placement={'right'}
        closable={false}
        onClose={()=>{
         setDraw({open: false, data: {}})
         setLoading(false);
        }}
        visible={draw.open}
        key={'left'}
        width={'80%'}
        footer={
          <Button onClick={()=>{
            setDraw({open: false, data: {}})
          }}>Close</Button>
        }
      >
        <Form
          onFinish={(value)=>{setLoading(true);updateBlog(value)}}
          name="blog_form"
          form={form_blog}
          {...layout}
        >
          <Form.Item name="title" label="Title">
            <EditText className='custom-input'/>
          </Form.Item>
          <Form.Item name="img" label="Img">
            <CustomUploadImg/>
          </Form.Item>
          <Form.Item name="content" label="Content">
            <EditTextarea className='custom-input' rows={15}/>
          </Form.Item>
          <Form.Item>
          <Button type="primary" htmlType="submit" shape="round" loading={loading}>
            Add
          </Button>
        </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}


const MultiLineText = props => {
  const { value, onChange } = props;
  const setEditableStr = (v) => {
    onChange(v);
  }
  return  <Typography.Paragraph 
      editable={{ onChange: setEditableStr, autoSize: true, onEnd: ()=>{} }}
    >
      {value}
    </Typography.Paragraph>
}