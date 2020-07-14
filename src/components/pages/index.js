import Plans from './plans';
import Users from './users';
import Transactions from './transactions';

export const routerPages = [
  { path: '/plans', label: 'Plans', component: Plans, roles: 'plans' },
  // { path: '/users', label: 'Users', component: Users, roles: 'users' },
  // { path: '/transactions', label: 'Transactions', component: Transactions, roles: 'transactions' }
];

export const menuPages = [
  {
    label: 'manage system',
    children: routerPages
  }
];