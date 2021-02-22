import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { fetchData, postData, putData } from '@api';

import { User } from '@pkg/reducers';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';

import  { useHistory  } from 'react-router-dom';
import { messageError } from './';

const reducer = (state, action) => {
switch (action.type) {
	case 'FETCH_FETCHING':
	return { ...state, behavior: 'fetching' };
	case 'FETCH_SUCCESS':
	return { ...state, data: action.dataResponse.data, total: action.total, behavior: 'stall' };
	case 'FETCH_ERROR':
	messageError(action.error);
	return { ...state, data: [], behavior: 'stall' };
	case 'UPDATING':
	return { ...state, behavior: 'updating' };
	case 'UPDATE_SUCCESS':
	return { ...state, behavior: 'update_success' };
	case 'UPDATE_ERROR':
	messageError(action.error);
	return { ...state, behavior: 'stall' };
	case 'STALL':
	return { ...state, behavior: 'stall' };
	default: return state;
}
}
const initialState = { data: [], behavior: 'init' };

const List = props => {
	const { fn, tColumns, editData, 
		contentEdit, onOpen, onOk,
		searchFields, 
		tableProps
	} = props;
	const [ popup, setPopup ] = useState(false);
	const [ _state, _dispatch ] = useReducer(reducer, initialState);
	const [ user ] = useContext(User.context);

	// const { search } = useLocation();
	const history = useHistory();
	const fetch = useCallback(async () => {
		_dispatch({ type: 'FETCH_FETCHING' });
		try {
			const resp = await fetchData[fn](user.api_token, searchFields);
			const { success, result, error } = resp;
			if (!success) return _dispatch({ type: 'FETCH_ERROR', error: error })
			result.meta = Object.assign({}, result.meta, { order: result.meta.order.join('|') });
			// if (result.meta === undefined) {Object.assign(result, {meta: {}})}
			let query = '';
			for (let x in searchFields) {
				query += `&${x}=${searchFields[x]}`
			}
			history.replace({search: query.slice(1)});
			_dispatch({ type: 'FETCH_SUCCESS', dataResponse: result, total: result.meta.total }) 
		} catch (e) {
			_dispatch({ type: 'FETCH_ERROR', error: e });
		}
	}, [user.api_token, fn, searchFields, history]);

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
			return
		case 'init': 
			// param here
			// _dispatch({ type: 'PAGINATION_CHANGE', dataResponse: searchFields });
			fetch();
			return;
		// case 'pagination_change':
		// 	fetch();
		// 	return;
		default: return () => _dispatch({ type: 'STALL' });
		}
	}, [_state.behavior, fetch]);

	useEffect(() => {
		if (!editData) return;
		put();
	}, [editData, put]);

	// console.log(searchFields)
	useEffect(() => {
		if (searchFields) fetch();
	}, [searchFields, fetch])

	const openPopup = (values, num) => {
		onOpen(values);
		setPopup(true);
	}

	var { data, behavior, total } = _state;
	// console.log(behavior, meta)
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
			confirmLoading={behavior === 'posting'}
			title='Update'
			key='modal'
			width='80%' 
			visible={popup}
			onOk={onOk}
			onCancel={() => setPopup(false)}
			cancelButtonProps={{ disabled: behavior === 'posting' }}
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
		loading={behavior === 'fetching'}
		// onRow={row => ({
		//   onClick: contentEdit ? () => openPopup(row) : () => {},
		// })}
		pagination={ 
			{
				current: searchFields.offset || undefined,
				pageSize: searchFields.limit || 20,
				pageSizeOptions: [10, 20, 30],
				total: total || data.length,
				disabled: behavior === 'fetching',
				position: ['topRight' , 'bottomRight']
			}
		}
		
		expandable={{
			expandedRowRender: record => (
			<p style={{ margin: 0 }}>{JSON.stringify(record)}</p>  
			)}}
		{...tableProps}
		> </Table>
	]);
}

export default List;