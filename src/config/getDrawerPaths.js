import * as Icons from '@mui/icons-material';
import { createElement } from 'react';

import allPaths from './allPaths';

function getDrawerPaths() {
    return allPaths
        .filter(({ posDrawer }) => posDrawer != null)
        .sort((itemA, itemB) => itemA.posDrawer - itemB.posDrawer)
        .map(({ path, pageIcon, pageHeader }) => ({
            path,
            icon: createElement(Icons[pageIcon]),
            caption: pageHeader,
        }));
}

export default getDrawerPaths;
