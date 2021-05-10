import React from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline } from '@material-ui/core';

import { UserProvider as UserContext } from './context';
import { Home } from './pages';
import { WithLoginOnly } from './helpers';

export default App;

function App() {
  return (
    <UserContext>
      <CssBaseline />
      <WithLoginOnly signIn>
        <Home />
      </WithLoginOnly>
    </UserContext>
  );
}
