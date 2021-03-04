import React, { useState} from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import * as utility from './utility';
import Input from 'antd/lib/input';
import { Button, Space} from 'antd';
import { SearchOutlined, DownOutlined} from '@ant-design/icons';
import { Select, DatePicker } from 'antd';
const { Option } = Select;


export const messageError = msg => {
if (msg) {
	let content;
	switch (typeof msg) {
	case 'string': 
		content = msg;
		break;
	case 'object':
		content = (
		<div>
			{
			Object.keys(msg).map((key, index) => (
				<div key={index}>
				- {key}: {msg[key]}
				</div>
			))
			}
		</div>
		);
		break;
	default:
		content = JSON.stringify(msg)
		break;
	}
	return notification.error({
	message: 'Something wrong happened.',
	description: content,
	duration: 5
	})
}
	
return message.error('Something wrong happened.');
}

export const messageSuccess = msg => {
return message.success(msg || 'Action successfully completed.');
}

export const filerColumn = (searchFields, dataIndex) => ({
	filterDropdown: ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters
		}) => (
		<div style={{ padding: 8 }}>
			<Input
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={(e) =>
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}
				onPressEnter={() =>
					confirm()
				}
				style={{ width: 188, marginBottom: 8, display: "block" }}
			/>
			<Space>
			<Button
				type="primary"
				onClick={() => confirm()}
				icon={<SearchOutlined />}
				size="small"
				style={{ width: 90 }}
			>
				Search
			</Button>
			<Button
				onClick={() => clearFilters()}
				size="small"
				style={{ width: 90 }}
			>
				Reset
			</Button>
			</Space>
		</div>
		),
	filterIcon: (filtered) => (
		<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
		),
	filteredValue: searchFields[dataIndex] || null,
	// defaultFilteredValue: [searchFields[dataIndex]] || []
})

export const filterSelectCheck = (searchFields, dataIndex) => {
	return {
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
			}) => (
				<Select
					allowClear
					placeholder={"All"}
					options={[{label: 'Diable', value: 0}, {label: 'Enable', value: 1}]}
					onChange={(v, l)=>{
						if(l) {
							console.log(v,l)
							setSelectedKeys(l.value);
							confirm();
						}
						clearFilters();						
					}}
				/>
		),
		filterIcon: (filtered) => (
			<DownOutlined style={{ color: filtered ? "#1890ff" : undefined }}/>
		),
		filteredValue: searchFields[dataIndex] || null,
		filterMultiple: false,
	}
}

export const filterCheck = (searchFields, dataIndex) => ({
	filters: [
		{
		  text: 'Enable',
		  value: '1',
		},
		{
		  text: 'Disable',
		  value: '0',
		},
	  ],
	filteredValue: searchFields[dataIndex] || null,
	filterMultiple: false,
})

export const filterSelect = (searchFields, dataIndex, requireData) => {
	// const data = requireData ? requireData.map(item=>item.name) : []
	return {
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
			}) => (
				[<CustomSelect
					key='cus sel'
					searchFields={searchFields}
					dataIndex={dataIndex}
					data={requireData} 
					dataIndex={dataIndex} 
					confirm={confirm} 
					setSelectedKeys={setSelectedKeys} 
					clearFilters={clearFilters}
				/>,
				<Button
					key='rs'
					onClick={() => clearFilters()}
					size="small"
					style={{ width: 100 }}
				>
					Reset
				</Button>]
		),
		filterIcon: (filtered) => (
			<DownOutlined style={{ color: filtered ? "#1890ff" : undefined }}/>
		),
		filteredValue: searchFields[dataIndex] || null,
	}
}

export const filterDatePicker = (searchFields, dataIndex) => {
	return {
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
			}) => (
				<DatePicker onChange={(date, dateString) => {
					if(dateString) {
						setSelectedKeys(dateString);
						confirm();
					}
					clearFilters();
				}}/>
		),
		filterIcon: (filtered) => (
			<DownOutlined style={{ color: filtered ? "#1890ff" : undefined }}/>
		),
		filteredValue: searchFields[dataIndex] || null,
	}
}

export const CustomSelect = (props) => {
	const { data, confirm, setSelectedKeys, clearFilters } = props;
	const [search, setSearch] = useState('');
	let temp = data.filter(item => item.name.includes(search)).length === 0 ? data : data.filter(item => item.name.includes(search));
	const temp1 = temp.map(item => ({name: item.name, id: item.id}));
	// console.log(searchFields[dataIndex] ? searchFields[dataIndex] : 'k co')
	return (
		<div>
			<Select 
				style={{ width: '100%' }}  tokenSeparators={[',']}
				onSearch={(v) => {
					setSearch(v)
				}}
				allowClear
				showSearch
				placeholder= {`Search `}
				onChange={(value) => {
					if (value) {
						// value -> account_id
						// console.log(data.filter(item => item.name === value)[0])
						console.log(value)
						setSelectedKeys(value)
						confirm();
						return;
					}
					clearFilters();
				}}
			>
				{temp1.map(d => (
					<Option key={d.id}>{d.name}</Option>
				))}
			</Select>
		</div>

	)
}


export { utility };