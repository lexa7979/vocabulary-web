import React from 'react';
import PropTypes from 'prop-types';

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
 * @param {*} [props.children]
 *
 * @returns {*} JSX
 */
function ExerciseContext(props) {
  const { children } = props;

  if (Global.context == null) {
    const dummyContextData = _getFullContextData(Global.dummyData, () => {});
    Global.context = React.createContext(dummyContextData);
  }

  const { Provider } = Global.context;

  const [data, setData] = React.useState(_getInitData());
  const value = _getFullContextData(data, setData);

  return <Provider value={value}>{children}</Provider>;
}

ExerciseContext.propTypes = {
  children: PropTypes.node,
};
ExerciseContext.defaultProps = {
  children: null,
};

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
 * @typedef {object} ExerciseContextLessonData
 * @property {string} text
 * @property {string} translation
 * @property {string} [comment]
 *
 * @typedef {object} ExerciseContextFullData
 * @property {ExerciseContextLessonData[]} lessons
 * @property {number} [currLessonIndex]
 *
 * @typedef {object} ExerciseContextDataAndMethods
 * @property {ExerciseContextLessonData[]} lessons
 * @property {number} [currLessonIndex]
 * @property {(listOfLessons : ExerciseContextLessonData[]) => void} setAllLessons
 * @property {(index : number) => ExerciseContextLessonData|null} getLessonAtIndex
 * @property {() => ExerciseContextLessonData|null} getFirstLesson
 * @property {() => ExerciseContextLessonData|null} getPrevLesson
 * @property {() => ExerciseContextLessonData|null} getCurrLesson
 * @property {() => ExerciseContextLessonData|null} getNextLesson
 * @property {() => ExerciseContextLessonData|null} getLastLesson
 * @property {() => number} getLessonsCount
 * @property {() => boolean} hasCurrLesson
 * @property {(index : number) => ExerciseContextLessonData|null} gotoLessonAtIndex
 * @property {() => ExerciseContextLessonData|null} gotoFirstLesson
 * @property {() => ExerciseContextLessonData|null} gotoPrevLesson
 * @property {() => ExerciseContextLessonData|null} gotoNextLesson
 * @property {() => ExerciseContextLessonData|null} gotoLastLesson
 */

/**
 * @returns {{lessons: ExerciseContextLessonData[], currLessonIndex?: number}}
 */
function _getInitData() {
  return {
    lessons: [],
    currLessonIndex: null,
  };
}

/**
 * @returns {{lessons: ExerciseContextLessonData[], currLessonIndex?: number}}
 */
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
 * @param {object} data
 * @param {(newData) => void} setData callback to change the context-data
 * @returns {ExerciseContextDataAndMethods} updated context-data filled with some public methods
 */
function _getFullContextData(data, setData) {
  const { lessons, currLessonIndex } = data;

  const setAllLessons = listOfLessons => {
    if (Array.isArray(listOfLessons)) {
      setData({ lessons: listOfLessons, currLessonIndex: listOfLessons.length > 0 ? 0 : null });
    }
    throw new Error('setAllLessons() failed - invalid argument');
  };

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
