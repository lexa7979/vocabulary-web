import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Console, copyObject, IS_ACCESSIBLE, bold, FAILS, green, red, RETURNS } from '../../test';

import * as User from './user';

const DUMMY_USER_INFO = 'Current user is dummy (Dummy context user)';

describe(bold('Context "user"'), () => {
  beforeEach(User._testInternals.resetContext);

  it(`${green('exports 3 public items')} as expected`, () => {
    expect(User).toContainAllKeys([
      'UserContext',
      'UserConsumer',
      'useUserContext',
      '_testInternals',
    ]);
  });

  runTestsAboutUserProvider();
  runTestsAboutUserConsumer();
  runTestsAboutUseUserContext();

  runTestsAboutEdgeCases();
});

function runTestsAboutUserProvider() {
  const { UserContext } = User;

  describe(`exports a component ${bold('<UserContext/>')} which`, () => {
    it(IS_ACCESSIBLE, () => {
      expect(UserContext).toBeFunction();
    });

    it(`${green("doesn't render")} any output itself`, () => {
      const { container } = render(<UserContext />);
      expect(container.firstChild).toBeNull();
    });

    it(`${RETURNS} any given children`, () => {
      const testSetup = (
        <UserContext>
          <div>Test Content 1</div>
          <div>Test Content 2</div>
          <div>Test Content 3</div>
        </UserContext>
      );

      const { container } = render(testSetup);

      expect(container.childNodes).toHaveLength(3);
      expect(container.childNodes[0]).toHaveTextContent('Test Content 1');
      expect(container.childNodes[1]).toHaveTextContent('Test Content 2');
      expect(container.childNodes[2]).toHaveTextContent('Test Content 3');
    });

    it(`internally ${green('creates')} a new context`, () => {
      expect(User._testInternals.getContext()).toBeNull();

      render(<UserContext />);

      expect(User._testInternals.getContext()).not.toBeNull();
    });
  });
}

function runTestsAboutUserConsumer() {
  const { UserConsumer, UserContext } = User;

  describe(`exports a component ${bold('<UserConsumer/>')} which`, () => {
    it(IS_ACCESSIBLE, () => {
      expect(UserConsumer).toBeFunction();
    });

    it(`- when used w/o any <UserContext/> - ${FAILS} as expected`, () => {
      const testRun = () =>
        render(
          <UserConsumer>
            {userData => (
              <TestComponentWithUserDataByProps target="user-info" userData={userData} />
            )}
          </UserConsumer>
        );

      expect(() => Console.runQuietly(testRun)).toThrow('No user context found');
    });

    it(`- when not used with a function as child - ${FAILS} as expected`, () => {
      const testRun = () =>
        render(
          <UserContext>
            <UserConsumer>
              {/* @ts-ignore */}
              <div>Test Content</div>
            </UserConsumer>
          </UserContext>
        );

      expect(() => Console.runQuietly(testRun)).toThrow('Child must be a function');
    });

    it(
      '- when placed outside of an existing <UserContext/> - ' +
        `${red('only delivers')} some semi-functional dummy-data`,
      () => {
        const testSetup = (
          <>
            <UserContext>
              <div>Test Content</div>
            </UserContext>
            <UserConsumer>
              {userData => (
                <>
                  <TestComponentWithUserDataByProps target="user-info" userData={userData} />
                  <TestComponentWithUserDataByProps target="login-button" userData={userData} />
                </>
              )}
            </UserConsumer>
          </>
        );

        const { getByTestId } = render(testSetup);

        const userInfo = getByTestId('user-info');
        const loginButton = getByTestId('login-button');

        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
        fireEvent.click(loginButton);
        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
      }
    );

    it(
      '- when wrapped in <UserContext/> and used with a function as child - ' +
        `${green('gives full access')} to updated context-data`,
      () => {
        const testSetup = (
          <UserContext>
            <UserConsumer>
              {userData => (
                <>
                  <TestComponentWithUserDataByProps target="user-info" userData={userData} />
                  <TestComponentWithUserDataByProps target="login-button" userData={userData} />
                  <TestComponentWithUserDataByProps target="logout-button" userData={userData} />
                </>
              )}
            </UserConsumer>
          </UserContext>
        );

        const { getByTestId } = render(testSetup);

        const userInfo = getByTestId('user-info');
        const loginButton = getByTestId('login-button');
        const logoutButton = getByTestId('logout-button');

        expect(userInfo).toHaveTextContent('Nobody is logged in');
        fireEvent.click(loginButton);
        expect(userInfo).toHaveTextContent('Current user is testuser (Test User)');
        fireEvent.click(logoutButton);
        expect(userInfo).toHaveTextContent('Nobody is logged in');
      }
    );

    it(`- when used twice inside of same <UserContext/> - ${green('uses')} same context`, () => {
      const testSetup = (
        <UserContext>
          <UserConsumer>
            {userData => (
              <TestComponentWithUserDataByProps target="user-info" userData={userData} />
            )}
          </UserConsumer>
          <UserConsumer>
            {userData => (
              <TestComponentWithUserDataByProps target="login-button" userData={userData} />
            )}
          </UserConsumer>
        </UserContext>
      );

      const { getByTestId } = render(testSetup);

      const userInfo = getByTestId('user-info');
      const loginButton = getByTestId('login-button');

      expect(userInfo).toHaveTextContent('Nobody is logged in');
      fireEvent.click(loginButton);
      expect(userInfo).toHaveTextContent('Current user is testuser (Test User)');
    });
  });
}

