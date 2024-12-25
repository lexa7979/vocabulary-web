import { createContext, useContext, useState } from 'react';

/** @type {import('./types').IUserData} */
const emptyUserData = { active: false, username: null, name: null };

/** @type {import('./types').ILoginContextSetup} */
const defaultSetup = {
    userData: emptyUserData,
    setUserData: () => {},
    _isDefaultSetup: true,
};

const _LoginContext = createContext(defaultSetup);
const LoginContextProvider = _LoginContext.Provider;

/** @returns {import('./types').ILoginContextSetup} */
const useLoginContextSetup = () => {
    const [userData, setUserData] = useState(emptyUserData);

    return { userData, setUserData };
};

/** @returns {import('./types').ILoginContextValue} */
const useLoginContext = () => {
    const { userData, setUserData } = useContext(_LoginContext);

    return {
        username: userData.username,
        name: userData.name,

        isLoggedIn: () => userData.active,
        login: (username, name) => setUserData({ active: true, username, name }),
        logout: () => setUserData(emptyUserData),
    };
};

export { LoginContextProvider, useLoginContext, useLoginContextSetup };
