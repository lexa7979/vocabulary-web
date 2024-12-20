import { Box } from '@mui/material';
import React, { useState } from 'react';

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
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const _toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);

    return (
        <Box className="BaseLayout" sx={{ display: 'flex' }}>
            <BaseLayoutHeader drawerIsOpen={drawerIsOpen} toggleDrawer={_toggleDrawer} title={title} />
            <BaseLayoutDrawer drawerIsOpen={drawerIsOpen} toggleDrawer={_toggleDrawer} />
            <BaseLayoutMain drawerIsOpen={drawerIsOpen} hasMainContainer={hasMainContainer}>
                {children}
            </BaseLayoutMain>
        </Box>
    );
}