function runTestsAboutUseUserContext() {
  const { UserContext, useUserContext } = User;

  describe(`exports a hook ${bold('useUserContext()')} which`, () => {
    it(IS_ACCESSIBLE, () => {
      expect(useUserContext).toBeFunction();
    });

    it(
      '- when used outside of any component - ' +
        `${red('only delivers')} some semi-functional dummy-data`,
      () => {
        const userData = useUserContext();

        const copy = copyObject(userData, { replaceFunctions: true });
        expect(copy).toEqual({
          username: 'dummy',
          name: 'Dummy context user',
          active: true,
          isLoggedIn: '(FUNC:isLoggedIn)',
          login: '(FUNC:login)',
          logout: '(FUNC:logout)',
        });

        expect(userData.isLoggedIn()).toBeTrue();

        userData.login('testuser', 'Test User');
        expect([userData.username, userData.name]).toEqual(['dummy', 'Dummy context user']);

        userData.logout();
        expect([userData.username, userData.name]).toEqual(['dummy', 'Dummy context user']);
      }
    );

    it(
      '- when used in components w/o any <UserContext/> - ' +
        `${red('only delivers')} some semi-functional dummy-data`,
      () => {
        const testSetup = (
          <>
            <TestComponentWithUserDataByHook target="user-info" />
            <TestComponentWithUserDataByHook target="login-button" />
          </>
        );

        const { getByTestId } = render(testSetup);

        const userInfo = getByTestId('user-info');
        const loginButton = getByTestId('login-button');

        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
        fireEvent.click(loginButton);
        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
      }
    );

    it(
      '- when used in components which are placed outside of an existing <UserContext/> - ' +
        `${red('only delivers')} some semi-functional dummy-data`,
      () => {
        const testSetup = (
          <>
            <UserContext>
              <div>Test Content</div>
            </UserContext>
            <TestComponentWithUserDataByHook target="user-info" />
            <TestComponentWithUserDataByHook target="login-button" />
          </>
        );

        const { getByTestId } = render(testSetup);

        const userInfo = getByTestId('user-info');
        const loginButton = getByTestId('login-button');

        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
        fireEvent.click(loginButton);
        expect(userInfo).toHaveTextContent(DUMMY_USER_INFO);
      }
    );

    it(
      '- when used in components wrapped in <UserContext/> - ' +
        `${green('gives full access')} to updated context-data`,
      () => {
        const testSetup = (
          <UserContext>
            <TestComponentWithUserDataByHook target="user-info" />
            <TestComponentWithUserDataByHook target="login-button" />
            <TestComponentWithUserDataByHook target="logout-button" />
          </UserContext>
        );

        const { getByTestId } = render(testSetup);

        const userInfo = getByTestId('user-info');
        const loginButton = getByTestId('login-button');
        const logoutButton = getByTestId('logout-button');

        expect(userInfo).toHaveTextContent('Nobody is logged in');
        fireEvent.click(loginButton);
        expect(userInfo).toHaveTextContent('Current user is testuser (Test User)');
        fireEvent.click(logoutButton);
        expect(userInfo).toHaveTextContent('Nobody is logged in');
      }
    );
  });
}

