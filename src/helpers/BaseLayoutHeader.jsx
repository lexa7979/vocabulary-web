import * as Icons from '@mui/icons-material';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useExerciseContext, useLoginContext } from '../context';
import { useMainContext } from '../context/main';
import { DRAWER_WIDTH } from './BaseLayoutDrawer';
import WithLoginOnly from './WithLoginOnly';
import getTransition from './getTransition';

export default BaseLayoutHeader;

/**
 * @typedef IBaseLayoutHeaderProps
 * @prop {string} title
 */

/** @param {IBaseLayoutHeaderProps} props */
function BaseLayoutHeader({ title }) {
    const { isDrawerOpen, toggleDrawer } = useMainContext();
    const { logout } = useLoginContext();
    const { setAllLessons } = useExerciseContext();
    const navigate = useNavigate();

    const styles = getSxStyles({ isDrawerOpen });

    const _logout = () => {
        logout();
        setAllLessons([]);
        navigate('/');
    };

    return (
        <AppBar position="fixed" className="BaseLayoutHeader" sx={styles.appBar}>
            <Toolbar sx={styles.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer}
                    sx={styles.menuIconButton}
                >
                    <Icons.Menu />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={styles.pageTitle}>
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

/**
 * @param {{isDrawerOpen: boolean}} props
 * @returns {import('../types').TSxStyles<"appBar" | "toolbar" | "menuIconButton" | "pageTitle">}
 */
function getSxStyles({ isDrawerOpen }) {
    return {
        appBar: [
            theme => ({
                zIndex: theme.zIndex.drawer + 1,
            }),
            isDrawerOpen && {
                marginLeft: DRAWER_WIDTH,
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
            },
            getTransition('leavingScreen', 'width', 'margin'),
            isDrawerOpen && getTransition('enteringScreen', 'width', 'margin'),
        ],
        toolbar: {
            pr: 3,
        },
        menuIconButton: [
            {
                mr: 4,
            },
            isDrawerOpen && {
                display: 'none',
            },
        ],
        pageTitle: {
            flexGrow: 1,
        },
    };
}
