import * as Icons from '@mui/icons-material';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import getDrawerPaths from '../config/getDrawerPaths';
import { useMainContext } from '../context/main';

export default BaseLayoutDrawer;

export const DRAWER_WIDTH = 240;

function BaseLayoutDrawer() {
    const { isDrawerOpen, toggleDrawer } = useMainContext();

    const navigate = useNavigate();
    const location = useLocation();

    const styles = getSxStyles();

    const pageButtons = getDrawerPaths().map(({ path, icon, caption }) => (
        <ListItem key={path}>
            <ListItemButton onClick={() => navigate(path)} selected={location.pathname === path}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={caption} />
            </ListItemButton>
        </ListItem>
    ));

    return (
        <Drawer className="BaseLayoutDrawer" variant="persistent" open={isDrawerOpen} sx={styles.drawer}>
            <Box sx={styles.iconContainer}>
                <IconButton onClick={toggleDrawer}>
                    <Icons.ChevronLeft />
                </IconButton>
            </Box>
            <Divider />
            <List>{pageButtons}</List>
        </Drawer>
    );
}

/** @returns {import('../types').TSxStyles<"drawer" | "iconContainer">} */
function getSxStyles() {
    return {
        drawer: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
            },
        },
        iconContainer: [
            {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: 1,
            },
            theme => theme.mixins.toolbar,
        ],
    };
}
