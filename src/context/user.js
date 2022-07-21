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

export { UserContext, UserConsumer, useUserContext, _testInternals };

/**
 * Component `<UserContext/>`
 * returns all given children and enables them to access the context "user".
 *
 * @param {object} props
 * @param {*} [props.children]
 *
 * @returns {*} JSX
 */
function UserContext(props) {
  const { children } = props;

  if (Global.context == null) {
    const dummyContextData = _getFullContextData(Global.dummyData, () => {});
    Global.context = React.createContext(dummyContextData);
  }

  const { Provider } = Global.context;

  const [data, setData] = React.useState({ active: false, username: null, name: null });
  const value = _getFullContextData(data, setData);

  return <Provider value={value}>{children}</Provider>;
}

UserContext.propTypes = {
  children: PropTypes.node,
};
UserContext.defaultProps = {
  children: null,
};

/**
 * Component `<UserConsumer/>`
 * expects a single function as child and must be wrapped in a `<UserContext/>`.
 *
 * The function as child is invoked with the updated context-data
 * and might return any JSX-output as needed.
 *
 * @param {object} props
 * @param {(userData: object) => *} props.children
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
 * inside a component which is wrapped by a <UserContext/>.
 *
 * The function will return some semi-functional dummy-data
 * if the <UserContext/> is missing. This might especially
 * be useful in unit-tests of components.
 *
 * @returns {UserContextData} current user-data
 */
function useUserContext() {
  if (Global.context != null) {
    return React.useContext(Global.context);
  }

  const dummyContextData = _getFullContextData(Global.dummyData, () => {});
  return dummyContextData;
}

/**
 * @typedef {object} UserContextData
 * @property {boolean} active
 * @property {string} [username]
 * @property {string} [name]
 * @property {() => boolean} isLoggedIn
 * @property {(username: string, name: string) => void} login
 * @property {() => void} logout
 */

/**
 * @param {object} data e.g. { active: true, username: "testuser", name: "Test User" }
 * @param {(newData) => void} setData callback to change the context-data
 * @returns {UserContextData} updated context-data filled with some public methods
 */
function _getFullContextData(data, setData) {
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
