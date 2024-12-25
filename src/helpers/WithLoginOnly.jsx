import React from 'react';

import { useLoginContext } from '../context';
import Login from '../pages/Login';

export default WithLoginOnly;

/**
 * @typedef IWithLoginOnlyProps
 * @prop {React.ReactNode} [children]
 * @prop {boolean} [signIn]
 */

/** @param {IWithLoginOnlyProps} props */
function WithLoginOnly({ children, signIn }) {
    const { isLoggedIn } = useLoginContext();

    if (isLoggedIn()) {
        return children;
    }

    return signIn ? <Login /> : null;
}
