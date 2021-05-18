import React from 'react';

import { RocketOutlined, UsergroupAddOutlined, DashboardOutlined,FileAddOutlined, LineChartOutlined,
  AreaChartOutlined, TeamOutlined, ToolOutlined, HomeOutlined, SelectOutlined, GifOutlined, 
  GiftOutlined, FieldTimeOutlined, GroupOutlined, UserOutlined, BarcodeOutlined, CalculatorOutlined
} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { Employee } from './employee';
import { Hotel } from './hotel';
import { Addemployee } from './addemployee';
import { AddHotel } from './addhotel';
import { Room } from './room';
import { Facility } from './facility';
import { Account } from './account';
import { WorkingShift } from './workingshift';
import { Attendance } from './attendance';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/hotel', label: (<><HomeOutlined style={{paddingLeft:10}}/> Hotel </>), component: Hotel, permissions: 'hotel' },
  { path: '/addhotel', label: (<><FileAddOutlined style={{paddingLeft:10}}/> Add Hotel  </>), component: AddHotel, permissions: 'add_hotel' },
  { path: '/inventoryreport', label: (<><AreaChartOutlined style={{paddingLeft:10}}/> Inventory Report </>), component: Todo, permissions: 'inventory_report'},
];
const subPages2 = [
  { path: '/employee', label: (<><TeamOutlined style={{paddingLeft:10}}/> Employee </>), component: Employee, permissions: 'employee' },
  { path: '/addemployee', label: (<><UsergroupAddOutlined style={{paddingLeft:10}}/> Add Employee </>), component: Addemployee, permissions: 'add_employee' },
  { path: '/edithotel', label: (<><ToolOutlined style={{paddingLeft:10}}/> Edit Hotel </>), component: Todo, permissions: 'edit_hotel' },
  { path: '/voucher', label: (<><GiftOutlined style={{paddingLeft:10}}/> Voucher </>), component: Todo, permissions: 'voucher'},
  { path: '/report', label: (<><LineChartOutlined style={{paddingLeft:10}}/> Report </>), component: Todo, permissions: 'report'},
];
const subPages3 = [
  { path: '/room', label: (<><HomeOutlined style={{paddingLeft:10}}/> Room </>), component: Room, permissions: 'room' },
  { path: '/facility', label: (<><GroupOutlined style={{paddingLeft:10}}/> Facility </>), component: Facility, permissions: 'facility' },
  { path: '/account', label: (<><UserOutlined style={{paddingLeft:10}} rotate={45}/> Account </>), component: Account, permissions: 'account' },
  { path: '/workingshift', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Working Shift </>), component: WorkingShift, permissions: 'working_shift' },
  { path: '/attendance', label: (<><BarcodeOutlined style={{paddingLeft:10}}/> Attendance </>), component: Attendance, permissions: 'attendance'},
  { path: '/formresquest', label: (<><RocketOutlined style={{paddingLeft:10}} rotate={45}/> Form Resquest </>), component: Todo, permissions: 'form_resquest' },
  { path: '/salary', label: (<><CalculatorOutlined style={{paddingLeft:10}}/> Salary </>), component: Todo, permissions: 'salary' },
  { path: '/booking', label: (<><SelectOutlined style={{paddingLeft:10}}/> Booking </>), component: Todo, permissions: 'booking'},
];

export const routerPages = [...subPages1, ...subPages2, ...subPages3];

export const menuPages = [
  {
    label: 'Admin',
    children: subPages1
  },
  {
    label: 'Manage',
    children: subPages2
  },
  {
    label: 'Employee',
    children: subPages3
  },
];

