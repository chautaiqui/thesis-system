import Flights from './flights';
import Campaigns from './campaigns';
import Permissions from './permissions';
import Creative from './creative';
import Roles from './roles';
// import Transactions from './transactions';

const subPages1 = [
  { path: '/campaigns', label: 'Campaigns', component: Campaigns, permissions: 'campaigns' },
  { path: '/flights', label: 'Flights', component: Flights, permissions: 'flights' },
  { path: '/creative', label: 'Creative', component: Creative, permissions: 'creative' },
  { path: '/permissions', label: 'Permissions', component: Permissions, permissions: 'permissions' },
  { path: '/roles', label: 'Roles', component: Roles, permissions: 'roles' },
  // { path: '/transactions', label: 'Transactions', component: Transactions, roles: 'transactions' }
];

export const routerPages = [...subPages1];

export const menuPages = [
  {
    label: 'manage system',
    children: subPages1
  }
];

