import React, { useReducer, createContext } from 'react';
// import { useHistory } from 'react-router-dom';

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const contextValue = useReducer((state, action) => {
    switch (action.type) {
      case 'LOGIN':
        (action.email && localStorage.setItem('email', action.email));
        (action.api_token && localStorage.setItem('api_token', action.api_token));
        const _u = action.user || {};
        _u.roles = Array.isArray(_u.roles) ? _u.roles.slice(0) : [];
        _u.permissions = _u.roles.reduce((res, role) => [...res, ...role.permissions], []);
        _u.isAdmin = _u.roles.some(role => role.name.toLowerCase() === 'admin');
        _u.api_token = action.api_token;
        return _u;
      case 'LOGOUT':
        localStorage.removeItem('email');
        localStorage.removeItem('api_token');
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

export const PageReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
    case 'init_search_field':
      return { ...state, searchFields: extractSearch(action.data) }
    case 'update_search_field': 
      return { ...state, searchFields: action.data };
    case 'reset_search_filter_field':
      delete state.searchFields[action.data];
      return state;
    default:
      return state;
  } 
}

function extractSearch(search) {
	let query = {};
  query = search.slice(1).split('&').reduce((r, i) => !!i ? Object.assign({}, r, { [i.split('=')[0]]: decodeURIComponent(i.split('=')[1]) }) : r, {});
  if (!query.offset || query.offset < 0 ) query.offset = 1 
  if (!query.limit || [10, 20, 30].includes(query.limit)) query.limit = 20
  let re = /(\w)+\|(asc|desc)/;
  if (!re.test(query.order)) query.order = 'id|desc';
	return query;
}