import React, { createContext } from 'react';

// const dummyContextData = _getFullContextData(_getDummyData())

// const Context = createContext(dummyContextData);

// const ExerciseContextProvider = Context.Provider;

const Global = {
  context: null,
  dummyData: _getDummyData(),
};

export { ExerciseContext, useExerciseContext };

/**
 * Component `<ExerciseContext/>`
 * returns all given children and enables them to access the context.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children]
 */
function ExerciseContext({ children }) {
  const [data, setData] = React.useState(_getInitData());

  if (Global.context == null) {
    const dummyContextData = _getFullContextData(Global.dummyData, () => {});
    Global.context = React.createContext(dummyContextData);
  }

  const { Provider } = Global.context;

  return <Provider value={_getFullContextData(data, setData)}>{children}</Provider>;
}

/**
 * React hook `useExerciseContext()`
 * which will return the updated context-data if it is used
 * inside a component which is wrapped by a <ExerciseContext/>.
 *
 * The function will return some semi-functional dummy-data
 * if the <ExerciseContext/> is missing. This might especially
 * be useful in unit-tests of components.
 *
 * @returns {ExerciseContextDataAndMethods} current context-data
 */
function useExerciseContext() {
  if (Global.context != null) {
    return React.useContext(Global.context);
  }

  const dummyContextData = _getFullContextData(Global.dummyData, () => {});
  return dummyContextData;
}

/**
 * @typedef {object} ExerciseContextFullData
 * @prop {ExerciseContextLessonData[]} lessons
 * @prop {number} [currLessonIndex]
 *
 * @typedef {object} ExerciseContextDataAndMethods
 * @prop {ExerciseContextLessonData[]} lessons
 * @prop {number} [currLessonIndex]
 * @prop {(listOfLessons : ExerciseContextLessonData[]) => void} setAllLessons
 * @prop {(index : number) => ExerciseContextLessonData|null} getLessonAtIndex
 * @prop {() => ExerciseContextLessonData|null} getFirstLesson
 * @prop {() => ExerciseContextLessonData|null} getPrevLesson
 * @prop {() => ExerciseContextLessonData|null} getCurrLesson
 * @prop {() => ExerciseContextLessonData|null} getNextLesson
 * @prop {() => ExerciseContextLessonData|null} getLastLesson
 * @prop {() => number} getLessonsCount
 * @prop {() => boolean} hasCurrLesson
 * @prop {(index : number) => ExerciseContextLessonData|null} gotoLessonAtIndex
 * @prop {() => ExerciseContextLessonData|null} gotoFirstLesson
 * @prop {() => ExerciseContextLessonData|null} gotoPrevLesson
 * @prop {() => ExerciseContextLessonData|null} gotoNextLesson
 * @prop {() => ExerciseContextLessonData|null} gotoLastLesson
 *
 * @typedef {object} ExerciseContextLessonData
 * @prop {string} text
 * @prop {string} translation
 * @prop {string} [comment]
 */

/** @returns {ExerciseContextFullData} */
function _getInitData() {
  return {
    lessons: [],
    currLessonIndex: null,
  };
}

/** @returns {ExerciseContextFullData} */
function _getDummyData() {
  return {
    lessons: [
      { text: 'Wort 1', translation: 'ord 1', comment: 'dummy translation 1' },
      { text: 'Wort 2', translation: 'ord 2', comment: 'dummy translation 2' },
      { text: 'Wort 3', translation: 'ord 3', comment: 'dummy translation 3' },
      { text: 'Wort 4', translation: 'ord 4', comment: 'dummy translation 4' },
    ],
    currLessonIndex: 1,
  };
}

/**
 * @param {ExerciseContextFullData} data
 * @param {(newData: ExerciseContextFullData) => void} setData callback to change the context-data
 *
 * @returns {ExerciseContextDataAndMethods} updated context-data filled with some public methods
 */
function _getFullContextData(data, setData) {
  const { lessons, currLessonIndex } = data;

  /** @param {ExerciseContextLessonData[]} listOfLessons */
  const setAllLessons = listOfLessons => {
    if (Array.isArray(listOfLessons)) {
      setData({ lessons: listOfLessons, currLessonIndex: listOfLessons.length > 0 ? 0 : null });
    }
    throw new Error('setAllLessons() failed - invalid argument');
  };

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

  const getFirstLesson = () => getLessonAtIndex(0);
  const getPrevLesson = () => getLessonAtIndex(currLessonIndex - 1);
  const getCurrLesson = () => (currLessonIndex == null ? null : lessons[currLessonIndex]);
  const getNextLesson = () => getLessonAtIndex(currLessonIndex + 1);
  const getLastLesson = () => getLessonAtIndex(lessons.length - 1);

  const getLessonsCount = () => lessons.length;
  const hasCurrLesson = () => currLessonIndex != null;

  /** @param {number} index */
  const gotoLessonAtIndex = index => {
    if (index == null) {
      setData({ lessons, currLessonIndex: null });
      return null;
    }
    if (typeof index === 'number') {
      const newIndex = index >= 0 && index < lessons.length ? index : null;
      setData({ lessons, currLessonIndex: newIndex });
      return newIndex == null ? null : lessons[newIndex];
    }
    throw new Error('gotoLessonAtIndex() failed - invalid argument');
  };

  const gotoFirstLesson = () => gotoLessonAtIndex(0);
  const gotoPrevLesson = () => gotoLessonAtIndex(currLessonIndex - 1);
  const gotoNextLesson = () => gotoLessonAtIndex(currLessonIndex + 1);
  const gotoLastLesson = () => gotoLessonAtIndex(lessons.length - 1);

  return {
    lessons,
    currLessonIndex,

    setAllLessons,
    getLessonAtIndex,
    getFirstLesson,
    getLastLesson,
    getPrevLesson,
    getCurrLesson,
    getNextLesson,

    getLessonsCount,
    hasCurrLesson,

    gotoLessonAtIndex,
    gotoFirstLesson,
    gotoLastLesson,
    gotoPrevLesson,
    gotoNextLesson,
  };
}
