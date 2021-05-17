import React, { useState} from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import * as utility from './utility';
import Input from 'antd/lib/input';
import { Button, Space} from 'antd';
import { SearchOutlined, DownOutlined, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import { Select, DatePicker, InputNumber, Row, Col, Radio, Switch } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
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
	filterIcon: () => {
		return (
		<SearchOutlined style={!!searchFields[dataIndex] ? { color: "#1890ff" }: {color: '#c0c0c0'}} />
		)},
	// filteredValue: searchFields[dataIndex] ? [searchFields[dataIndex]] : undefined,
	defaultFilteredValue: searchFields[dataIndex] ? [searchFields[dataIndex]] : undefined
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
							return;
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

export const filterCheck = (searchFields, dataIndex, options = [
	{
	  text: 'Enable',
	  value: '1',
	},
	{
	  text: 'Disable',
	  value: '0',
	},
  ]) => ({
	filters: options,
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
				[<Select 
					key='filter select'
					style={{ width: '100%' }}  tokenSeparators={[',']}
					allowClear
					showSearch
					placeholder= {`Search `}
					defaultValue={selectedKeys}
					onChange={(value) => {
						if (value) {
							setSelectedKeys(value.toString());
							confirm();
							return;
						}
						clearFilters();
					}}
					options={requireData ? requireData.map(item => ({label: item.name, value: item.id})) : []}
					filterOption={(inputValue, options) => {
						return options.label.toLowerCase().includes(inputValue.toLowerCase())
					}}
					notFoundContent={'Not Found'}
				/>,
				// [<CustomSelect
				// 	key='cus sel'
				// 	searchFields={searchFields}
				// 	dataIndex={dataIndex}
				// 	data={requireData} 
				// 	dataIndex={dataIndex} 
				// 	confirm={confirm} 
				// 	setSelectedKeys={setSelectedKeys} 
				// 	clearFilters={clearFilters}
				// />,
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

// select filter
export const CustomSelect = (props) => {
	const { data, confirm, setSelectedKeys, clearFilters, labelPropName='name', valuePropName ='id' } = props;
	const [search, setSearch] = useState('');
	let temp = data.filter(item => item.name.includes(search)).length === 0 ? data : data.filter(item => item.name.includes(search));
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
				options={temp.map(item => ({label: item[labelPropName], value: item[valuePropName]}))}
			>
				{/* {temp1.map(d => (
					<Option key={d.id}>{d.name}</Option>
				))} */}
			</Select>
		</div>

	)

}

export const MultiSelect = (props) => {
	const { maxTag, listValue, placeholder, onChange, value = [] } = props;
	const [selected, setSelected] = useState(value?value:[]);

	let showTag = false;
	if (selected.length > maxTag) showTag = true;
	console.log(selected)
	React.useEffect(() => {
		if (onChange) {
		  	onChange(selected);
		}
	}, [selected, onChange]);
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
	const {label='', value, onChange} = props;
	const [number, setNumber] = useState(value);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(number);
		}
	}, [number, onChange]);

	return (
		<div>
			<InputNumber
				value={number}
				style={{width: '60%'}}
				formatter={value => formatter.format(value.replace(/\D+/g, ""))}
				parser={value => value.replace(/\D+/g, "")} // \D ko phai ki tu so
				onChange={value=>setNumber(Number(value))}
			/>
			{label && (<label style={{fontWeight: 'normal', marginLeft: 10}}>{label}</label>)}
		</div>
		
	)
}

export const RadioGroup = (props) => {
	const {value, onChange, data} = props;
	const [choose, setChoose] = useState(value?value:undefined);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(choose);
		}
	}, [choose, onChange]);
	return (
		<Radio.Group onChange={e=>setChoose(e.target.value)} value={choose}>
			{data.map(item => 
				<Radio style={{display:'block'}} value={item.value} key={item.value}>{item.label}</Radio>
			)}
		</Radio.Group>	
	)
}

export const ListDateRangePicker = (props) => {
	const {value = [], onChange, editable} = props;
	// const _v = value? Object.values({...value[0],...{key:null}}).filter(item=> item !== null):[];
	const [choose, setChoose] = useState(value);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(choose);
		}
	}, [choose, onChange]);
	const ActionDate = (idx, key) => {
		switch (key) {
			case 0: {
				//del
				setChoose(choose.filter((item, index)=>index!==idx))
				break;
			}
			case 1: {
				//add
				let check = false;
				choose.map(item=>{
					if (item.from === undefined || item.to === undefined) {check = true}
					return item;
				})
				if (check) return;
				setChoose([...choose, {from: undefined,to: undefined}]);
				break;
			}
			default:
				return;
		}
	}
	const UpdateDate = (e, index) => {
		const newDate = e.map(item=> item.format('YYYY-MM-DD'));
		setChoose(prev => prev.map((item, idx) => idx === index ? {to: newDate[1], from: newDate[0]} : item));
	}
 	const disabledDate = (current, index) => {
		// Can not select days before today and today
		let compare = false; // moment().startOf('day')
		// compare moment(choose[index-1].from)
		if (index === 0) {
			// nothing 
		} else {
			compare = moment(choose[index-1].to, 'YYYY-MM-DD').isAfter(moment().startOf('day'));
		}
		const _d = compare ? moment(choose[index-1].to).add('days', 1) : moment().startOf('day');
		return current && current < _d;
	}
	return (
		<div>
			{
				choose.map((item, index) => {
					return (
						<div key={index} style={{marginBottom:3}}>
							<RangePicker 
								separator={'-'}
								value={[item.from?moment(item.from, 'YYYY-MM-DD'):undefined, item.to?moment(item.to, 'YYYY-MM-DD'):undefined]}
								format={'YYYY-MM-DD'}
								onChange={(e=>UpdateDate(e, index))}
								allowClear={false}
								style={{width:'80%',marginBottom:5}}
								disabled={editable === 0 ? true : false} 
								disabledDate={current => disabledDate(current, index)}
							/>
							<Button 
								icon={<MinusOutlined />}
								shape={'circle'}
								style={{float: 'right', display: 'inline-block', color: 'red', background: 'white', border: '1px solid red'}}
								onClick={(e) => {ActionDate(index, 0)}}
							/>
						</div>
					)
				})
			}
			<Button 
				icon={<PlusOutlined />}
				shape={'circle'}
				style={{float: 'right', display: 'inline-block', color: 'green', background: 'white', border: '1px solid green'}}
				onClick={(e) => {ActionDate(1, 1)}}
			/>
		</div>
	)
}

