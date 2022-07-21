import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { bold, green, IS_ACCESSIBLE } from '../../test';

import * as Exercise from './exercise';

describe(bold('Context "exercise"'), () => {
  it(`${green('exports')} 2 items as expected`, () => {
    expect(Exercise).toContainAllKeys(['ExerciseContext', 'useExerciseContext']);
  });

  runTestsAboutExerciseContextProvider();
  runTestsAboutUseExerciseContext();
});

function runTestsAboutExerciseContextProvider() {
  const { ExerciseContext } = Exercise;

  describe(`exports a component ${bold('<ExerciseContext/>')} which`, () => {
    it(IS_ACCESSIBLE, () => expect(ExerciseContext).toBeFunction());

    it(`${green('expects')} one argument (props)`, () => expect(ExerciseContext).toHaveLength(1));

    it(`- when used w/o any props - ${green('renders nothing')}`, () => {
      const { innerHTML } = render(<ExerciseContext />).container;

      expect(innerHTML).toBe('');
    });

    it(`- when used with children - ${green('renders children')}`, () => {
      const component = (
        <ExerciseContext>
          <div>Test DIV 1</div>
          <div>Test DIV 2</div>
        </ExerciseContext>
      );

      const { childNodes } = render(component).container;

      expect(childNodes).toHaveLength(2);
      expect(childNodes[0]).toHaveTextContent('Test DIV 1');
      expect(childNodes[1]).toHaveTextContent('Test DIV 2');
    });
  });
}

function runTestsAboutUseExerciseContext() {
  const { useExerciseContext } = Exercise;

  describe(`exports a hook ${bold('useExerciseContext()')} which`, () => {
    it(IS_ACCESSIBLE, () => expect(useExerciseContext).toBeFunction());

    it(`${green('expects')} no argument`, () => expect(useExerciseContext).toHaveLength(0));

    it.skip('- when used w/o argument - ...', () => {
      const result = useExerciseContext();
    });
  });
}
