import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';

import { UserProvider as UserContext } from './context';
import { WithLoginOnly } from './helpers';

import { getRouterPaths } from './config/getPaths';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default App;

function App() {
  const paths = getRouterPaths();

  return (
    <UserContext>
      <CssBaseline />
      <Router>
        <Switch>
          {paths.map(({ path, component, isProtected }) =>
            isProtected ? (
              <Route key={path} path={path}>
                <WithLoginOnly signIn>{component}</WithLoginOnly>
              </Route>
            ) : (
              <Route key={path} path={path}>
                {component}
              </Route>
            )
          )}
        </Switch>
      </Router>
    </UserContext>
  );
}
