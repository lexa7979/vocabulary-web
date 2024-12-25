import { Box, Container } from '@mui/material';
import React from 'react';

import { DRAWER_WIDTH } from './BaseLayoutDrawer';
import getTransition from './getTransition';
import Copyright from './Copyright';
import { useMainContext } from '../context/main';

export default BaseLayoutMain;

/**
 * @typedef IBaseLayoutMainProps
 * @prop {boolean} [hasMainContainer]
 * @prop {React.ReactNode} [children]
 */

/** @param {IBaseLayoutMainProps} props */
function BaseLayoutMain({ hasMainContainer, children }) {
    const { isDrawerOpen } = useMainContext();

    const styles = getSxStyles({ isDrawerOpen });

    return (
        <Box component="main" sx={styles.main}>
            <Box sx={styles.toolbar} />
            {hasMainContainer ? (
                <Container maxWidth="lg" sx={styles.container}>
                    {children}
                </Container>
            ) : (
                children
            )}
            <Box mt={4}>
                <Copyright />
            </Box>
        </Box>
    );
}

/**
 * @param {{ isDrawerOpen: boolean }} props
 * @returns {import('../types').TSxStyles<"main" | "toolbar" | "container">}
 */
function getSxStyles({ isDrawerOpen }) {
    return {
        main: [
            {
                flexGrow: 1,
                p: 3,
                marginLeft: `-${DRAWER_WIDTH}px`,
                height: '100vh',
                overflow: 'auto',
            },
            getTransition('leavingScreen', 'margin'),
            isDrawerOpen && {
                marginLeft: 0,
            },
            isDrawerOpen && getTransition('enteringScreen', 'margin'),
        ],
        toolbar: theme => theme.mixins.toolbar,
        container: {
            py: 4,
        },
    };
}
