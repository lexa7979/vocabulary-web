import React from 'react';

import { useExerciseContext } from '../context';
import { BaseLayout } from '../helpers';

export default Exercise;

const TEST_LESSONS = [
  { text: 'Wort 1', translation: 'ord 1', comment: 'dummy translation 1' },
  { text: 'Wort 2', translation: 'ord 2', comment: 'dummy translation 2' },
  { text: 'Wort 3', translation: 'ord 3', comment: 'dummy translation 3' },
  { text: 'Wort 4', translation: 'ord 4', comment: 'dummy translation 4' },
];

function Exercise() {
  const context = useExerciseContext();

  if (context.hasCurrLesson()) {
    const lesson = context.getCurrLesson();
    return (
      <BaseLayout title="Glosförhör">
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
          <div>Svenska</div>
          <div>Tyska</div>
          <div>{lesson.text}</div>
          <div>{lesson.translation}</div>
          <div>{lesson.comment}</div>
          <div />
        </div>
      </BaseLayout>
    );
  }

  if (context.getLessonsCount() > 0) {
    return (
      <BaseLayout title="Glosförhör">
        <button type="button" onClick={() => context.gotoFirstLesson()}>
          Start
        </button>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Glosförhor">
      <button type="button" onClick={() => context.setAllLessons(TEST_LESSONS)}>
        Init
      </button>
    </BaseLayout>
  );
}
