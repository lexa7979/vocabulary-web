import * as Icons from '@mui/icons-material';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from '../context';
import { DRAWER_WIDTH } from './BaseLayoutDrawer';
import WithLoginOnly from './WithLoginOnly';
import getTransition from './getTransition';
import { useMainContext } from '../context/main';

export default BaseLayoutHeader;

/**
 * @typedef IBaseLayoutHeaderProps
 * @prop {string} title
 */

/** @param {IBaseLayoutHeaderProps} props */
function BaseLayoutHeader({ title }) {
    const { isDrawerOpen, toggleDrawer } = useMainContext();
    const userData = useUserContext();
    const navigate = useNavigate();

    const _logout = () => {
        userData.logout();
        navigate('/');
    };

    return (
        <AppBar
            position="fixed"
            className="BaseLayoutHeader"
            sx={[
                theme => ({
                    zIndex: theme.zIndex.drawer + 1,
                }),
                isDrawerOpen && {
                    marginLeft: DRAWER_WIDTH,
                    width: `calc(100% - ${DRAWER_WIDTH}px)`,
                },
                getTransition('leavingScreen', 'width', 'margin'),
                isDrawerOpen && getTransition('enteringScreen', 'width', 'margin'),
            ]}
        >
            <Toolbar
                sx={{
                    pr: 3,
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer}
                    sx={[
                        {
                            mr: 4,
                        },
                        isDrawerOpen && {
                            display: 'none',
                        },
                    ]}
                >
                    <Icons.Menu />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    {title}
                </Typography>
                <WithLoginOnly>
                    <Button color="inherit" onClick={_logout}>
                        Log out
                    </Button>
                </WithLoginOnly>
            </Toolbar>
        </AppBar>
    );
}
