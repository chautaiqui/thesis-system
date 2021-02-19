import React from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import * as utility from './utility';
import Input from 'antd/lib/input';
import { Button, Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
  defaultFilteredValue: [searchFields.name] || ['']
})

export { utility };