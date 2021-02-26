import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Row, Col } from 'antd';

import Layout from '@components/commons/layout';
import { routerPages } from '@components/pages';
import { User } from '@pkg/reducers';
// TODO 
// 1. filter by permissions
const RouterContainer = () => {
  const [ _user ] = useContext(User.context);
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          {routerPages.filter(p =>_user.isAdmin || _user.permissions.indexOf(p.permissions) > -1).map(p => (
            // <Route path={`${p.path}/:param`} key={`${p.path}/:param`}>
            <Route path={p.path} key={p.path}>
              <p.component />
            </Route>
          ))}
          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default RouterContainer;

// You can think of these components as 'pages'
// in your app.

function Home() {
  return (
    <Row>
      <Col span={8}>col-8</Col>
      <Col span={8} offset={8}>
        col-8
      </Col>
    </Row>
  );
}
function NotFound() {
  return (
    <div>
      <h2>NotFound</h2>
    </div>
  );
}