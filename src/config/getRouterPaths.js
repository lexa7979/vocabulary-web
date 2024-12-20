import { createElement } from 'react';

import * as Pages from '../pages';
import allPaths from './allPaths';

function getRouterPaths() {
    return allPaths
        .filter(({ posRouter }) => posRouter != null)
        .sort((itemA, itemB) => itemA.posRouter - itemB.posRouter)
        .map(({ path, pageComponent, isProtected }) => ({
            path,
            component: createElement(Pages[pageComponent]),
            isProtected,
        }));
}

export default getRouterPaths;
