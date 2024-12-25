import { fireEvent, render, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { bold, Console, copyObject, FAILS, green, IS_ACCESSIBLE, red, RETURNS } from '../../test';

import * as Login from './login';

const DUMMY_USER_INFO = 'Current user is dummy (Dummy context user)';

describe(bold('Context "login"'), () => {
    it(`${green('exports three items')} as expected`, () => {
        expect(Login).toContainAllKeys(['LoginContextProvider', 'useLoginContextSetup', 'useLoginContext']);
    });

    runTestsAboutLoginContextProvider();
    runTestsAboutUseLoginContextSetup();
    runTestsAboutUseLoginContext();
});

function runTestsAboutLoginContextProvider() {
    const { LoginContextProvider } = Login;

    describe(`exports a component ${bold('<LoginContextProvider/>')} which`, () => {
        const dummyContextSetup = { userData: {}, setUserData: jest.fn() };

        it(IS_ACCESSIBLE, () => expect(LoginContextProvider).toBeFunction());

        it(`${green("doesn't render")} any output itself`, () => {
            const { container } = render(<LoginContextProvider value={dummyContextSetup} />);

            expect(container).toBeEmptyDOMElement();
        });

        it(`${RETURNS} any given children`, () => {
            const { container } = render(
                <LoginContextProvider value={dummyContextSetup}>
                    <div>Test Content 1</div>
                    <div>Test Content 2</div>
                    <div>Test Content 3</div>
                </LoginContextProvider>
            );

            expect(container.childNodes).toHaveLength(3);
            expect(container.childNodes[0]).toHaveTextContent('Test Content 1');
            expect(container.childNodes[1]).toHaveTextContent('Test Content 2');
            expect(container.childNodes[2]).toHaveTextContent('Test Content 3');
        });
    });
}

function runTestsAboutUseLoginContextSetup() {
    const { useLoginContextSetup } = Login;

    describe(`exports a function ${bold('useLoginContextSetup()')} which`, () => {
        it(IS_ACCESSIBLE, () => expect(useLoginContextSetup).toBeFunction());

        it(`is a React-hook and excepts no arguments`, () => {
            renderHook(useLoginContextSetup);
            expect(useLoginContextSetup).toHaveLength(0);
        });
    });
}

function runTestsAboutUseLoginContext() {
    const { LoginContextProvider, useLoginContextSetup, useLoginContext } = Login;

    describe(`exports a function ${bold('useLoginContext()')} which`, () => {
        it(IS_ACCESSIBLE, () => {
            expect(useLoginContext).toBeFunction();
        });

        it.skip(`is a React-hook`, () => {
            // TODO
        });

        it(`- when used outside of any component - ${red('only delivers')} some semi-functional dummy-data`, () => {
            const userData = useLoginContext();

            expect(copyObject(userData, { replaceFunctions: true })).toEqual({
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
        });

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
                        <LoginContextProvider>
                            <div>Test Content</div>
                        </LoginContextProvider>
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

                    default:
                        throw new Error(`Invalid case-subject "${caseSubject}"`);
                }

                let testSetup;
                switch (caseSituation) {
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

                    default:
                        throw new Error(`Invalid case-situation "${caseSituation}"`);
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
 * @typedef IUserData
 * @prop {string} [username]
 * @prop {string} [name]
 * @prop {Function} [isLoggedIn]
 * @prop {Function} [login]
 * @prop {Function} [logout]
 */

/**
 * <TestComponentWithUserDataByProps />
 * shows a simple information text about the user or
 * generates a button to login or logout.
 *
 * @param {object} props
 * @param {"login-button" | "logout-button" | "user-info"} props.target
 * @param {IUserData} props.userData current data of context "user"
 * @param {string} [props.testid] e.g. "login", defaults to props.target
 *
 * @throws e.g. if invalid target is given
 * @returns {React.JSX.Element}
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

/**
 * <TestComponentWithUserDataByHook />
 * shows a simple information text about the user or
 * generates a button to login or logout.
 *
 * The current data of context "user" is accessed via the hook useUserContext().
 *
 * @param {object} props
 * @param {"login-button" | "logout-button" | "user-info"} props.target e.g. "login-button"
 * @param {string} [props.testid] e.g. "login", defaults to props.target
 *
 * @throws e.g. if invalid target is given
 * @returns {React.JSX.Element}
 */
function TestComponentWithUserDataByHook(props) {
    const { target, testid } = props;
    const userData = User.useUserContext();
    return <TestComponentWithUserDataByProps userData={userData} target={target} testid={testid} />;
}