function runTestsAboutEdgeCases() {
  const { UserContext, UserConsumer } = User;

  describe('has some edge cases:', () => {
    const edgeCases = [
      ['<UserConsumer/>', 'inside of different <UserContext/>'],
      ['<UserConsumer/>', 'within two nested <UserContext/>'],
      ['useUserContext()', 'inside of different <UserContext/>'],
      ['useUserContext()', 'within two nested <UserContext/>'],
    ];

    it.each(edgeCases)(
      `When ${bold('%s')} is used twice %s, ${green('different contexts are used')}.`,
      (caseSubject, caseSituation) => {
        let testConsumer1;
        let testConsumer2;
        switch (caseSubject) {
          default:
            throw new Error(`Invalid case-subject "${caseSubject}"`);

          case '<UserConsumer/>':
            testConsumer1 = (
              <UserConsumer>
                {userData => (
                  <TestComponentWithUserDataByProps
                    target="user-info"
                    testid="info1"
                    userData={userData}
                  />
                )}
              </UserConsumer>
            );
            testConsumer2 = (
              <UserConsumer>
                {userData => (
                  <>
                    <TestComponentWithUserDataByProps
                      target="user-info"
                      testid="info2"
                      userData={userData}
                    />
                    <TestComponentWithUserDataByProps
                      target="login-button"
                      testid="login2"
                      userData={userData}
                    />
                  </>
                )}
              </UserConsumer>
            );
            break;

          case 'useUserContext()':
            testConsumer1 = <TestComponentWithUserDataByHook target="user-info" testid="info1" />;
            testConsumer2 = (
              <>
                <TestComponentWithUserDataByHook target="user-info" testid="info2" />
                <TestComponentWithUserDataByHook target="login-button" testid="login2" />
              </>
            );
            break;
        }

        let testSetup;
        switch (caseSituation) {
          default:
            throw new Error(`Invalid case-situation "${caseSituation}"`);

          case 'inside of different <UserContext/>':
            testSetup = (
              <>
                <UserContext>{testConsumer1}</UserContext>
                <UserContext>{testConsumer2}</UserContext>
              </>
            );
            break;

          case 'within two nested <UserContext/>':
            testSetup = (
              <UserContext>
                {testConsumer1}
                <UserContext>{testConsumer2}</UserContext>
              </UserContext>
            );
            break;
        }

        const { getByTestId } = render(testSetup);

        const userInfo1 = getByTestId('info1');
        const userInfo2 = getByTestId('info2');
        const loginButton2 = getByTestId('login2');

        expect(userInfo1).toHaveTextContent('Nobody is logged in');

        expect(userInfo2).toHaveTextContent('Nobody is logged in');
        fireEvent.click(loginButton2);
        expect(userInfo2).toHaveTextContent('Current user is testuser (Test User)');

        expect(userInfo1).toHaveTextContent('Nobody is logged in');
      }
    );
  });
}

/**
 * <TestComponentWithUserDataByProps />
 * shows a simple information text about the user or
 * generates a button to login or logout.
 *
 * @param {object} props
 * @param {string} props.target e.g. "login-button"
 * @param {string} [props.testid] e.g. "login", defaults to props.target
 * @param {object} props.userData current data of context "user"
 *
 * @throws e.g. if invalid target is given
 * @returns {JSX.Element}
 */
function TestComponentWithUserDataByProps(props) {
  const { target, testid, userData } = props;

  switch (target) {
    case 'login-button':
      return (
        <button
          type="button"
          data-testid={testid || target}
          onClick={() => userData.login('testuser', 'Test User')}
        >
          Login
        </button>
      );

    case 'logout-button':
      return (
        <button type="button" data-testid={testid || target} onClick={() => userData.logout()}>
          Logout
        </button>
      );

    case 'user-info':
      return (
        <div data-testid={testid || target}>
          {userData.isLoggedIn()
            ? `Current user is ${userData.username} (${userData.name})`
            : 'Nobody is logged in'}
        </div>
      );

    default:
      throw new Error(`Invalid target "${target}"`);
  }
}

TestComponentWithUserDataByProps.propTypes = {
  target: PropTypes.oneOf(['login-button', 'logout-button', 'user-info']).isRequired,
  testid: PropTypes.string,
  userData: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    isLoggedIn: PropTypes.func,
    login: PropTypes.func,
    logout: PropTypes.func,
  }).isRequired,
};
TestComponentWithUserDataByProps.defaultProps = {
  testid: null,
};

/**
 * <TestComponentWithUserDataByHook />
 * shows a simple information text about the user or
 * generates a button to login or logout.
 *
 * The current data of context "user" is accessed via the hook useUserContext().
 *
 * @param {object} props
 * @param {string} props.target e.g. "login-button"
 * @param {string} [props.testid] e.g. "login", defaults to props.target
 *
 * @throws e.g. if invalid target is given
 * @returns {JSX.Element}
 */
function TestComponentWithUserDataByHook(props) {
  const { target, testid } = props;
  const userData = User.useUserContext();
  return <TestComponentWithUserDataByProps userData={userData} target={target} testid={testid} />;
}

TestComponentWithUserDataByHook.propTypes = {
  target: PropTypes.oneOf(['login-button', 'logout-button', 'user-info']).isRequired,
  testid: PropTypes.string,
};
TestComponentWithUserDataByHook.defaultProps = {
  testid: null,
};
