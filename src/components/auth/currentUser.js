import React, { useContext } from 'react';
import Login from './login';
import { User } from '@pkg/reducers';

const CurrentUser = props => {
  const { children } = props;
  const [ _user, dispatchUser ] = useContext(User.context);

  const onLogin = (user, email, api_token) => {
    dispatchUser({ user, email, api_token, type: 'LOGIN' });
  }
  return _user.roles ? children : <Login onLogin={onLogin} />;
}

export default User.provider(CurrentUser);
