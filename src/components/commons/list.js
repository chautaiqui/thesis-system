import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { fetchData, postData } from '@api';

import { User } from '@pkg/reducers';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';

import { messageError } from './';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FETCHING':
      return { ...state, behavior: 'fetching' };
    case 'FETCH_SUCCESS':
      return { ...state, data: action.dataResponse.data, meta: action.dataResponse.meta, behavior: 'stall' };
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
    case 'PAGINATION CHANGE': 
      return { ...state, meta: action.dataResponse, behavior: 'pagination_change' };
    default: return state;
  }
}
const initialState = { data: [], meta: {}, behavior: 'init' };
const List = props => {
  const { fn, tColumns, editData, 
    contentEdit, onOpen, onOk
  } = props;
  const [ popup, setPopup ] = useState(false);
  // const [options, setOptions] = useState({});
  const [ _state, _dispatch ] = useReducer(reducer, initialState);
  const [ user ] = useContext(User.context);

  const fetch = useCallback(async () => {
    _dispatch({ type: 'FETCH_FETCHING' });
    try {
      const resp = await fetchData[fn](user.api_token, _state.meta);
      const { success, result, error } = resp;
      if (!success) _dispatch({ type: 'FETCH_ERROR', error: error })
      else {
        if (result.meta === undefined) {Object.assign(result, {meta: {}})}
        _dispatch({ type: 'FETCH_SUCCESS', dataResponse: result }) 
      }
    } catch (e) {
      _dispatch({ type: 'FETCH_ERROR', error: e });
    }
  }, [user.api_token, fn, _state]);

  const put = useCallback(async () => {
    _dispatch({ type: 'UPDATING' });
    try {
      const resp = await postData[fn](user.api_token, editData);
      const { success, result, error } = resp;
      console.log(result)
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
      case 'post_success':
        setPopup(false)
      case 'init': 
        fetch();
        return;
      case 'pagination_change':
        fetch();
        return;
      default: return () => _dispatch({ type: 'STALL' });
    }
  }, [_state.behavior, fetch]);

  useEffect(() => {
    if (!editData) return;
    put();
  }, [editData, put]);
  
  const openPopup = (values) => {
    onOpen(values);
    setPopup(true);
  }

  var { data, meta, behavior} = _state;
  const pagi = Object.keys(meta).length === 0 ? {} : {
    defaultPageSize: _state,
    pageSize: meta.limit,
    pageSizeOptions: [10, 20, 30],
    total: meta.total,
    disabled: _state.behavior === 'fetching',
  }
  return ([
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
        render: record => {return <button onClick={contentEdit ? () => openPopup(record) : () => {}}>Update</button>}
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
        (pagination) => {
          // setOptions({offset: pagination.current, limit: pagination.pageSize})
          // this.changeState(pagination.current, pagination.pageSize);
          let newMeta = Object.assign(meta, {
            offset: pagination.current,
            limit: pagination.pageSize
          });
          _dispatch({ type: 'PAGINATION CHANGE', dataResponse: meta });
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