export const CustomSwitch = (props) => {
	const {value = [], onChange} = props;
	const [choose, setChoose] = useState(value);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(choose);
		}
	}, [choose, onChange]);
	return <Switch checked={choose===1?true:false} onChange={v=>setChoose(Number(v))}/>
}
export const CustomSelectObj = (props) => {
	const {value = {}, onChange, data, notFound='', disabled} = props;
	// data: label, obj
	// console.log(value)
	const [choose, setChoose] = useState(value.id);
	React.useEffect(() => {
		if (onChange) {
		  	onChange(choose);
		}
	}, [choose, onChange]);
	return <Select 
		disabled={disabled}
		allowClear
		showSearch
		options={data}
		filterOption={(inputValue, options) => {
			return options.label.toLowerCase().includes(inputValue.toLowerCase())
		}}
		value={choose}
		onChange={v=>setChoose(v)}
		notFoundContent={notFound}
	/>
	// return <div></div>
}

export const MultiInput = props => {
	const { value = [], onChange = () => {} , label = []} = props;
	const [newValue, setNewValue] = useState(value);
	
	React.useEffect(() => {
		if (onChange) {
		  	onChange(newValue);
		}
	}, [newValue, onChange]);

	const onChangeNumber = (value, index) => {
		newValue[index] = Number(value);
		setNewValue(newValue);
	}
	return (
		<div style={{display: 'inline-flex'}}>
			{newValue.map((item, index) => {
				return <CustomInputNumber value={item} label={label[index]} key={index} onChange={v=>onChangeNumber(v, index)}/>
			})}
		</div>
	)
}


function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
	  message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
	  message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
export const UploadImage = (props) => {
	const { onChange = ()=>{} } = props;
	const [ img, setImg ] = React.useState({loading: false, url:[]});

	const upload = async (options) => {
		const { file } = options;
		console.log(file)
		const data = new FormData();
		data.append('file', file);
		data.append('upload_preset', 'hotelmanager');

		setImg(v => ({v, loading: true}));

		const res = await fetch('https://api.cloudinary.com/v1_1/fpt-telecom/image/upload',{
			method: 'POST',
			body: data
		})
		const _file = await res.json();

		// setImg(v=>({loading: false, url: v.url.push(_file.secure_url)}))
		setImg({loading: false, url: [...img.url, {url:_file.secure_url, name: _file.original_filename}]})

	}
	React.useEffect(()=>{
		onChange(img.url)
	}, [img])
	console.log(img)
	return (
		<>
		<Upload
			name="avatar"
			listType="picture-card"
			className="avatar-uploader"
			showUploadList={false}
			customRequest={upload}
			beforeUpload={beforeUpload}
		>
			{
			<div>
				{img.loading ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
			}
		</Upload>
		{
			img.url && img.url.map((item, index) => (
			<Row key={index}>
				<Col>{item.name}</Col>
				<Col><Button size="small" onClick={()=>{
				const t = img.url.filter(i => i.name !== item.name)
				setImg(v=>({v, url: t}))
				}}><DeleteOutlined /></Button></Col>
			</Row>
			))
		}
		</>
	)
}



export const CustomUpload = (props) => {
	const [imgs, setImgs] = useState([])
	const { onChange = () => {} } = props;
	
	const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  React.useEffect(()=>{
		onChange(imgs);
	},[imgs])
  const upload = async (options) => {
		const { file } = options;
		setImgs([...imgs, file]);
	}
	console.log(imgs)
	return <><Upload
		name="avatar"
		listType="picture-card"
		className="avatar-uploader"
		showUploadList={false}
		customRequest={upload}
		beforeUpload={beforeUpload}
	>
		{
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
		}
	</Upload>
	{imgs.length !==0 && (<div>
		{
			imgs.map((item, index) => {
				return <div key={index}>
					<p>{item.name}</p>
					<Button
						size="small" 
						onClick={()=>{
							var newImgs = imgs.filter(i => i.uid !== item.uid)
							setImgs(newImgs)
						}}><DeleteOutlined /></Button>
				</div>
			})
		}
	</div>)}
	</>
}
export { utility };