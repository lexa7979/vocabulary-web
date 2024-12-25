import React from 'react';

export interface IMainContextSetup {
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    _isDefaultSetup?: boolean;
}

export interface IMainContextValue {
    isDrawerOpen: boolean;
    toggleDrawer: VoidFunction;
}

export interface ILoginContextSetup {
    userData: ILoginData;
    setUserData: React.Dispatch<React.SetStateAction<ILoginData>>;
    _isDefaultSetup?: boolean;
}

export interface ILoginContextValue {
    username?: string;
    name?: string;
    isLoggedIn: () => boolean;
    login: (username: string, name: string) => void;
    logout: () => void;
}

export interface IUserData {
    username: string;
    name: string;
    active: boolean;
}

export interface IExerciseContextSetup {
    lessons: IExerciseContextLessonData[];
    setLessons: React.Dispatch<React.SetStateAction<IExerciseContextLessonData[]>>;
    currLessonIndex: number;
    setCurrLessonIndex: React.Dispatch<React.SetStateAction<number>>;
    _isDefaultSetup?: boolean;
}

export interface IExerciseContextValue {
    lessons: IExerciseContextLessonData[];
    setAllLessons: (listOfLessons: IExerciseContextLessonData[]) => void;
    getLessonsCount: () => number;
    hasCurrLesson: () => boolean;
    isFirstLesson: () => boolean;
    isLastLesson: () => boolean;
    getLessonAtIndex: (index: number) => IExerciseContextLessonData | null;
    getFirstLesson: () => IExerciseContextLessonData | null;
    getPrevLesson: () => IExerciseContextLessonData | null;
    getCurrLesson: () => IExerciseContextLessonData | null;
    getNextLesson: () => IExerciseContextLessonData | null;
    getLastLesson: () => IExerciseContextLessonData | null;
    gotoLessonAtIndex: (index: number) => IExerciseContextLessonData | null;
    gotoFirstLesson: () => IExerciseContextLessonData | null;
    gotoPrevLesson: () => IExerciseContextLessonData | null;
    gotoNextLesson: () => IExerciseContextLessonData | null;
    gotoLastLesson: () => IExerciseContextLessonData | null;
}

export interface IExerciseContextLessonData {
    text: string;
    translation: string;
    comment?: string;
}
