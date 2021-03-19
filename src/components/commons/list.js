import React, { useEffect, useReducer, useCallback, useContext } from 'react';
import { fetchData, postData, putData } from '@api';

import { User } from '@pkg/reducers';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { Tag, Card } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ViewLogModal } from '../modal';
// import { Divider } from 'antd';

import  { useHistory  } from 'react-router-dom';
import { messageError } from './';
// import { isArguments } from 'lodash';

const showConfirm = (title, content, onOK) => {
	Modal.confirm({
		title: title,
		icon: <ExclamationCircleOutlined />,
		content: content,
		onOk() {
			onOK();
		},
	});
}

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
		case 'RELOAD':
			return { ...state, behavior: 'init' };
		default: return state;
	}
}
const initialState = { data: [], behavior: 'init'};

const List = React.forwardRef((props, ref) => {
	const { fn, tColumns, ableCreate = false,
		editData, contentEdit, popup = {}, togglePopup = () => {}, confirmPopup = () => {},  
		searchFields, updateSF = () => {}, resetSF = () => {}, /**/
		tableProps,	
		fieldsRequire = [], requireData = {}, /**/
		logData = {visible: false, title: "", data: []}, closeViewLog = () => {}, /**/	
	} = props;
	// const [ comfirm, setConfirm ] = useState(false);
	// const [ popup, setPopup ] = useState({open: false, title: ''});
	// const [ logData, setLogData] = useState({visible: false, title: "", data: []});
	const [ _state, _dispatch ] = useReducer(reducer, initialState);
	const [ user ] = useContext(User.context);
	React.useImperativeHandle(ref, () => ({
		
	}));
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
			console.log(typeof _fn)
			_dispatch({ type: 'UPDATE_SUCCESS', item: {} }); // only test, delete this line
			// const resp = await _fn(user.api_token, editData);
			// const { success, result, error } = resp;
			// // console.log(success, result, error)
			// if (!success) _dispatch({ type: 'UPDATE_ERROR', error: error })
			// else _dispatch({ type: 'UPDATE_SUCCESS', item: result });
		} catch (e) {
			_dispatch({ type: 'UPDATE_ERROR', error: e });
		}
	}, [fn, editData]);

	useEffect(() => {
		switch (_state.behavior) {
			case 'fetching':
			case 'stall':
				return ;
			case 'update_success':
				togglePopup({ open: false });
				fetch()
				return;
			case 'init': 
				// param here
				// _dispatch({ type: 'PAGINATION_CHANGE', dataResponse: searchFields });
				fetch();
				return;
			default: _dispatch({ type: 'STALL' });
		}   
	}, [_state.behavior, fetch, togglePopup]);

	useEffect(() => {
		if (!editData) return;
		put();
	}, [editData, put]);

	useEffect(() => {
		const abortController = new AbortController();
		if (searchFields) fetch();
	}, [searchFields, fetch])

	useEffect(()=> {
		const fetchRequire = async (fn, meta) => {
			try {
				const res = await fetchData[fn.includes('-') ? fn.replace('-', '') : fn](user.api_token, meta)
				const { success, result } = res;
				if (!success || !result || !Array.isArray(result.data)) return [];
				return result.data;
			} catch(e) {
				return [];
			}
		}

		fieldsRequire.forEach(async item => {
			if (!item.onChange) return;
			item.onChange(await fetchRequire(item.name, item.meta));
		})
	},[])

	var { data, behavior, total } = _state;
	// console.log(behavior, editData, popup, requireData)
	// console.log(logData.data)
	var filterSearchField = Object.entries(searchFields).filter(item => !['offset', 'limit', 'order', 'model'].includes(item[0]) && !!item[1]);
	return ([
		<Card 
		style={{
			borderRadius: 5,
			marginBottom: 15,
			boxSizing: 'border-box',
			display: filterSearchField.length === 0 ? 'none' : 'block'
		}}
		key='card1'>
			{	
				filterSearchField.map(item => {
					// map label, value
					let _n = M(item[0], item[1], requireData);
					return <Tag
						key={item[0]}
						closable
						onClose={e => {
							resetSF(item[0])
						}}
					>
						{`${_n[0]}: ${_n[1]}`}
					</Tag>
				})
			}
		</Card>,
		<Card 
			style={{
				borderRadius: 5,
				boxSizing: 'border-box'
			}}
			key='card2'
		>
			{
				// update thi co id
				ableCreate && (
					<Button
						key='btncreate'    
						type="primary"                          
						style={{ marginBottom: 0 }}
						onClick={() => {togglePopup({ open: true, title: `Create ${fn}`, option: 'create' })}}
						// onClick={() => console.log({ open: true, title: `Create ${fn}`, option: 'create' })}

					>
						Create
					</Button>
				)
			}
			{
				logData.visible && <ViewLogModal data={logData} onClose={closeViewLog}/>
			}
			{
				(contentEdit) && (
					<Modal 
						className={`${fn}`}
						centered
						closable={false}
						maskClosable={false}
						confirmLoading={behavior === 'posting'}
						title= {popup.title}
						key='modal_update_create'
						width='90%' 
						visible={popup.open}
						forceRender
						keyboard
						okText={(popup.option === 'update')? 'Update ' : 'Create'}
						onOk={()=>showConfirm('Confirm action',popup.title, confirmPopup) }
						cancelText='Close'
						onCancel={() => {togglePopup({...popup,...{open:false}}); _dispatch({ type: 'RELOAD' });}}
					>
						{contentEdit}
					</Modal>
					)
			}
			{
				<Table
					key='table'
					columns={tColumns}
					dataSource={data}
					rowKey='id'
					loading={behavior === 'fetching'}
					tableLayout='auto'
					// size='middle'
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
							position: ['topRight' , 'bottomRight'],
							responsive: true,
							showTotal: (total,range) => `${range.join('-')} of ${total} items`,
						}
					}
					onChange = {
						Object.keys(searchFields).length === 0 ? () => {} :
							(pagination,f,s) => {
								// console.log(f,s)
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
})

export default List;


const M = (l, v, data) => {
	// data.l 
	switch (l) {
		case 'account_id':
			return ['Advertiser', data.accounts ? data.accounts.filter(item => item.id === Number(v))[0].name : v];
		case 'activated':
			return ['Activated', v === 0 ? 'disable' : 'Enable'];
		
		default:
			return [l,v]
	}
}