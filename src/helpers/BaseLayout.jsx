import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Container, makeStyles } from '@material-ui/core';

import BaseLayoutHeader from './BaseLayoutHeader';
import BaseLayoutDrawer from './BaseLayoutDrawer';

export default BaseLayout;

const useStyles = _prepareStylesHook();

const propTypes = {
  schema: {
    title: PropTypes.string.isRequired,
    hasMainContainer: PropTypes.bool,
    children: PropTypes.node,
  },
  defaults: {
    hasMainContainer: false,
    children: null,
  },
};

function BaseLayout(props) {
  const { title, children, hasMainContainer } = props;

  const css = useStyles();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const _toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  return (
    <div className={clsx('BaseLayout', css.root)}>
      <BaseLayoutHeader drawerIsOpen={drawerIsOpen} toggleDrawer={_toggleDrawer} title={title} />
      <BaseLayoutDrawer drawerIsOpen={drawerIsOpen} toggleDrawer={_toggleDrawer} />
      <main className={css.main}>
        <div className={css.appBarSpacer} />
        {hasMainContainer ? (
          <Container maxWidth="lg" className={css.mainContainer}>
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

BaseLayout.propTypes = propTypes.schema;
BaseLayout.defaultProps = propTypes.defaults;

function _prepareStylesHook() {
  return makeStyles(theme => {
    const { mixins, spacing } = theme;

    return {
      root: {
        display: 'flex',
      },

      main: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      },

      appBarSpacer: mixins.toolbar,

      mainContainer: {
        paddingTop: spacing(4),
        paddingBottom: spacing(4),
      },
    };
  });
}
