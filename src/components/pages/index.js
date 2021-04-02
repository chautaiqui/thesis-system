import React from 'react';

import { RocketOutlined, UsergroupAddOutlined, DashboardOutlined,
  AreaChartOutlined, TeamOutlined, ToolOutlined, HomeOutlined, SelectOutlined, GifOutlined
} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { Employee } from './employee';
import { Hotel } from './hotel';
import { Addemployee } from './addemployee';
import { Attendance } from './attendance';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/hotel', label: (<><DashboardOutlined style={{paddingLeft:10}}/> Hotel </>), component: Hotel, permissions: 'hotel' },
  { path: '/employee', label: (<><TeamOutlined style={{paddingLeft:10}}/> Employee </>), component: Employee, permissions: 'employee' },
  { path: '/addemployee', label: (<><UsergroupAddOutlined style={{paddingLeft:10}}/> Add Employee </>), component: Addemployee, permissions: 'add_employee' },
  { path: '/edithotel', label: (<><ToolOutlined style={{paddingLeft:10}}/> Edit Hotel </>), component: Todo, permissions: 'edit_hotel' },
  { path: '/room', label: (<><HomeOutlined style={{paddingLeft:10}}/> Room </>), component: Todo, permissions: 'room' },
  { path: '/formresquest', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Form Resquest </>), component: Todo, permissions: 'form_resquest' },
];
const subPages2 = [
  {path: '/booking', label: (<><SelectOutlined /> Booking </>), component: Todo, permissions: 'booking'},
  {path: '/voucher', label: (<><GifOutlined /> Voucher </>), component: Todo, permissions: 'voucher'},
];
const subPages3 = [
  {path: '/report', label: (<><AreaChartOutlined /> Inventory Report </>), component: Todo, permissions: 'report'},
];
const subPages4 = [
  {path: '/attendance', label: (<><GifOutlined /> Attendance </>), component: Attendance, permissions: 'attendance'},
];
export const routerPages = [...subPages1, ...subPages2, ...subPages3, ...subPages4];

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
  },
  {
    label: 'Employee',
    children: subPages4
  }
];

