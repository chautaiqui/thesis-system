import React, { useReducer, createContext } from 'react';

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const contextValue = useReducer((state, action) => {
    switch (action.type) {
      case 'LOGIN':
        (action.user && action.user.phone && localStorage.setItem('phone', action.user.phone));
        (action.user && action.user.token && localStorage.setItem('token', action.user.token));
        return action.user;
      case 'LOGOUT':
        localStorage.removeItem('phone');
        localStorage.removeItem('token');
        return {};
      default: return state;
    }
  }, {});
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
export const User = {
  context: UserContext,
  provider: Component => props => <UserProvider><Component {...props} /></UserProvider>
}