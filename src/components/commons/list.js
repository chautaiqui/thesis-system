import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { fetchData, postData, putData } from '@api';

import { User } from '@pkg/reducers';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { Tag } from 'antd';
import  { useLocation, useHistory  } from 'react-router-dom';
import { messageError } from './';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FETCHING':
      return { ...state, behavior: 'fetching' };
    case 'FETCH_SUCCESS':
      return { ...state, data: action.dataResponse.data, meta: action.dataResponse.meta || {}, behavior: 'stall' };
    case 'FETCH_ERROR':
      messageError(action.error);
      return { ...state, data: [], meta: {}, behavior: 'stall' };
    case 'UPDATING':
      return { ...state, behavior: 'updating' };
    case 'UPDATE_SUCCESS':
      return { ...state, behavior: 'update_success' };
    case 'UPDATE_ERROR':
      messageError(action.error);
    case 'STALL':
      return { ...state, behavior: 'stall' };
    case 'PAGINATION_CHANGE': 
      return { ...state, meta: action.dataResponse, behavior: 'pagination_change' };
    default: return state;
  }
}
const initialState = { data: [], meta: {}, behavior: 'init' };

function extractSearch(search, history) {
  let query;
  if (search ==='') query = {}
  else {
    query = search.slice(1).split('&').reduce((r, i) => Object.assign({}, r, { [i.split('=')[0]]: decodeURIComponent(i.split('=')[1]) }), {});
    if (query.offset < 0 ) query.offset = 1 
    if (query.limit !== 10 || query.limit !== 20 || query.limit !== 30 || query.limit) query.limit = 20
    let re = /(\w)+\|(ascdesc)/;
    if (!re.test(query.order)) query.order = 'id|asc';
  }
  
  let queryString=''
  for (let x in query ) {
    if (query[x]) queryString += `${!queryString.length ? '?' : '&'}${x}=${query[x]}`;
  }
  console.log(queryString)
  // history.push(queryString);
  return query;
}

const List = props => {
  const { fn, tColumns, editData, 
    contentEdit, onOpen, onOk 
  } = props;
  const [ popup, setPopup ] = useState(false);
  const [ _state, _dispatch ] = useReducer(reducer, initialState);
  const [ user ] = useContext(User.context);
  
  const { search } = useLocation();
  let history = useHistory();
  
  const fetch = useCallback(async () => {
    _dispatch({ type: 'FETCH_FETCHING' });
    try {
      const resp = await fetchData[fn](user.api_token, _state.meta);
      const { success, result, error } = resp;
      if (!success) _dispatch({ type: 'FETCH_ERROR', error: error })
      else {
        // if (result.meta === undefined) {Object.assign(result, {meta: {}})}
        _dispatch({ type: 'FETCH_SUCCESS', dataResponse: result }) 
      }
    } catch (e) {
      _dispatch({ type: 'FETCH_ERROR', error: e });
    }
  }, [user.api_token, fn, _state]);

  const put = useCallback(async () => {
    _dispatch({ type: 'UPDATING' });
    try {
      const _fn = editData.id ? putData[fn] : postData[fn];
      const resp = await _fn(user.api_token, editData);
      const { success, result, error } = resp;
      if (!success) _dispatch({ type: 'UPDATE_ERROR', error: error })
      else _dispatch({ type: 'UPDATE_SUCCESS', item: result });
    } catch (e) {
      _dispatch({ type: 'UPDATE_ERROR', error: e });
    }
  }, [user.api_token, fn, editData]);
  
  useEffect(() => {
    switch (_state.behavior) {
      case 'fetching':
      case 'stall':
        return;
      case 'update_success':
        setPopup(false)
        fetch()
      case 'init': 
        // param here
        let query = extractSearch(search, history);
        _dispatch({ type: 'PAGINATION_CHANGE', dataResponse: query });
        // fetch();
        return;
      case 'pagination_change':
        fetch();
        return;
      default: return () => _dispatch({ type: 'STALL' });
    }
  }, [_state.behavior, fetch]);

  useEffect(() => {
    if (!editData) return;
    // console.log(editData);
    // create ko co id, update co id
    put();
  }, [editData, put]);
  
  useEffect(() => {
    console.log('change location search')
  }, [search])

  const openPopup = (values, num) => {
    onOpen(values);
    setPopup(true);
  }

  var { data, meta = {}, behavior } = _state;
  // console.log(behavior, meta)
  const pagi = {
    current: meta.offset || undefined,
    pageSize: meta.limit || 20,
    pageSizeOptions: [10, 20, 30],
    total: meta.total || data.length,
    disabled: _state.behavior === 'fetching',
    position: ['topRight' , 'bottomRight']
  }
  return ([
    <div key='a1'>
      <Tag>Tag 1</Tag>
      <Tag>Tag 2</Tag>
    </div>,
    contentEdit && (
      <Button
        key='button'
        style={{ marginBottom: 25 }}
        onClick={() => openPopup({}, -1)}
      >
        Create
      </Button>
    ),
    contentEdit && (
      <Modal
        centered
        closable={false}
        maskClosable={false}
        confirmLoading={_state.behavior === 'posting'}
        title='Update'
        key='modal'
        width='80%' 
        visible={popup}
        onOk={onOk}
        onCancel={() => setPopup(false)}
        cancelButtonProps={{ disabled: _state.behavior === 'posting' }}
      >
        {contentEdit}
      </Modal>
    ),
    <Table
      key='table'
      columns={[...tColumns, {
        title: 'Action',
        render: record => {return <button onClick={contentEdit ? () => openPopup(record, 1) : () => {}}>Update</button>}
        // render: record => {return <button >Update</button>}
      }]}
      dataSource={data}
      rowKey='id'
      loading={_state.behavior === 'fetching'}
      // onRow={row => ({
      //   onClick: contentEdit ? () => openPopup(row) : () => {},
      // })}
      pagination={ 
         pagi
      }
      onChange={
        Object.keys(meta).length === 0 ? () => {} :
        (pagination,f,s) => {
          console.log(f,s)
          if (!s) console.log('k co sort')
          let _or = 'asc';
          if (s.order) _or = s.order.slice(0, s.order.length-3)
          let ord = `${s.field}|${_or}`
          let newMeta = Object.assign(meta, {
            offset: pagination.current,
            limit: pagination.pageSize,
            order: ord
          });
          var queryString = '';
          delete newMeta.q;
          delete newMeta.total;
          delete newMeta.fields;
          for (let x in newMeta ) {
            if (newMeta[x]) queryString += `${!queryString.length ? '?' : '&'}${x}=${newMeta[x]}`;
          }
          history.push(queryString)
          _dispatch({ type: 'PAGINATION_CHANGE', dataResponse: meta });
        }
      }
      expandable={{
        expandedRowRender: record => (
          <p style={{ margin: 0 }}>{JSON.stringify(record)}</p>  
        )}}
    > </Table>
  ]);
}

export default List;