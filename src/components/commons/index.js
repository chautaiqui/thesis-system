import React from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import * as utility from './utility';

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

export { utility };