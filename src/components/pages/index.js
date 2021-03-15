import React from 'react';

import Flights from './flights';
import Campaigns from './campaigns';
import Creative from './creative';
import Advertiser from './advertiser';
import Publisher from './publisher';

// import Transactions from './transactions';
import { ScheduleOutlined, RocketOutlined, StarOutlined, DashboardOutlined, GlobalOutlined,
  NotificationOutlined, GroupOutlined, BulbOutlined, HomeOutlined, DesktopOutlined, UserOutlined, SolutionOutlined, KeyOutlined,
  CompassOutlined, VideoCameraOutlined, BarChartOutlined, AreaChartOutlined, UploadOutlined
} from '@ant-design/icons';
const Todo = () => {
  return <h1>To Do</h1>
}

const subPages1 = [
  { path: '/dashboard', label: (<><DashboardOutlined /> Dashboard </>), component: Todo, permissions: 'dashboard' },
  { path: '/advertisers', label: (<><GlobalOutlined /> Advertisers </>), component: Advertiser, permissions: 'advertisers' },
  { path: '/campaigns', label: (<><ScheduleOutlined style={{paddingLeft:20}}/> Campaigns </>), component: Campaigns, permissions: 'campaigns' },
  { path: '/flights', label: (<><RocketOutlined style={{paddingLeft:20}} rotate={45}/> Flights </>), component: Flights, permissions: 'flights' },
  { path: '/creative', label: (<><StarOutlined style={{paddingLeft:20}} color={'#fff'}/> Creative </>), component: Creative, permissions: 'creative' },
  { path: '/publishers', label: (<><NotificationOutlined rotate={360}/> Publishers </>), component: Publisher, permissions: 'publishers' },
  { path: '/categories', label: (<><GroupOutlined style={{paddingLeft:20}}/> Categories </>), component: Todo, permissions: 'categories' },
  { path: '/source-providers', label: (<><BulbOutlined style={{paddingLeft:20}}/> Source Providers </>), component: Todo, permissions: 'source-providers' },
  { path: '/placements', label: (<><HomeOutlined style={{paddingLeft:20}}/> Placements </>), component: Todo, permissions: 'placements' },
  { path: '/webapps', label: (<><DesktopOutlined style={{paddingLeft:20}}/> Webapps </>), component: Todo, permissions: 'webapps' },
  { path: '/users', label: (<><UserOutlined /> Users </>), component: Todo, permissions: 'users' },
  { path: '/roles', label: (<><SolutionOutlined style={{paddingLeft:20}}/> Role </>), component: Todo, permissions: 'roles' },
  { path: '/permissions', label: (<><KeyOutlined style={{paddingLeft:20}}/> Permissions </>), component: Todo, permissions: 'permissions' },
  { path: '/provinces', label: (<><CompassOutlined /> Province </>), component: Todo, permissions: 'provinces' },
  { path: '/live-tv', label: (<><DesktopOutlined /> LiveTV </>), component: Todo, permissions: 'live-tv' },
  { path: '/live-channel', label: (<><VideoCameraOutlined style={{paddingLeft:20}}/> Live Channel </>), component: Todo, permissions: 'live-channel' },
];
const subPages2 = [
  {path: './campaign_report', label: (<><AreaChartOutlined /> Campaign Report </>), component: Campaigns, permissions: 'campaign_report'},
  {path: './inventory_report', label: (<><BarChartOutlined /> Inventory Report </>), component: Campaigns, permissions: 'inventory_report'}
];
const subPages3 = [
  {path: './medias', label: (<><UploadOutlined /> Medias </>), component: Campaigns, permissions: 'medias'},
];
export const routerPages = [...subPages1, ...subPages2];

export const menuPages = [
  {
    label: 'manage system',
    children: subPages1
  },
  {
    label: 'Statistics And Report',
    children: subPages2
  },
  {
    label: 'Tools',
    children: subPages3
  }
];

