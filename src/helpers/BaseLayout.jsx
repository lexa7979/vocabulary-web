import { Box } from '@mui/material';
import React from 'react';

import BaseLayoutDrawer from './BaseLayoutDrawer';
import BaseLayoutHeader from './BaseLayoutHeader';
import BaseLayoutMain from './BaseLayoutMain';

export default BaseLayout;

/**
 * @typedef IBaseLayoutProps
 * @prop {string} title
 * @prop {boolean} [hasMainContainer]
 * @prop {React.ReactNode} [children]
 */

/** @param {IBaseLayoutProps} props */
function BaseLayout({ title, hasMainContainer, children }) {
    const styles = getSxStyles();

    return (
        <Box className="BaseLayout" sx={styles.flex}>
            <BaseLayoutHeader title={title} />
            <BaseLayoutDrawer />
            <BaseLayoutMain hasMainContainer={hasMainContainer}>{children}</BaseLayoutMain>
        </Box>
    );
}

/** @returns {import('../types').TSxStyles<"flex">} */
function getSxStyles() {
    return {
        flex: {
            display: 'flex',
        },
    };
}
