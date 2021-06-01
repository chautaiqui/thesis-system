import React, {useState, useMemo, useEffect, useContext } from 'react';
import { _getRequest} from '@api';
import { User } from '@pkg/reducers';
import { message, Form, Input, Button } from 'antd';
const getWeekYearNow = () => {
  const n = new Date();
  return [n.getMonth() + 1, n.getFullYear()];
};

export const Report = props => {
  const [month, year] = useMemo(() => getWeekYearNow(), [props]);
  const [ user ] = useContext(User.context);
  const [query, setQuery] = useState({month: month, year: year});
  const [data, setData] = useState({});
  const [ form ] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue(query)
    if(!user.auth.hotel){
      message.error('You no manage hotel');
      return;
    }
    const getData = async () => {
      const res = await _getRequest(`hotel/${user.auth.hotel}/report`, query);
      if(res.success) {
        setData(res.result);
        return;
      } else {
        message.error(res.error)
      }
    }
    getData();
  },[query])
  const onSearch = values => {
    setQuery(values)
  }
  console.log(data, query)
  return <div>
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
      <Form.Item
        name="month" label="Month"
      > 
        <Input />
      </Form.Item>
      <Form.Item
        name="year" label="Year"
      > 
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" shape="round">
          View
        </Button>
      </Form.Item>
    </Form>
    {query.month} - {query.year}
  </div>
}