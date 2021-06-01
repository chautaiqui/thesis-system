import React from 'react';

import { RocketOutlined, UsergroupAddOutlined, ContainerOutlined,FileAddOutlined, LineChartOutlined,
  AreaChartOutlined, TeamOutlined, ToolOutlined, HomeOutlined, SelectOutlined, GifOutlined, 
  GiftOutlined, FontColorsOutlined, GroupOutlined, UserOutlined, BarcodeOutlined, CalculatorOutlined
} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { Employee } from './employee';
import { Hotel } from './hotel';
import { AdminInfo } from './admin';
import { Blog } from './blog';
import { Addemployee } from './addemployee';
import { Manager } from './manager';
import { Room } from './room';
import { Facility } from './facility';
import { Account } from './account';
import { WorkingShift } from './workingshift';
import { Attendance } from './attendance';
import { Booking } from './booking';
import { Voucher } from './voucher';
import { Salary } from './salary';
import { Report } from './report';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/hotel', label: (<><HomeOutlined style={{paddingLeft:10}}/> Hotel </>), component: Hotel, permissions: 'hotel' },
  { path: '/manager', label: (<><TeamOutlined style={{paddingLeft:10}}/> Manager  </>), component: Manager, permissions: 'manager' },
  { path: '/admin', label: (<><FontColorsOutlined style={{paddingLeft:10}}/> Admin  </>), component: AdminInfo, permissions: 'admin' },
  { path: '/blog', label: (<><ContainerOutlined style={{paddingLeft:10}}/> Blog  </>), component: Blog, permissions: 'blog' },
  { path: '/inventoryreport', label: (<><AreaChartOutlined style={{paddingLeft:10}}/> Inventory Report </>), component: Todo, permissions: 'inventory_report'},
];                              
const subPages2 = [
  { path: '/employee', label: (<><TeamOutlined style={{paddingLeft:10}}/> Employee </>), component: Employee, permissions: 'employee' },
  { path: '/voucher', label: (<><GiftOutlined style={{paddingLeft:10}}/> Voucher </>), component: Voucher, permissions: 'voucher'},
  { path: '/report', label: (<><LineChartOutlined style={{paddingLeft:10}}/> Report </>), component: Report, permissions: 'report'},
];
const subPages3 = [
  { path: '/room', label: (<><HomeOutlined style={{paddingLeft:10}}/> Room </>), component: Room, permissions: 'room' },
  { path: '/facility', label: (<><GroupOutlined style={{paddingLeft:10}}/> Facility </>), component: Facility, permissions: 'facility' },
  { path: '/account', label: (<><UserOutlined style={{paddingLeft:10}} rotate={45}/> Account </>), component: Account, permissions: 'account' },
  { path: '/workingshift', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Working Shift </>), component: WorkingShift, permissions: 'working_shift' },
  { path: '/attendance', label: (<><BarcodeOutlined style={{paddingLeft:10}}/> Attendance </>), component: Attendance, permissions: 'attendance'},
  { path: '/booking', label: (<><SelectOutlined style={{paddingLeft:10}}/> Booking </>), component: Booking, permissions: 'booking'},
  { path: '/formresquest', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Form Resquest </>), component: Todo, permissions: 'form_resquest' },
  { path: '/salary', label: (<><CalculatorOutlined style={{paddingLeft:10}}/> Salary </>), component: Salary, permissions: 'salary' },
];

export const routerPages = [...subPages1, ...subPages2, ...subPages3];
export const menuPages = [...subPages1, ...subPages2, ...subPages3];

// export const menuPages = [
//   {
//     label: 'Admin',
//     children: subPages1
//   },
//   {
//     label: 'Manage',
//     children: subPages2
//   },
//   {
//     label: 'Employee',
//     children: subPages3
//   },
// ];

