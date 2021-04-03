import React, { useReducer, createContext, useContext } from 'react';
// import { useHistory } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const contextValue = useReducer((state, action) => {
    switch (action.type) {
      case 'LOGIN':
        (action.email && localStorage.setItem('email', action.email));
        (action.password && localStorage.setItem('password', action.password));
        const _u = action.user || {};
        console.log(_u)
        // _u.roles = Array.isArray(_u.roles) ? _u.roles.slice(0) : [];
        // _u.permissions = _u.roles.reduce((res, role) => [...res, ...role.permissions], []);
        // _u.isAdmin = _u.roles.some(role => role.name.toLowerCase() === 'admin');
        // _u.api_token = action.api_token;
        // _u.role => [permissions]
        if(_u.role) {
          if(_u.role === 'admin') {
            _u.permissions = ['hotel', 'add_hotel', 'inventory_report', 'employee', 'add_employee', 'room', 'edit_hotel', 'booking', 'voucher', 'report', 'attendance', 'form_resquest', 'account', 'working_shift'];
          } else if (_u.role === 'employee') {
            _u.permissions = ['attendance', 'form_resquest', 'account', 'working_shift'];
          } else {
            _u.permissions = ['employee', 'add_employee', 'room', 'edit_hotel', 'booking', 'voucher', 'report'];
          }
        }
        return _u;
      case 'LOGOUT':
        localStorage.removeItem('email');
        localStorage.removeItem('password');
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
  // console.log(action)
  switch (action.type) {
    
    case 'init_search_field':
      return { ...state, searchFields: extractSearch(action.data)}
    case 'update_search_field':
      return { ...state, searchFields: action.data };
    case 'get_require_data': 
      return { ...state, requireData: { ...state.requireData, ...action.data }};
    case 'set_editdata': 
      return { ...state, editData: { ...state.editData, ...action.data }};
    case 'set_baseform': 
      return { ...state, baseForm: { ...state.baseForm, ...action.data }};
    case 'get_extend_data' :
      return { ...state, updateData: { ...state.updateData, ...action.data }}; 
    default:
      return state;
  } 
}


function extractSearch(search) {
	let query = {};
  query = search.slice(1).split('&').reduce(
    (r, i) => (!!i) ? Object.assign({}, r, { [i.split('=')[0]]: decodeURIComponent(i.split('=')[1]) }) : r, {}
  );
  if (!query.offset || query.offset < 0 ) query.offset = 1 
  if (!query.limit || [10, 20, 30].includes(query.limit)) query.limit = 20
  let re = /(\w)+\|(asc|desc)/;
  if (!re.test(query.order)) query.order = 'id|desc';
	return query;
}