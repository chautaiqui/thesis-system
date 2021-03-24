import React from 'react';

import { ScheduleOutlined, RocketOutlined, StarOutlined, DashboardOutlined, GlobalOutlined,
  NotificationOutlined, GroupOutlined,BarChartOutlined, AreaChartOutlined, UploadOutlined
} from '@ant-design/icons';
const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/dashboard', label: (<><DashboardOutlined /> Dashboard </>), component: Todo, permissions: 'dashboard' },
  { path: '/advertisers', label: (<><GlobalOutlined /> Advertisers </>), component: Todo, permissions: 'advertisers' },
  { path: '/campaigns', label: (<><ScheduleOutlined style={{paddingLeft:20}}/> Campaigns </>), component: Todo, permissions: 'campaigns' },
  { path: '/flights', label: (<><RocketOutlined style={{paddingLeft:20}} rotate={45}/> Flights </>), component: Todo, permissions: 'flights' },
  { path: '/creative', label: (<><StarOutlined style={{paddingLeft:20}} color={'#fff'}/> Creative </>), component: Todo, permissions: 'creative' },
  { path: '/publishers', label: (<><NotificationOutlined rotate={360}/> Publishers </>), component: Todo, permissions: 'publishers' },
  { path: '/categories', label: (<><GroupOutlined style={{paddingLeft:20}}/> Categories </>), component: Todo, permissions: 'categories' },
  
];
const subPages2 = [
  {path: './campaign_report', label: (<><AreaChartOutlined /> Campaign Report </>), component: Todo, permissions: 'campaign_report'},
  {path: './inventory_report', label: (<><BarChartOutlined /> Inventory Report </>), component: Todo, permissions: 'inventory_report'}
];
const subPages3 = [
  {path: './medias', label: (<><UploadOutlined /> Medias </>), component: Todo, permissions: 'medias'},
];
export const routerPages = [...subPages1, ...subPages2];

export const menuPages = [
  {
    label: 'manage',
    children: subPages1
  },
  {
    label: 'Employee',
    children: subPages2
  },
  {
    label: 'Tools',
    children: subPages3
  }
];

