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
import {
    ExerciseContextProvider,
    LoginContextProvider,
    MainContextProvider,
    useExerciseContextSetup,
    useLoginContextSetup,
    useMainContextSetup,
} from './context';
import { WithLoginOnly } from './helpers';

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
            <LoginContextProvider value={useLoginContextSetup()}>
                <ExerciseContextProvider value={useExerciseContextSetup()}>
                    <CssBaseline />
                    <ThemeProvider theme={theme}>
                        <Router>
                            <Routes>{routes}</Routes>
                        </Router>
                    </ThemeProvider>
                </ExerciseContextProvider>
            </LoginContextProvider>
        </MainContextProvider>
    );
}
