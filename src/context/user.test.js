import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import * as User from './user';

import { copyObject, IS_ACCESSIBLE, bold } from '../../test';

describe('Context "user"', () => {
  it('has all expected exports', () => {
    const copy = copyObject(User, { replaceFunctions: true });
    copy.UserProvider.props = '(hidden propTypes)';
    copy.UserConsumer.props = '(hidden propTypes)';

    expect(copy).toEqual({
      UserProvider: {
        _self: '(FUNC:UserProvider)',
        props: '(hidden propTypes)',
      },
      UserConsumer: {
        _self: '(FUNC:UserConsumer)',
        props: '(hidden propTypes)',
      },
      useUserContext: '(FUNC:useUserContext)',
    });
  });

  describe(`exports a component ${bold('<UserProvider/>')} which`, () => {
    const { UserProvider } = User;

    it(IS_ACCESSIBLE, () => {
      expect(UserProvider).toBeFunction();
    });

    it("doesn't render any output itself", () => {
      const { container } = render(<UserProvider />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe(`exports a component ${bold('<UserConsumer/>')} which`, () => {
    const { UserConsumer, UserProvider } = User;

    it(IS_ACCESSIBLE, () => {
      expect(UserConsumer).toBeFunction();
    });

    it('works as expected...', () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestLoginButton testid="login" />
          <TestLogoutButton testid="logout" />
          <UserConsumer>
            {userData => <ShowUserFromProps userData={userData} testid="output" />}
          </UserConsumer>
        </UserProvider>
      );

      expect(getByTestId('output')).toHaveTextContent('Nobody is logged in');

      fireEvent.click(getByTestId('login'));
      expect(getByTestId('output')).toHaveTextContent('Current user is testUser (Test User)');

      fireEvent.click(getByTestId('logout'));
      expect(getByTestId('output')).toHaveTextContent('Nobody is logged in');
    });

    it('works as expected...', () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestLoginButton testid="login" />
          <TestLogoutButton testid="logout" />
          <ShowUserFromHook testid="output" />
        </UserProvider>
      );

      expect(getByTestId('output')).toHaveTextContent('Nobody is logged in');

      fireEvent.click(getByTestId('login'));
      expect(getByTestId('output')).toHaveTextContent('Current user is testUser (Test User)');

      fireEvent.click(getByTestId('logout'));
      expect(getByTestId('output')).toHaveTextContent('Nobody is logged in');
    });
  });
});

function ShowUserFromHook(props) {
  const { testid } = props;
  const userData = User.useUserContext();
  return <ShowUserFromProps userData={userData} testid={testid} />;
}

ShowUserFromHook.propTypes = {
  testid: PropTypes.string.isRequired,
};

function ShowUserFromProps(props) {
  const { userData, testid } = props;
  if (userData.isLoggedIn()) {
    return (
      <div data-testid={testid}>{`Current user is ${userData.username} (${userData.name})`}</div>
    );
  }
  return <div data-testid={testid}>Nobody is logged in</div>;
}

ShowUserFromProps.propTypes = {
  userData: PropTypes.shape({
    isLoggedIn: PropTypes.func.isRequired,
    username: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  testid: PropTypes.string.isRequired,
};

function TestLoginButton(props) {
  const { testid } = props;
  const userData = User.useUserContext();
  const onClick = () => {
    userData.login('testUser', 'Test User');
  };
  return (
    <button type="button" data-testid={testid} onClick={onClick}>
      Login
    </button>
  );
}

TestLoginButton.propTypes = {
  testid: PropTypes.string.isRequired,
};

function TestLogoutButton(props) {
  // eslint-disable-next-line react/prop-types
  const { testid } = props;
  const userData = User.useUserContext();
  const onClick = () => {
    userData.logout();
  };
  return (
    <button type="button" data-testid={testid} onClick={onClick}>
      Logout
    </button>
  );
}

TestLogoutButton.propTypes = {
  testid: PropTypes.string.isRequired,
};
