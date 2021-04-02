import React, { useContext } from 'react';
import Login from './login';
import { User } from '@pkg/reducers';

const CurrentUser = props => {
  const { children } = props;
  const [ _user, dispatchUser ] = useContext(User.context);

  const onLogin = (user, email, password) => {
    dispatchUser({ user, email, password, type: 'LOGIN' });
  }
  return _user.role ? children : <Login onLogin={onLogin} />;
  // return children;
}

export default User.provider(CurrentUser);
