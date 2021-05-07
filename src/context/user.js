import React from 'react';
import PropTypes from 'prop-types';

export { UserProvider, UserConsumer, useUserContext };

const Global = {
  context: null,
  testData: { active: false, username: null, name: null },
};

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: null,
};

/**
 * <UserProvider/>
 *
 * @param {*} props
 * @returns
 */
function UserProvider(props) {
  const { Provider } = _getContext();
  const { children } = props;
  const [data, setData] = React.useState({ active: false, username: null, name: null });

  const value = _getFullContextValue(data, setData);

  return <Provider value={value}>{children}</Provider>;
}

UserProvider.propTypes = propTypes;
UserProvider.defaultProps = defaultProps;

/**
 * @returns {object} React context
 */
function _getContext() {
  if (Global.context == null) {
    Global.context = React.createContext(Global.testData);
  }
  return Global.context;
}

/**
 * @returns {object}
 */
function useUserContext() {
  if (Global.context != null) {
    return React.useContext(Global.context);
  }

  const _setTestData = newData => {
    Global.testData = newData;
  };
  return _getFullContextValue(Global.testData, _setTestData);
}

function UserConsumer(props) {
  const { children } = props;
  if (Global.context == null) {
    throw new Error('No user context found');
  }
  if (typeof children !== 'function') {
    throw new Error('Child must be a function');
  }
  const { Consumer } = Global.context;
  return <Consumer>{children}</Consumer>;
}

UserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

function _getFullContextValue(data, setData) {
  return {
    active: data.active,
    username: data.username,
    name: data.name,
    isLoggedIn() {
      return data.active;
    },
    login(username, name) {
      setData({ active: true, username, name });
    },
    logout() {
      setData({ active: false, username: null, name: null });
    },
  };
}
