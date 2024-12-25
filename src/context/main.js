const { createContext, useState, useContext } = require('react');

/** @type {import('./types').IMainContextSetup} */
const defaultSetup = {
    isDrawerOpen: false,
    setIsDrawerOpen: () => {},
    _isDefaultSetup: true,
};

const _MainContext = createContext(defaultSetup);
const MainContextProvider = _MainContext.Provider;

/** @returns {import('./types').IMainContextSetup} */
const useMainContextSetup = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    return {
        isDrawerOpen,
        setIsDrawerOpen,
    };
};

/** @returns {import('./types').IMainContextValue} */
const useMainContext = () => {
    const { isDrawerOpen, setIsDrawerOpen } = useContext(_MainContext);

    return {
        isDrawerOpen,
        toggleDrawer: () => setIsDrawerOpen(value => !value),
    };
};

export { MainContextProvider, useMainContextSetup, useMainContext };
