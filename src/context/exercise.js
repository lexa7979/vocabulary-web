import { createContext, useContext, useState } from 'react';

/** @type {import('./types').IExerciseContextSetup} */
const defaultSetup = {
    userAnswer: '',
    setUserAnswer: () => {},
    lessons: [],
    setLessons: () => {},
    currLessonIndex: null,
    setCurrLessonIndex: () => {},
    _isDefaultSetup: true,
};

const _ExerciseContext = createContext(defaultSetup);
const ExerciseContextProvider = _ExerciseContext.Provider;

/** @returns {import('./types').IExerciseContextSetup} */
const useExerciseContextSetup = () => {
    const [userAnswer, setUserAnswer] = useState('');
    const [lessons, setLessons] = useState(defaultSetup.lessons);
    const [currLessonIndex, setCurrLessonIndex] = useState(defaultSetup.currLessonIndex);

    return {
        userAnswer,
        setUserAnswer,
        lessons,
        setLessons,
        currLessonIndex,
        setCurrLessonIndex,
    };
};

/** @returns {import('./types').IExerciseContextValue} */
const useExerciseContext = () => {
    const contextSetup = useContext(_ExerciseContext);
    const { userAnswer, setUserAnswer, lessons, currLessonIndex } = contextSetup;

    const setAllLessons = _prepareSetAllLessons(contextSetup);
    const getLessonAtIndex = _prepareGetLessonAtIndex(contextSetup);
    const gotoLessonAtIndex = _prepareGotoLessonAtIndex(contextSetup);

    return {
        userAnswer,
        setUserAnswer,

        lessons,
        setAllLessons,
        getLessonsCount: () => lessons.length,
        hasCurrLesson: () => currLessonIndex != null,
        isFirstLesson: () => currLessonIndex === 0,
        isLastLesson: () => currLessonIndex != null && currLessonIndex + 1 === lessons.length,

        getLessonAtIndex,
        getFirstLesson: () => getLessonAtIndex(0),
        getPrevLesson: () => getLessonAtIndex(currLessonIndex - 1),
        getCurrLesson: () => (currLessonIndex == null ? null : lessons[currLessonIndex]),
        getNextLesson: () => getLessonAtIndex(currLessonIndex + 1),
        getLastLesson: () => getLessonAtIndex(lessons.length - 1),

        gotoLessonAtIndex,
        gotoFirstLesson: () => gotoLessonAtIndex(0),
        gotoPrevLesson: () => gotoLessonAtIndex(currLessonIndex - 1),
        gotoNextLesson: () => gotoLessonAtIndex(currLessonIndex + 1),
        gotoLastLesson: () => gotoLessonAtIndex(lessons.length - 1),
    };
};

/** @param {import('./types').IExerciseContextSetup} contextSetup */
function _prepareSetAllLessons({ setLessons, setCurrLessonIndex }) {
    /** @type {import('./types').IExerciseContextValue["setAllLessons"]} listOfLessons */
    const setAllLessons = listOfLessons => {
        if (Array.isArray(listOfLessons)) {
            setLessons(listOfLessons);
            setCurrLessonIndex(listOfLessons.length > 0 ? 0 : null);
            return;
        }
        throw new Error('setAllLessons() failed - invalid argument');
    };
    return setAllLessons;
}

/** @param {import('./types').IExerciseContextSetup} contextSetup */
function _prepareGetLessonAtIndex({ lessons }) {
    /** @param {number} index */
    const getLessonAtIndex = index => {
        if (index == null) {
            return null;
        }
        if (typeof index === 'number') {
            return index >= 0 && index < lessons.length ? lessons[index] : null;
        }
        throw new Error('getLessonAtIndex() failed - invalid argument');
    };
    return getLessonAtIndex;
}

/** @param {import('./types').IExerciseContextSetup} contextSetup */
function _prepareGotoLessonAtIndex({ lessons, setCurrLessonIndex }) {
    /** @param {number} index */
    const gotoLessonAtIndex = index => {
        if (index == null) {
            setCurrLessonIndex(null);
            return null;
        }
        if (typeof index === 'number') {
            const newIndex = index >= 0 && index < lessons.length ? index : null;
            setCurrLessonIndex(newIndex);
            return newIndex == null ? null : lessons[newIndex];
        }
        throw new Error('gotoLessonAtIndex() failed - invalid argument');
    };
    return gotoLessonAtIndex;
}

export { ExerciseContextProvider, useExerciseContextSetup, useExerciseContext };
