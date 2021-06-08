import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { DownOutlined, LogoutOutlined, UserOutlined, MenuUnfoldOutlined, PlayCircleOutlined, MenuOutlined,
  MenuFoldOutlined } from '@ant-design/icons';

import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';
import { Avatar, Grid } from 'antd';
import { menuPages } from '@components/pages'; 
import { User } from '@pkg/reducers';

const { useBreakpoint } = Grid;

const breakPoint = (obj) => {
  const arr = Object.entries(obj).reverse();
  const temp = arr.filter((item) => item[1] === true);
  return temp[0] ? temp[0][0] : "xxl";
};
const { Header, Footer, Sider, Content } = Layout;
const logo = 'https://ads-cdn.fptplay.net/static/banner/2021/06/96d6f2e7e1f705ab5e59c84a6dc009b2_3013.png';
const AdminLayout = props => {
  const { children } = props;
  const [ isShow, setIsShow ] = useState(false);
  const [ user, dispatchUser ] = useContext(User.context);
  const history = useHistory();
  const screens = useBreakpoint();
  const breakP = breakPoint(screens);
  const { name, email, img } = user.auth;
  const onLogout = () => {dispatchUser({type: 'LOGOUT'}); history.push('/')}
  const toggle = () => {setIsShow(!isShow)};

  const onProfile = () => {
    switch (user.role) {
      case "admin":
        history.push('admin')
        return;
      case "employee":
        history.push('account')
        return;
      case "manager":
        history.push('account')
        return;
      default:
        break;
    }
  }

  const subMenu = (
    <Menu >
      <Menu.Item onClick={onProfile}>
        <Avatar src={img}/> {name}
      </Menu.Item>
      <Menu.Item>
        <Button icon={<LogoutOutlined />} size='small' onClick={onLogout} className='button-noshadow'>Logout</Button>
      </Menu.Item>
    </Menu>
  )
  
  return (
    <>
      <Layout>
        <Sider 
          trigger={null} collapsible collapsed={isShow}
          breakpoint='xl'
          width={250}
          className="custom-layout-sider-menu"
          onCollapse = {(collapse, type)=>{
            if (document.body.clientWidth <= 1200 && !isShow) toggle()
            else if (document.body.clientWidth > 1200 && isShow) toggle()
          }}
        >
          <div className="custom-logo-sider-container">
            <img src={logo} alt="" style={{maxHeight: '100%'}}/>
            {!isShow && (<h1 className="custom-header-title">Hotel System</h1>)}
          </div>
          <Menu
            theme='dark'
            defaultSelectedKeys={window.location.pathname}
            className="custom-sider-menu"
          >
            {menuPages.filter(p => user.permissions.indexOf(p.permissions) > -1).map(menuItem => 
            // {menuItemGroup.children.map(menuItem => 
              <Menu.Item
                key={menuItem.path}
              >
                <Link to={menuItem.path} className={`sideMenuItem ${menuItem.className}`}>
                  <div style={{paddingLeft: isShow ? 0 : 15}}>{ menuItem.icon } {!isShow && menuItem.label} </div>
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="custom-site-layout-background">
            {React.createElement(isShow ? MenuUnfoldOutlined : MenuFoldOutlined, {
              onClick: toggle,
            })}
          <div className="custom-header-menu">
            <div className="custom-header-menu-sub">
              {breakP !== "xs" ? 
                (<><div style={{marginLeft: 10, cursor: "pointer"}} onClick={onProfile}><Avatar src={img}/> {name}</div>
                <div style={{marginLeft: 30, cursor: "pointer"}} onClick={onLogout}><PlayCircleOutlined /> Logout</div>
                </>) : (<div>
                <Dropdown overlay={subMenu} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  <MenuOutlined />
                  </a>
                </Dropdown>
              </div>)
              }
            </div>

          </div>  
          </Header>
          <Content
            className="custom-content"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AdminLayout;
