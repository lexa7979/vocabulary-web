import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  AppBar,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashBoardIcon,
} from '@material-ui/icons';

import { useUserContext } from '../context';

export default PageLayout;

const DRAWER_WIDTH = 240;

const useStyles = _prepareStyles();

function PageLayout(props) {
  const { title, children, container } = props;

  const userData = useUserContext();
  const classes = useStyles();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const _toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  return (
    <div className={clsx('PageLayout', classes.root)}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerIsOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={_toggleDrawer}
            className={clsx(classes.menuButton, drawerIsOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          {userData.isLoggedIn() ? (
            <Button color="inherit" onClick={userData.logout}>
              Log out
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={drawerIsOpen}
        classes={{ paper: clsx(classes.drawerPaper, !drawerIsOpen && classes.drawerPaperClose) }}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={_toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashBoardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {container ? (
          <Container maxWidth="lg" className={classes.container}>
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

PageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  container: PropTypes.bool,
  children: PropTypes.node,
};
PageLayout.defaultProps = {
  container: false,
  children: null,
};

function _prepareStyles() {
  return makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  }));
}