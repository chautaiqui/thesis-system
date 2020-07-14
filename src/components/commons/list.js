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
      return { ...state, list: action.list, behavior: 'stall' };
    case 'FETCH_ERROR':
      messageError(action.error);
      return { ...state, list: [], behavior: 'stall' };
    case 'POSTING':
      return { ...state, behavior: 'posting' };
    case 'POST_SUCCESS':
      return { ...state, behavior: 'post_success' };
    case 'POST_ERROR':
      messageError(action.error);
    case 'STALL':
      return { ...state, behavior: 'stall' };
    default: return state;
  }
}

const List = props => {
  const { fn, tColumns, editData, 
    contentEdit, onOpen, onOk
  } = props;
  const [ popup, setPopup ] = useState(false);
  const [ _state, _dispatch ] = useReducer(reducer, { list: [], behavior: 'init' });
  const [ user ] = useContext(User.context);

  const fetch = useCallback(async () => {
    _dispatch({ type: 'FETCH_FETCHING' });
    try {
      const resp = await fetchData[fn]({ token: user.idToken });
      const { success, result, error } = resp;
      if (!success) _dispatch({ type: 'FETCH_ERROR', error: error })
      else _dispatch({ type: 'FETCH_SUCCESS', list: result })
    } catch (e) {
      _dispatch({ type: 'FETCH_ERROR', error: e });
    }
  }, [user.idToken, fn]);

  const post = useCallback(async () => {
    _dispatch({ type: 'POSTING' });
    try {
      const resp = await postData[fn]({ token: user.idToken, ...editData });
      const { success, result, error } = resp;
      if (!success) _dispatch({ type: 'POST_ERROR', error: error })
      else _dispatch({ type: 'POST_SUCCESS', item: result });
    } catch (e) {
      _dispatch({ type: 'POST_ERROR', error: e });
    }
  }, [user.idToken, fn, editData]);

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
      default: return () => _dispatch({ type: 'STALL' });
    }
  }, [_state.behavior, fetch]);

  useEffect(() => {
    if (!editData) return;
    post();
  }, [editData, post]);

  const openPopup = (values, index) => {
    onOpen(values, index);
    setPopup(true);
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
      columns={tColumns}
      dataSource={_state.list}
      rowKey='id'
      loading={_state.behavior === 'fetching'}
      onRow={row => ({
        onClick: contentEdit ? () => openPopup(row) : () => {},
      })}
    >
    </Table>
  ]);
}

export default List;