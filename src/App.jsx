import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';

import { UserContext, ExerciseContext } from './context';
import { WithLoginOnly } from './helpers';

import { getRouterPaths } from './config/getPaths';

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'));

function App() {
  const paths = getRouterPaths();

  return (
    <UserContext>
      <ExerciseContext>
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
      </ExerciseContext>
    </UserContext>
  );
}
