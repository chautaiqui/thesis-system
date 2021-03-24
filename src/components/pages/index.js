import React from 'react';

import { RocketOutlined, UsergroupAddOutlined, DashboardOutlined,
  AreaChartOutlined, TeamOutlined, ToolOutlined, HomeOutlined, SelectOutlined, GifOutlined
} from '@ant-design/icons';

import { Employee } from './employee';
import { Addemployee } from './addemployee';
const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/dashboard', label: (<><DashboardOutlined style={{paddingLeft:10}}/> Dashboard </>), component: Todo, permissions: '' },
  { path: '/employee', label: (<><TeamOutlined style={{paddingLeft:10}}/> Employee </>), component: Employee, permissions: '' },
  { path: '/2', label: (<><UsergroupAddOutlined style={{paddingLeft:10}}/> Add Employee </>), component: Addemployee, permissions: '' },
  { path: '/3', label: (<><ToolOutlined style={{paddingLeft:10}}/> Edit Hotel </>), component: Todo, permissions: '' },
  { path: '/4', label: (<><HomeOutlined style={{paddingLeft:10}}/> Room </>), component: Todo, permissions: '' },
  { path: '/5', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Form Resquest </>), component: Todo, permissions: '' },
];
const subPages2 = [
  {path: '/7', label: (<><SelectOutlined /> Booking </>), component: Todo, permissions: ''},
  {path: '/8', label: (<><GifOutlined /> Voucher </>), component: Todo, permissions: ''},
];
const subPages3 = [
  {path: '/9', label: (<><AreaChartOutlined /> Inventory Report </>), component: Todo, permissions: ''},
];
export const routerPages = [...subPages1, ...subPages2];

export const menuPages = [
  {
    label: 'Manage Empoyee',
    children: subPages1
  },
  {
    label: 'Manage Booking',
    children: subPages2
  },
  {
    label: 'Report',
    children: subPages3
  }
];

