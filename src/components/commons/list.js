import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { fetchData, postData, putData, requires, getRequest } from '@api';

import { User } from '@pkg/reducers';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { Tag, Card, Menu, Dropdown} from 'antd';
import { DownOutlined, SolutionOutlined } from '@ant-design/icons';

// import { Divider } from 'antd';

import  { Switch, useHistory  } from 'react-router-dom';
import { messageError } from './';
import { isArguments } from 'lodash';

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
		tableProps,
		updateSF = () => {},
		resetSF = () => {},
		require = () => {},
		fieldsRequire = [],
		action = [], 
	} = props;
	const [ popup, setPopup ] = useState(false);
	const [ logData, setLogData] = useState({visible: false, title: "", data: []});
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
			if (result.meta) result.meta = Object.assign({}, result.meta, { order: result.meta.order.join('|') });
			// if (result.meta === undefined) {Object.assign(result, {meta: {}})}
			let query = '';
			for (let x in searchFields) {
				if (searchFields[x] !== null) query += `&${x}=${searchFields[x]}`
			}
			history.replace({search: query.slice(1)});
			_dispatch({ type: 'FETCH_SUCCESS', dataResponse: result, total: result.meta ? result.meta.total : result.data.length }) 
		} catch (e) {
			_dispatch({ type: 'FETCH_ERROR', error: e });
		}
	}, [user.api_token, fn, searchFields, history]);

	const put = useCallback(async () => {
		_dispatch({ type: 'UPDATING' });
		try {
			console.log(editData)
			const _fn = editData.id ? putData[fn] : postData[fn];
			const resp = await _fn(user.api_token, editData);
			const { success, result, error } = resp;
			// console.log(success, result, error)
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

	useEffect(() => {
		if (searchFields) fetch();
	}, [searchFields, fetch])

	useEffect(()=> {
		const fetchRequire = async (fn, meta) => {
			try {
				const res = await requires[fn](user.api_token, meta)
				const { success, result } = res;
				if (!success) return {[fn]: {}}
				return {[fn]: result.data}
			} catch(e) {
				return {[fn]: {}}
			}
		}
		let _data;
		_data = fieldsRequire.map(async (item) => {
			try {
				return await fetchRequire(item.name, item.meta)
			} catch (e) {
				return {}
			}
		})
		require(_data)
	},[])

	const openPopup = (values, num) => {
		onOpen(values);
		setPopup(true);
	}
	const actionClick = (e, record) => {
		switch (e.key) {
			case 'View Detail':
				console.log('detail')
				break;
			case 'Copy':
				console.log('copy')
				break;
			case 'View Report':
				console.log('report')
				break;
			case 'View Log':
				(async()=>{
					try {
						const reps = await getRequest(fn, user.api_token, {} , [record.id, 'audit']);
						const {success, result} = reps;
						if (!success) return;
						setLogData({...logData, ...{visible: true, title: `Changelog: ${fn}/${record.id}`, data: result.data}})
					} catch(e) {
						return;
					}
				})()
				break;
			default:
				return
		}

	}

	var { data, behavior, total } = _state;
	// console.log(behavior)
	console.log(logData.data)
	return ([
		<Card 
		style={{
			borderRadius: 5,
			marginBottom: 15,
			boxSizing: 'border-box'
		}}
		key='card1'>
			{Object.entries(searchFields)
				.filter(item => !['offset', 'limit', 'order'].includes(item[0]) && !!item[1])
				.map(item => (
					<Tag
						key={item[0]}
						closable
						onClose={e => {
							resetSF(item[0])
						}}
					>
						{`${item[0]}: ${item[1]}`}
					</Tag>
				)
			)}
		</Card>,
		<Card 
			style={{
				borderRadius: 5,
				boxSizing: 'border-box'
			}}
			key='card2'
		>
			{
				contentEdit && (
					<Button
						key='create'                              
						style={{ marginBottom: 0 }}
						onClick={() => openPopup({}, -1)}
					>
						Create
					</Button>
					)
			}
			{
				<Modal
					centered
					closable={false}
					visible={logData.visible}
					maskClosable={false}
					title={<><SolutionOutlined/>{logData.title}</>}
					onCancel={() => setLogData({...logData, ...{visible:false}})}
					footer={<Button onClick={() => setLogData({...logData, ...{visible:false}})}>Close</Button>}
					keyboard
				>
					<Table 
						bordered
						loading={logData.data.length === 0}
						dataSource={logData.data}
						size={'small'}
						columns={[
							{
								title: 'Date',
								dataIndex: 'created_at',
								key: 'created_at',
							},
							{
								title: 'User',
								dataIndex: 'user',
								key: 'user',
								render: record => {
									return record.id + '-' + record.name + record.email
								}
							},
							{
								title: 'Event',
								dataIndex: 'event',
								key: 'event',
								render: record => {
									return <Tag color={record === 'updated' ? 'blue': 'green'}>{record}</Tag>
								}
							},
							
						]}
						pagination={false}
						rowKey='id'
						loading={logData.data.length === 0}
					/>
				</Modal>
			}
			{
				contentEdit && (
					<Modal
						centered
						closable={false}
						maskClosable={false}
						confirmLoading={behavior === 'posting'}
						title='Create'
						key='modal'
						width='80%' 
						visible={popup}
						onOk={onOk}
						onCancel={() => setPopup(false)}
						cancelButtonProps={{ disabled: behavior === 'posting' }}
					>
						{contentEdit}
					</Modal>
					)
			}
			{
				<Table
					key='table'
					columns={
						[...tColumns, 
						action.length === 0 ? {} : {
							title: 'Action',
        					render: record => {
								const menu = (<Menu>
										{action.map(item => 
											<Menu.Item key={item} onClick={(e) => actionClick(e,record)}>{item}</Menu.Item>	
										)}
									</Menu>)
								return (
									<Dropdown overlay={menu} trigger={['click']}>
										<Button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
										Action <DownOutlined />
										</Button>
									</Dropdown>
		
								)
							}
						}]
					}
					dataSource={data}
					rowKey='id'
					loading={behavior === 'fetching'}
					// onRow={row => ({
					//   onClick: contentEdit ? () => openPopup(row) : () => {},
					// })}
					pagination={ 
						{
							current: Number(searchFields.offset) || undefined,
							pageSize: searchFields.limit || 20,
							pageSizeOptions: [10, 20, 30],
							total: total || data.length,
							disabled: behavior === 'fetching',
							position: ['topRight' , 'bottomRight']
						}
					}
					onChange = {
						Object.keys(searchFields).length === 0 ? () => {} :
							(pagination,f,s) => {
								console.log(f,s)
								let fs = {};
								if (Object.keys(s).length !== 0) {
									fs = { ...fs, ...{order: `${s.order ? s.field: 'id'}|${s.order ? s.order.slice(0, s.order.length-3): 'desc'}`}}
								}
								updateSF({offset: pagination.current, limit: pagination.pageSize, ...f, ...fs})
						} 
					}
					{...tableProps}
				> </Table>
			}
		</Card>
	]);
}

export default List;