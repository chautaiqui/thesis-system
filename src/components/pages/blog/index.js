import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, message, Modal, Form, Button, Input, Typography, Drawer, Tag } from 'antd';
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { CustomUploadImg } from '../../commons';
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { _getRequest, postMethod, putMethod } from '@api';
import { getQuery, pushQuery } from '../../../hook/query';
import { useHistory } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 9,
    },
    sm: {
      span: 16,
      offset: 12,
    },
  },
};


export const Blog = (props) => {
  const [ behavior, setBehavior ] = useState('init');
  const [ blog, setBlog ] = useState([]);
  const [ query, setQuery ] = useState({page: 1, pageSize: 10});
  const [ total, setTotal ] = useState(undefined);
  const [ popup, setPopup ] = useState({open: false, data: {}});
  const [ draw, setDraw ] = useState({open: false, data: {}});
  const [ loading, setLoading ] = useState(false);
  const [ form ] = Form.useForm(); // form search blog
  const [ form_update ] = Form.useForm(); // form of blog update
  const [ form_create ] = Form.useForm(); // form of blog create
	const history = useHistory();

  useEffect(()=>{
    const getData = async() => {
      const res = await _getRequest('blog', query);
      if(!res.success) {
        message.error(res.error);
        return;
      }
      const _q = pushQuery(query);
			history.push({
				path: '/manager',
				search: "?" + _q
			})
      setBlog(res.result.blogs);
      setTotal(res.result.totalItems);
      // setQuery({...query, page: Number(res.result.currentPage), pageSize: Number(res.result.pageSize)});
      setBehavior('stall');
    }
    if(behavior === 'stall') return;
    if(behavior === 'init') getData();
  },[query, behavior])
  useEffect(()=>{
    if(popup.open) {
      form_update.setFieldsValue({
        title: popup.data.title,
        content: popup.data.content,
        img: popup.data.img
      });
    }
    
  }, [popup])

  useEffect(()=> {
    const param = getQuery(window.location.search);
    console.log(param)
		if(param.pageSize && param.page) {
      setQuery({ page: Number(param.page), pageSize: Number(param.pageSize)});
      // setBehavior('init');
		} else {
			const _q = pushQuery(query);
			history.push({
				path: '/blog',
				search: "?" + _q
			})
		}
  },[props])
  
  const showConfirm = () => {
		Modal.confirm({
			title: 'Do you confirm your blog?',
			icon: <CheckOutlined />,
			onOk() {
				form_update.submit();
			}
		});
	}
  const showConfirm_1 = () => {
		Modal.confirm({
			title: 'Do you confirm your blog?',
			icon: <CheckOutlined />,
			onOk() {
				form_create.submit();
			}
		});
	}
  const onSearch = (values) => {
    console.log(values.name)
    setQuery({
      ...query, title: values.name
    })
    setBehavior('init');
  }
  const updateBlog = (values) => {
    console.log(values, draw.open);
    setLoading(true)
		var data = new FormData();
    for (const [key, value] of Object.entries(values)){
			if(value) {
				data.append(key, value)
			}
		}
    const action = async () => {
      if(popup.open) {
        // update blog
        if(typeof values.img !== 'object') data.delete("img");
        const res = await putMethod('blog', data, popup.data._id);
        if(res.success){
          message.success("Update blog successfully");
          setLoading(false);
          setPopup({open: false, data: {}});
          setQuery(query);
          setBehavior('init');
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
          setQuery(query);
          setBehavior('init');
        } else {
          message.error(res.error);
          setLoading(false);
        }
      }

    }
    action();
  }
  const closeTag = () => {
    // dispatch({type: 'PAGINATION', query: { page: state.query.page, pageSize: state.query.pageSize}, total: state.total});
    setQuery({ page: query.page, pageSize: query.pageSize });
    setBehavior('init');
		form.resetFields();
  }
  console.log(query, behavior)
  return (
    <div>
      <Row gutter={[16,16]} style={{margin: "0px 0px 10px", background: "#fff", borderRadius: 10}}>
        <Col span={24}>
          <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
            <Form.Item
              name="name" label="Blog"
            > 
              <Input />
            </Form.Item>
            <Form.Item>
              <Button className="btn-color" type="primary" htmlType="submit" shape="round">
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <Button className="btn-color" type="primary" shape="round" icon={<PlusCircleOutlined/>} onClick={()=>{setDraw({open:true, data:{}})}}> Add Blog</Button>
            </Form.Item>
            {query.title && (<Form.Item>
                <Tag closable onClose={closeTag} color="#1890ff">Name: {query.title}</Tag>
              </Form.Item>)}
          </Form>
        </Col>
      </Row>
      
      <Row gutter={[16,16]} style={{margin: "0px 0px 10px", background: "#fff", borderRadius: 5}}>
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
      {/* <Pagination 
        style={{display: 'flex',justifyContent: 'center',marginTop: 10}}
        defaultCurrent={1} 
        total={blog.length}
        onChange={(page)=>{
          console.log(page)
        }}
      />   */}
      <Pagination
        // disabled={state.data.length === 0}
        current={query.page}
        pageSize={query.pageSize}
        pageSizeOptions={[5,10,20]}
        total={total}
        showSizeChanger={true}
        showTotal={total => `Total ${total} blogs`}
        onChange={function(page, pageSize) {
          // dispatch({type: 'PAGINATION', query: { page: page, pageSize: pageSize}, total: state.total})
          setQuery({...query, ...{ page: page, pageSize: pageSize}});
          setBehavior('init');
        }}
        onShowSizeChange={function(current, size) {
          // dispatch({type: 'PAGINATION', query: { page: current, pageSize: size}, total: state.total});
          setQuery({...query, ...{ page: current, pageSize: size} });
          setBehavior('init');
        }}
        style={{display: 'flex',justifyContent: 'center',marginTop: 10, paddingBottom: 30}}
        
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
            <Button className="btn-box-shawdow btn-color" shape='round' type='primary' onClick={showConfirm} loading={loading}>Confirm</Button>
            <Button className="btn-box-shawdow" shape='round' onClick={()=>{
              setLoading(false);
              setPopup({open:false, data:{}})
              form_update.resetFields();
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
          form={form_update}
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
          onFinish={updateBlog}
          name="add_blog_form"
          form={form_create}
          {...formItemLayout}
        >
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="img" label="Img">
            <CustomUploadImg/>
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
          <Button className="btn-box-shawdow btn-color" type="primary"  onClick={showConfirm_1} shape="round" loading={loading}>
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