import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useHistory, useLocation } from 'react-router-dom';

import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import {
  ChevronLeft as HideDrawerIcon,
  House as HomePageIcon,
  AccountCircle as ProfilePageIcon,
  ViewList as WordsPageIcon,
  QuestionAnswer as ExercisePageIcon,
} from '@material-ui/icons';

export default BaseLayoutDrawer;

const DRAWER_WIDTH = 240;

const useStyles = _prepareStylesHook();

const propTypes = {
  schema: {
    drawerIsOpen: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  },
  defaults: {},
};

function BaseLayoutDrawer(props) {
  const { drawerIsOpen, toggleDrawer } = props;

  const css = useStyles();
  const history = useHistory();
  const location = useLocation();

  const paths = [
    { path: '/', icon: <HomePageIcon />, caption: 'Home' },
    { path: '/profile', icon: <ProfilePageIcon />, caption: 'Profile' },
    { path: '/words', icon: <WordsPageIcon />, caption: 'Words' },
    { path: '/exercise', icon: <ExercisePageIcon />, caption: 'Glosförhör' },
  ];

  return (
    <Drawer
      variant="permanent"
      open={drawerIsOpen}
      classes={{
        paper: clsx('BaseLayoutDrawer', css.paper, !drawerIsOpen && css.paperClose),
      }}
    >
      <div className={css.toolbarIcon}>
        <IconButton onClick={toggleDrawer}>
          <HideDrawerIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {paths.map(({ path, icon, caption }) => (
          <ListItem
            key={path}
            button
            onClick={() => history.push(path)}
            selected={location.pathname === path}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={caption} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

BaseLayoutDrawer.propTypes = propTypes.schema;
BaseLayoutDrawer.defaultProps = propTypes.defaults;

function _prepareStylesHook() {
  return makeStyles(theme => {
    const { transitions, mixins, spacing, breakpoints } = theme;
    const {
      create,
      easing: { sharp },
      duration: { enteringScreen, leavingScreen },
    } = transitions;

    return {
      paper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: DRAWER_WIDTH,
        transition: create('width', { easing: sharp, duration: enteringScreen }),
      },

      paperClose: {
        overflowX: 'hidden',
        transition: create('width', { easing: sharp, duration: leavingScreen }),
        width: spacing(7),
        [breakpoints.up('sm')]: {
          width: spacing(9),
        },
      },

      toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...mixins.toolbar,
      },
    };
  });
}
