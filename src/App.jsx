import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import getRouterPaths from './config/getRouterPaths';
import { ExerciseContext, UserContext } from './context';
import { WithLoginOnly } from './helpers';
import { MainContextProvider, useMainContextSetup } from './context/main';

const theme = createTheme({});

const root = createRoot(document.getElementById('root'));
root.render(<App />);

function App() {
    const routes = getRouterPaths().map(({ path, component, isProtected }) => (
        <Route
            key={path}
            path={path}
            element={isProtected ? <WithLoginOnly signIn>{component}</WithLoginOnly> : component}
        />
    ));

    return (
        <MainContextProvider value={useMainContextSetup()}>
            <UserContext>
                <ExerciseContext>
                    <CssBaseline />
                    <ThemeProvider theme={theme}>
                        <Router>
                            <Routes>{routes}</Routes>
                        </Router>
                    </ThemeProvider>
                </ExerciseContext>
            </UserContext>
        </MainContextProvider>
    );
}
