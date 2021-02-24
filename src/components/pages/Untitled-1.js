

    const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = clearFilters => {
		clearFilters();
		setSearchText("");
	};

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
			<Input
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
				style={{ width: 188, marginBottom: 8, display: 'block' }}
			/>
			<Space>
				<Button
				type="primary"
				onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
				icon={<SearchOutlined />}
				size="small"
				style={{ width: 90 }}
				>
				Search
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
				Reset
				</Button>
				<Button
				type="link"
				size="small"
				onClick={() => {
					confirm({ closeDropdown: false });
					this.setState({
					searchText: selectedKeys[0],
					searchedColumn: dataIndex,
					});
				}}
				>
				Filter
				</Button>
			</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
			? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
			: '',
		
            onFilterDropdownVisibleChange: visible => {
			if (visible) {
			// setTimeout(() => this.searchInput.select(), 100);
			}
		},
		render: text =>
			searchedColumn === dataIndex ? (
				text.toString()
			) : (
				text
			),
	});

// filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				// 	<div style={{ padding: 8 }}>
				// 	<Input
				// 		ref={(node) => {
				// 			input = node;
				// 		  }}
				// 		placeholder={`Search name`}
				// 		style={{ width: 188, marginBottom: 8, display: 'block' }}
				// 	/>
				// 	<Space>
				// 		<Button
				// 			type="primary"
				// 			onClick={() => {
				// 				// confirm();
				// 				_dispatch({ type: 'update_search_field', data: { ...searchFields, name: input.state.value} })
				// 			}}
				// 			icon={<SearchOutlined />}
				// 			size="small"
				// 			style={{ width: 90 }}
				// 		>
				// 			Search
				// 		</Button>
				// 	</Space>
				// 	</div>
				// ),
				// filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
				// filterDropdown: ({
				// 	setSelectedKeys,
				// 	selectedKeys,
				// 	confirm,
				// 	clearFilters
				//   }) => (
				// 	<div style={{ padding: 8 }}>
				// 	  <Input
				// 		placeholder={`Search name`}
				// 		value={selectedKeys[0]}
				// 		onChange={(e) =>
				// 		  setSelectedKeys(e.target.value ? [e.target.value] : [])
				// 		}
				// 		onPressEnter={() =>
				// 		  confirm()
				// 		}
				// 		style={{ width: 188, marginBottom: 8, display: "block" }}
				// 	  />
				// 	  <Space>
				// 		<Button
				// 		  type="primary"
				// 		  onClick={() => confirm()}
				// 		  icon={<SearchOutlined />}
				// 		  size="small"
				// 		  style={{ width: 90 }}
				// 		>
				// 		  Search
				// 		</Button>
				// 		<Button
				// 		  onClick={() => clearFilters()}
				// 		  size="small"
				// 		  style={{ width: 90 }}
				// 		>
				// 		  Reset
				// 		</Button>
				// 	  </Space>
				// 	</div>
				//   ),
				// filterIcon: (filtered) => (
				// <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
				// ),
				// defaultFilteredValue: [searchFields.name] || ['']



				import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
				import { fetchData, postData, putData } from '@api';
				
				import { User } from '@pkg/reducers';
				import Table from 'antd/lib/table';
				import Button from 'antd/lib/button';
				import Modal from 'antd/lib/modal';
				import { Tag, Input, Space} from 'antd';
				import { SearchOutlined } from '@ant-design/icons';
				
				import  { useLocation, useHistory  } from 'react-router-dom';
				import { messageError } from './';
				
				const reducer = (state, action) => {
				switch (action.type) {
					case 'FETCH_FETCHING':
					return { ...state, behavior: 'fetching' };
					case 'FETCH_SUCCESS':
					return { ...state, data: action.dataResponse.data, behavior: 'stall' };
					case 'FETCH_ERROR':
					messageError(action.error);
					return { ...state, data: [], behavior: 'stall' };
					case 'UPDATING':
					return { ...state, behavior: 'updating' };
					case 'UPDATE_SUCCESS':
					return { ...state, behavior: 'update_success' };
					case 'UPDATE_ERROR':
					messageError(action.error);
					case 'STALL':
					return { ...state, behavior: 'stall' };
					// case 'PAGINATION_CHANGE': 
					// return { ...state, meta: action.dataResponse, behavior: 'pagination_change' };
					default: return state;
				}
				}
				const initialState = { data: [], behavior: 'init' };
				
				const List = props => {
					const { fn, tColumns, editData, 
						contentEdit, onOpen, onOk,
						searchFields,
					} = props;
					const [ popup, setPopup ] = useState(false);
					const [ _state, _dispatch ] = useReducer(reducer, initialState);
					const [ user ] = useContext(User.context);
				
					// const { search } = useLocation();
					let history = useHistory();
				
				
					const fetch = useCallback(async () => {
						_dispatch({ type: 'FETCH_FETCHING' });
						try {
							const resp = await fetchData[fn](user.api_token, searchFields);
							const { success, result, error } = resp;
							if (!success) return _dispatch({ type: 'FETCH_ERROR', error: error })
							result.meta = Object.assign({}, result.meta, { order: result.meta.order.join('|') });
							// if (result.meta === undefined) {Object.assign(result, {meta: {}})}
							// updateSF(result.meta);
							_dispatch({ type: 'FETCH_SUCCESS', dataResponse: result }) 
						} catch (e) {
							_dispatch({ type: 'FETCH_ERROR', error: e });
						}
					}, [user.api_token, fn, _state, searchFields]);
				
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
							// _dispatch({ type: 'PAGINATION_CHANGE', dataResponse: searchFields });
							fetch();
							return;
						// case 'pagination_change':
						// 	fetch();
						// 	return;
						default: return () => _dispatch({ type: 'STALL' });
						}
					}, [_state.behavior, fetch, searchFields]);
				
					useEffect(() => {
						if (!editData) return;
						put();
					}, [editData, put]);
				
					console.log(searchFields)
					useEffect(() => {
						if (searchFields) fetch();
					}, [searchFields, fetch])
				
					const openPopup = (values, num) => {
						onOpen(values);
						setPopup(true);
					}
				
					var { data, behavior } = _state;
					// console.log(behavior, meta)
					return ([
						<div key='a1'>
							{/* <Tag> { searchText } </Tag> */}
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
						// pagination={ 
						// 	{
						// 		current: searchFields.offset || undefined,
						// 		pageSize: searchFields.limit || 20,
						// 		pageSizeOptions: [10, 20, 30],
						// 		total: searchFields.total || data.length,
						// 		disabled: _state.behavior === 'fetching',
						// 		position: ['topRight' , 'bottomRight']
						// 	}
						// }
						
						expandable={{
							expandedRowRender: record => (
							<p style={{ margin: 0 }}>{JSON.stringify(record)}</p>  
							)}}
						> </Table>
					]);
				}
				
				export default List;