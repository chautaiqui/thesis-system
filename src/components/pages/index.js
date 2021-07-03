import React from 'react';

import { RocketOutline, ContainerOutlined, LineChartOutlined, RocketOutlined, QrcodeOutlined,
  AreaChartOutlined, TeamOutlined, HomeOutlined, SelectOutlined, AppstoreAddOutlined,
  GiftOutlined, FontColorsOutlined, GroupOutlined, UserOutlined, BarcodeOutlined, CalculatorOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { Employee } from './employee';
import { Hotel } from './hotel';
import { AdminInfo } from './admin';
import { Blog } from './blog';
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
import { Qrcode } from './qrcode';
import { InventoryReport } from './inventory-report';
import { AdminEmployee } from './admin-employee';
import { AdminRoom } from './admin-room';
import { AdminFacility } from './admin-facility';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/inventoryreport', icon: (<AreaChartOutlined />), label: "Inventory Report", component: InventoryReport, permissions: 'inventory_report', role: 'admin'},
  { path: '/hotel', icon: (<HomeOutlined />), label: "Hotel", component: Hotel, permissions: 'hotel', role: 'admin' },
  { path: '/manager', icon:(<TeamOutlined />), label: "Manager", component: Manager, permissions: 'manager', role: 'admin' },
  { path: '/hotel-employee', icon:(<UserOutlined />), label: "Hotel Employee", component: AdminEmployee, permissions: 'hotel-employee', role: 'admin' },
  { path: '/hotel-room', icon:(<HomeOutlined />), label: "Hotel Room", component: AdminRoom, permissions: 'hotel-room', role: 'admin' },
  { path: '/hotel-facility', icon:(<GroupOutlined />), label: "Hotel Facility", component: AdminFacility, permissions: 'hotel-facility', role: 'admin' },
  { path: '/blog', icon: (<ContainerOutlined />), label: "Blog", component: Blog, permissions: 'blog', role: 'admin' },
  { path: '/admin', icon: (<FontColorsOutlined />), label: "Admin", component: AdminInfo, permissions: 'admin', role: 'admin' },
];                              
const subPages2 = [
  { path: '/report', icon: (<LineChartOutlined />), label: "Report", component: Report, permissions: 'report', role: 'manager'},
  { path: '/employee', icon: (<TeamOutlined />), label: "Employee", component: Employee, permissions: 'employee', role: 'manager' },
  { path: '/voucher', icon:(<GiftOutlined />), label: "Voucher", component: Voucher, permissions: 'voucher', role: 'manager'},
  { path: '/hotelshift', icon: (<AppstoreAddOutlined />), label: "Hotel Shift", component: HotelShift, permissions: 'hotelshift', role: 'manager'},
  { path: '/confirmleave', icon:(<CheckCircleOutlined />), label: "Confirm Leave", component: ConfirmLeave, permissions: 'confirmleave', role: 'manager'},
  { path: '/qrcode', icon:(<QrcodeOutlined />), label: "Qr Code", component: Qrcode, permissions: 'qrcode', role: 'manager'},
  { path: '/account', icon: (<UserOutlined  rotate={45}/>), label: "Account", component: Account, permissions: 'account', role: 'manager'},
];
const subPages3 = [
  { path: '/room', icon: (<HomeOutlined />), label: "Room", component: Room, permissions: 'room', role: 'manager' },
  { path: '/facility',icon: (<GroupOutlined />), label: "Facility", component: Facility, permissions: 'facility', role: 'manager' },
  { path: '/workingshift', icon: (<RocketOutlined />), label: "Working Shift", component: WorkingShift, permissions: 'working_shift' , role: 'employee'},
  { path: '/attendance', icon: (<BarcodeOutlined />), label: "Attendance", component: Attendance, permissions: 'attendance', role: 'employee'},
  { path: '/booking', icon: (<SelectOutlined />), label: "Booking", component: Booking, permissions: 'booking', role: 'employee'},
  { path: '/formresquest', icon: (<AppstoreAddOutlined  rotate={45}/>), label: "Form Resquest", component: FormResquest, permissions: 'form_resquest' , role: 'employee'},
  { path: '/salary', icon: (<CalculatorOutlined /> ), label: "Salary", component: Salary, permissions: 'salary' , role: 'employee'},
  { path: '/account', icon: (<UserOutlined  rotate={45}/>), label: "Account", component: Account, permissions: 'account' , role: 'employee'},

];

export const routerPages = [...subPages1, ...subPages2, ...subPages3];
export const menuPages = [...subPages1, ...subPages2, ...subPages3];

