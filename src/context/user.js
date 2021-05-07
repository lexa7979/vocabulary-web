import React from 'react';
import PropTypes from 'prop-types';

const Global = {
  context: null,
  dummyData: { active: true, username: 'dummy', name: 'Dummy context user' },
};

const _testInternals = {
  getContext: () => Global.context,
  resetContext: () => {
    Global.context = null;
  },
};

export { UserProvider, UserConsumer, useUserContext, _testInternals };

/**
 * Component `<UserProvider/>`
 * returns all given children and enables them to access the context "user".
 *
 * @param {object} props
 * @param {*} [props.children]
 *
 * @returns {*} JSX
 */
function UserProvider(props) {
  const { children } = props;

  if (Global.context == null) {
    const dummyContextData = _getFullContextValue(Global.dummyData, () => {});
    Global.context = React.createContext(dummyContextData);
  }

  const { Provider } = Global.context;

  const [data, setData] = React.useState({ active: false, username: null, name: null });
  const value = _getFullContextValue(data, setData);

  return <Provider value={value}>{children}</Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node,
};
UserProvider.defaultProps = {
  children: null,
};

/**
 * Component `<UserConsumer/>`
 * which expects a single function as child and must be wrapped by a <UserProvider/>.
 *
 * The function as child is invoked with the updated context-data
 * and might return any JSX-output as needed.
 *
 * @param {object} props
 * @param {(userData) => *} props.children
 *
 * @returns {*} Result of call to given function as child
 */
function UserConsumer(props) {
  const { children } = props;
  if (typeof children !== 'function') {
    throw new Error('Child must be a function');
  }

  if (Global.context == null) {
    throw new Error('No user context found');
  }
  const { Consumer } = Global.context;

  return <Consumer>{children}</Consumer>;
}

UserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

/**
 * React hook `useUserContext()`
 * which will return the updated context-data if it is used
 * inside a component which is wrapped by a <UserProvider/>.
 *
 * The function will return some semi-functional dummy-data
 * if the <UserProvider/> is missing. This might especially
 * be useful in unit-tests of components.
 *
 * @returns {object} current user-data
 */
function useUserContext() {
  if (Global.context != null) {
    return React.useContext(Global.context);
  }

  const dummyContextData = _getFullContextValue(Global.dummyData, () => {});
  return dummyContextData;
}

/**
 * @param {object} data e.g. { active: true, username: "testuser", name: "Test User" }
 * @param {(newData) => void} setData callback to change the context-data
 * @returns {object} updated context-data filled with some public methods
 */
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
