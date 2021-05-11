import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';

import { UserProvider as UserContext } from './context';
import { Home, Profile, Words } from './pages';
import { WithLoginOnly } from './helpers';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default App;

function App() {
  return (
    <UserContext>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/words">
            <Words />
          </Route>
          <Route path="/profile">
            <WithLoginOnly signIn>
              <Profile />
            </WithLoginOnly>
          </Route>
          <Route path="">
            <WithLoginOnly signIn>
              <Home />
            </WithLoginOnly>
          </Route>
        </Switch>
      </Router>
    </UserContext>
  );
}
