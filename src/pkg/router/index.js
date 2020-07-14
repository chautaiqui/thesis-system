import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Layout from '@components/commons/layout';
import { routerPages } from '@components/pages';
import { User } from '@pkg/reducers';

const RouterContainer = () => {
  const [ _user ] = useContext(User.context);
  const roles = Array.isArray(_user.roles) ? _user.roles.slice(0) : [];

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          {routerPages.filter(p => roles.indexOf(p.roles) > -1).map(p => {
            return (
              <Route path={p.path} key={p.path}>
                <p.component />
              </Route>
            )
          })}
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
    <div>
      <h2>Home</h2>
    </div>
  );
}