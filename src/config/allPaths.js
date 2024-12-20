/**
 * @typedef IRouterPath
 * @property {string} path
 * @property {number} posDrawer
 * @property {number} posRouter
 * @property {string} pageHeader
 * @property {keyof import("@mui/icons-material")} pageIcon
 * @property {keyof import("../pages")} pageComponent
 * @property {boolean} isProtected
 */

/** @type {IRouterPath[]} */
const allPaths = [
    {
        path: '/',
        posDrawer: 0,
        posRouter: 90,
        pageHeader: 'Home',
        pageIcon: 'House',
        pageComponent: 'Home',
        isProtected: true,
    },
    {
        path: '/profile',
        posDrawer: 1,
        posRouter: 10,
        pageHeader: 'Profile',
        pageIcon: 'AccountCircle',
        pageComponent: 'Profile',
        isProtected: true,
    },
    {
        path: '/words',
        posDrawer: 1,
        posRouter: 10,
        pageHeader: 'Words',
        pageIcon: 'ViewList',
        pageComponent: 'Words',
        isProtected: true,
    },
    {
        path: '/exercise',
        posDrawer: 1,
        posRouter: 10,
        pageHeader: 'Glosförhör',
        pageIcon: 'QuestionAnswer',
        pageComponent: 'Exercise',
        isProtected: true,
    },
];

export default allPaths;
