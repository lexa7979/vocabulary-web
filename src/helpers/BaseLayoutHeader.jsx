import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

import { useUserContext } from '../context';

import WithLoginOnly from './WithLoginOnly';

export default BaseLayoutHeader;

const DRAWER_WIDTH = 240;
const PADDING_WHEN_DRAWER_CLOSED = 24;

const useStyles = _prepareStylesHook();

const propTypes = {
  schema: {
    title: PropTypes.string.isRequired,
    drawerIsOpen: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  },
  defaults: {},
};

function BaseLayoutHeader(props) {
  const { title, drawerIsOpen, toggleDrawer } = props;

  const userData = useUserContext();
  const history = useHistory();
  const css = useStyles();

  const _logout = () => {
    userData.logout();
    history.push('/');
  };

  return (
    <AppBar
      position="absolute"
      className={clsx('BaseLayoutHeader', css.root, drawerIsOpen && css.appBarShift)}
    >
      <Toolbar className={css.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          className={clsx(css.menuButton, drawerIsOpen && css.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={css.title}>
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

BaseLayoutHeader.propTypes = propTypes.schema;
BaseLayoutHeader.defaultProps = propTypes.defaults;

function _prepareStylesHook() {
  return makeStyles(theme => {
    const { zIndex, transitions } = theme;
    const {
      create,
      easing: { sharp },
      duration: { leavingScreen, enteringScreen },
    } = transitions;

    return {
      root: {
        zIndex: zIndex.drawer + 1,
        transition: create(['width', 'margin'], { easing: sharp, duration: leavingScreen }),
      },

      appBarShift: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: create(['width', 'margin'], { easing: sharp, duration: enteringScreen }),
      },

      toolbar: {
        paddingRight: PADDING_WHEN_DRAWER_CLOSED,
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
    };
  });
}
