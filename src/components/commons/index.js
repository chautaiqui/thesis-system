import React, { useState} from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import * as utility from './utility';
import Input from 'antd/lib/input';
import { Button, Space} from 'antd';
import { SearchOutlined, DownOutlined} from '@ant-design/icons';
import { Select, DatePicker, InputNumber, Row, Col, Radio } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const formatter = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	unitDisplay: 'narrow'
})
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

export const MultiSelect = (props) => {
	const { maxTag, listValue, placeholder, onChange, value = [] } = props;
	const [selected, setSelected] = useState(value?value:[]);

	let showTag = false;
	if (selected.length > maxTag) showTag = true;
	// console.log(JSON.stringify(selected))
	React.useEffect(() => {
		if (onChange) {
		  	onChange(selected);
		}
	}, [selected]);
	return (
		<Select 
			mode={'multiple'}
			placeholder={placeholder}
			value={selected}
			optionLabelProp="label"
			onChange={(e)=>{
				if (e.length > listValue.length) {
					setSelected([]);
				} else {
					if (e.includes('all')) {
						setSelected(listValue.map(item=>item.value));
				}
					else {
						setSelected(e); 
					}
				}
			}}
			maxTagCount={showTag ? 0 : maxTag}
			// lst [0,1,2,...24]
			maxTagPlaceholder={`${selected.length === listValue.length ? 'All' : selected.length} selected`}
		>
			<Option key={'all'} value='all' label='Select All'>Select All</Option>
			{listValue.map(item => 
				<Option key={item.value} value={item.value} label={item.label}>
					{item.label}
				</Option>
				
			)}
		</Select>
	)
}

export const CustomInputNumber = (props) => {
	const {label, value, onChange} = props;
	const [number, setNumber] = useState(value?value:undefined);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(number);
		}
	}, [number]);

	return (
		<Row>
			<Col span={12}>
				<InputNumber
					defaultValue={number}
					style={{width: '100%', textAlign: 'right'}}
					formatter={value => formatter.format(value.replace(/,/g, ""))}
					parser={value => value.replace(/\D+/g, "")} // \D ko phai ki tu so
					onChange={value=>setNumber(value)}
				/>
			</Col>
			<Col span={12} offset={8}><span>{label}</span></Col>
		</Row>
		
	)
}

export const RadioGroup = (props) => {
	const {value, onChange, data} = props;
	const [choose, setChoose] = useState(value?value:undefined);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(choose);
		}
	}, [choose]);
	return (
		<Radio.Group onChange={e=>setChoose(e.target.value)} value={choose}>
			{data.map(item => 
				<Radio style={{display:'block'}} value={item.value} key={item.value}>{item.label}</Radio>
			)}
		</Radio.Group>	
	)
}

export const DateRangePicker = (props) => {
	const {value = [], onChange, editable} = props;
	console.log(editable)
	// const _v = value? Object.values({...value[0],...{key:null}}).filter(item=> item !== null):[];
	const [choose, setChoose] = useState([]);
	React.useEffect(() => {
		if (onChange) {
			console.log(choose.map(item=>item._i))
		  	onChange(choose.map(item=>item._i));
		}
	}, [choose]);
	return (value.map((item, index) =>
		<RangePicker 
			separator={'-'}
			// value={choose.map(item=>moment(item, 'YYYY-MM-DD'))}  
			value={[item.from?moment(item.from):undefined, moment(item.to)]}
			format={'YYYY-MM-DD'}
			onChange={(e=>setChoose(e))}
		/>
		// <span >hello</span>
	))
}
export { utility };