const { createContext, useState, useContext } = require('react');

/**
 * @typedef IMainContextSetup
 * @prop {boolean} isDrawerOpen
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setIsDrawerOpen
 * @prop {boolean} [_isDefaultData]
 */

/**
 * @typedef IMainContextValue
 * @prop {boolean} isDrawerOpen
 * @prop {VoidFunction} toggleDrawer
 */

/** @type {IMainContextSetup} */
const defaultData = {
    isDrawerOpen: false,
    setIsDrawerOpen: () => {},
    _isDefaultData: true,
};

const _MainContext = createContext(defaultData);

const MainContextProvider = _MainContext.Provider;

const useMainContextSetup = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    return { isDrawerOpen, setIsDrawerOpen };
};

/** @returns {IMainContextValue} */
const useMainContext = () => {
    const { isDrawerOpen, setIsDrawerOpen } = useContext(_MainContext);

    const toggleDrawer = () => setIsDrawerOpen(value => !value);

    return { isDrawerOpen, toggleDrawer };
};

export { MainContextProvider, useMainContextSetup, useMainContext };
