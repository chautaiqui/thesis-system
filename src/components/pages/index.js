import Plans from './plans';
import Flights from './flights';
import Permissions from './permissions';
import Roles from './roles';
import User from './user';
// import Users from './users';
// import Transactions from './transactions';

const subPages1 = [
  { path: '/plans', label: 'Plans', component: Plans, permissions: 'plans' },
  { path: '/flights', label: 'Flights', component: Flights, permissions: 'flights' },
  { path: '/permissions', label: 'Permissions', component: Permissions, permissions: 'permissions' },
  { path: '/roles', label: 'Roles', component: Roles, permissions: 'roles' },
  { path: '/user', label: 'User', component: User, permissions: 'user' },
  // { path: '/users', label: 'Users', component: Users, roles: 'users' },
  // { path: '/transactions', label: 'Transactions', component: Transactions, roles: 'transactions' }
];

export const routerPages = [...subPages1];

export const menuPages = [
  {
    label: 'manage system',
    children: subPages1
  }
];