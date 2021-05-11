import React from 'react';
import PropTypes from 'prop-types';

import { useUserContext } from '../context';

import Login from '../pages/Login';

export default WithLoginOnly;

function WithLoginOnly(props) {
  const { children, signIn } = props;

  const userData = useUserContext();

  if (userData.isLoggedIn()) {
    return children;
  }

  return signIn ? <Login /> : null;
}

WithLoginOnly.propTypes = {
  children: PropTypes.node,
  signIn: PropTypes.bool,
};
WithLoginOnly.defaultProps = {
  children: null,
  signIn: false,
};
