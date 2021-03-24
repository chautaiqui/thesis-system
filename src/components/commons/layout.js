/* eslint no-extra-boolean-cast: 0 */

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';

import { menuPages } from '@components/pages'; 
import { User } from '@pkg/reducers';

const AdminLayout = props => {
  const { children } = props;
  const [ isShow, setIsShow ] = useState(true);
  const [ user, dispatchUser ] = useContext(User.context);

  const onLogout = () => dispatchUser({type: 'LOGOUT'});

  const subMenu = (
    <Menu 
      className='custom-header-menu'
      theme='dark'
    >
      <Menu.Item>
        <Button icon={<LogoutOutlined />} size='small' onClick={onLogout} className='button-noshadow'>Logout</Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Layout.Header className='custom-header'>
        <div className='logo'>
          <div className='logo-wrapper'>
            <div className='logo-content'>
              <div className='logo-img' />
              <div className='logo-text'>
                <span>CHM</span>
              </div>
              <div className='logo-switch'>
                <Switch checked={isShow} size='small' onChange={value => setIsShow(value)} />
              </div>
            </div>
          </div>
        </div>
        <Dropdown overlay={subMenu} className='custom-submenu' trigger={['click']}>
          <div>
            <UserOutlined />
            <span>{user ? user.name : ''}</span>
            <DownOutlined />
          </div>
        </Dropdown>
      </Layout.Header>
      <Layout>
        <Layout.Sider
          breakpoint='xl'
          width={220}
          trigger={null}
          onCollapse = {(collapse, type)=>{
            if (document.body.clientWidth <= 1200 && isShow) setIsShow(false)
            else if (document.body.clientWidth > 1200 && !isShow) setIsShow(true)
          }}
          className={`custom-siderbar ${!isShow?'hide-sidebar':''}`}
        >
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={window.location.pathname}
            // selectedKeys={[current]}
            // onClick={this.handleMenuClick}
          >
            {menuPages.map((menuItemGroup, menuItemGroupKey) => (
              <Menu.ItemGroup
                className='custom-header-group'
                key={menuItemGroupKey}
                title={menuItemGroup.label}
              >
                {menuItemGroup.children.filter(p => user.isAdmin || user.permissions.indexOf(p.permissions) > -1).map(menuItem => 
                  <Menu.Item
                    key={menuItem.path}
                  >
                    <Link to={menuItem.path} className={`sideMenuItem ${menuItem.className}`}>
                      {menuItem.label}
                    </Link>
                  </Menu.Item>
                )}
              </Menu.ItemGroup>
            ))}
          </Menu>
        </Layout.Sider>
        <Layout.Content className='custom-content'>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout;
