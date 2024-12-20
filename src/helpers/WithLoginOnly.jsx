import React from 'react';

import { useUserContext } from '../context';
import Login from '../pages/Login';

export default WithLoginOnly;

/**
 * @typedef IWithLoginOnlyProps
 * @prop {React.ReactNode} [children]
 * @prop {boolean} [signIn]
 */

/** @param {IWithLoginOnlyProps} props */
function WithLoginOnly({ children, signIn }) {
    const userData = useUserContext();

    if (userData.isLoggedIn()) {
        return children;
    }

    return signIn ? <Login /> : null;
}
