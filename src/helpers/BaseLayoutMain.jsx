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

    return (
        <Box
            component="main"
            sx={[
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
            ]}
        >
            <Box sx={theme => theme.mixins.toolbar} />
            {hasMainContainer ? (
                <Container maxWidth="lg" sx={{ py: 4 }}>
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
