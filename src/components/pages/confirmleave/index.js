import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { _getRequest } from '@api';
import { messageError } from '../../commons';
const initState = {
  data: [],
  behavior: 'init'
}; 

export const ConfirmLeave = props => {
  const [ state, setState ] = useState(initState);
  const [ user ] = useContext(User.context);
  const getData = async() => {
    const res = await _getRequest(`hotel/leave-form/${user.auth.hotel}`);
    if(res.success) {
      setState({
        data: res.result,
        behavior: 'init'
      })
    } else {
      messageError(res.error);
    }
  }

  useEffect(()=>{
    switch (state.behavior) {
      case 'init':
        getData();
        return;
      case 'stall':
        return ;
      default:
        break;
    }
  }, [state.behavior]);
  return <>
    Confirm leave
  </>
}