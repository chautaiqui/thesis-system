import React from 'react';

import { RocketOutlined, UsergroupAddOutlined, ContainerOutlined,FileAddOutlined, LineChartOutlined,
  AreaChartOutlined, TeamOutlined, ToolOutlined, HomeOutlined, SelectOutlined, GifOutlined, 
  GiftOutlined, FontColorsOutlined, GroupOutlined, UserOutlined, BarcodeOutlined, CalculatorOutlined, AppstoreAddOutlined
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
import { HotelShift } from './hotelshift';
import { ConfirmLeave } from './confirmleave';
import { FormResquest } from './formresquest';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/hotel', icon: (<HomeOutlined />), label: "Hotel", component: Hotel, permissions: 'hotel' },
  { path: '/manager', icon:(<TeamOutlined />), label: "Manager", component: Manager, permissions: 'manager' },
  { path: '/admin', icon: (<FontColorsOutlined />), label: "Admin", component: AdminInfo, permissions: 'admin' },
  { path: '/blog', icon: (<ContainerOutlined />), label: "Blog", component: Blog, permissions: 'blog' },
  { path: '/inventoryreport', icon: (<AreaChartOutlined />), label: "Inventory Report", component: Todo, permissions: 'inventory_report'},
];                              
const subPages2 = [
  { path: '/employee', icon: (<TeamOutlined />), label: "Employee", component: Employee, permissions: 'employee' },
  { path: '/voucher', icon:(<GiftOutlined />), label: "Voucher", component: Voucher, permissions: 'voucher'},
  { path: '/report', icon: (<LineChartOutlined />), label: "Report", component: Report, permissions: 'report'},
  { path: '/hotelshift', icon: (<LineChartOutlined />), label: "Hotel Shift", component: HotelShift, permissions: 'hotelshift'},
  { path: '/confirmleave', icon:(<LineChartOutlined />), label: "Confirm Leave", component: ConfirmLeave, permissions: 'confirmleave'},
];
const subPages3 = [
  { path: '/room', icon: (<HomeOutlined />), label: "Room", component: Room, permissions: 'room' },
  { path: '/facility',icon: (<GroupOutlined />), label: "Facility", component: Facility, permissions: 'facility' },
  { path: '/account', icon: (<UserOutlined  rotate={45}/>), label: "Account", component: Account, permissions: 'account' },
  { path: '/workingshift', icon: (<RocketOutlined />), label: "Working Shift", component: WorkingShift, permissions: 'working_shift' },
  { path: '/attendance', icon: (<BarcodeOutlined />), label: "Attendance", component: Attendance, permissions: 'attendance'},
  { path: '/booking', icon: (<SelectOutlined />), label: "Booking", component: Booking, permissions: 'booking'},
  { path: '/formresquest', icon: (<AppstoreAddOutlined  rotate={45}/>), label: "Form Resquest", component: FormResquest, permissions: 'form_resquest' },
  { path: '/salary', icon: (<CalculatorOutlined /> ), label: "Salary", component: Salary, permissions: 'salary' },
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

