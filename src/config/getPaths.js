import { createElement } from 'react';

import {
  House as HomePageIcon,
  AccountCircle as ProfilePageIcon,
  ViewList as WordsPageIcon,
  QuestionAnswer as ExercisePageIcon,
} from '@material-ui/icons';

import { Home, Profile, Words, Exercise } from '../pages';

export { getRouterPaths, getDrawerPaths };

const ALL_PATHS = [
  {
    path: '/',
    posDrawer: 0,
    posRouter: 90,
    pageHeader: 'Home',
    pageIcon: HomePageIcon,
    pageComponent: Home,
    isProtected: true,
  },
  {
    path: '/profile',
    posDrawer: 1,
    posRouter: 10,
    pageHeader: 'Profile',
    pageIcon: ProfilePageIcon,
    pageComponent: Profile,
    isProtected: true,
  },
  {
    path: '/words',
    posDrawer: 1,
    posRouter: 10,
    pageHeader: 'Words',
    pageIcon: WordsPageIcon,
    pageComponent: Words,
    isProtected: true,
  },
  {
    path: '/exercise',
    posDrawer: 1,
    posRouter: 10,
    pageHeader: 'Glosförhör',
    pageIcon: ExercisePageIcon,
    pageComponent: Exercise,
    isProtected: true,
  },
];

function getRouterPaths() {
  return ALL_PATHS.filter(({ posRouter }) => posRouter != null)
    .sort((itemA, itemB) => itemA.posRouter - itemB.posRouter)
    .map(({ path, pageComponent, isProtected }) => ({
      path,
      component: createElement(pageComponent),
      isProtected,
    }));
}

function getDrawerPaths() {
  return ALL_PATHS.filter(({ posDrawer }) => posDrawer != null)
    .sort((itemA, itemB) => itemA.posDrawer - itemB.posDrawer)
    .map(({ path, pageIcon, pageHeader }) => ({
      path,
      icon: createElement(pageIcon),
      caption: pageHeader,
    }));
}
