import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

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
    const { ExerciseContextProvider } = Exercise;

    describe(`exports a component ${bold('<ExerciseContext/>')} which`, () => {
        function getMockedExerciseContextSetup() {
            /* @type {import('.').IExerciseContextSetup} */
            const contextSetup = {
                lessons: [],
                setLessons: jest.fn(),
                currLessonIndex: null,
                setCurrLessonIndex: jest.fn(),
            };
            return contextSetup;
        }

        it(IS_ACCESSIBLE, () => expect(ExerciseContextProvider).toBeFunction());

        it(`${green('expects')} one argument (props)`, () => expect(ExerciseContextProvider).toHaveLength(1));

        it(`- when used w/o any props - ${green('renders nothing')}`, () => {
            const { container } = render(<ExerciseContextProvider value={getMockedExerciseContextSetup()} />);

            expect(container).toBeEmptyDOMElement();
        });

        it(`- when used with children - ${green('renders children')}`, () => {
            const { container } = render(
                <ExerciseContextProvider value={getMockedExerciseContextSetup()}>
                    <div>Test DIV 1</div>
                    <div>Test DIV 2</div>
                </ExerciseContextProvider>
            );

            expect(container.childNodes).toHaveLength(2);
            expect(container.childNodes[0]).toHaveTextContent('Test DIV 1');
            expect(container.childNodes[1]).toHaveTextContent('Test DIV 2');
        });
    });
}

function runTestsAboutUseExerciseContext() {
    const { useExerciseContext } = Exercise;

    describe(`exports a hook ${bold('useExerciseContext()')} which`, () => {
        it(IS_ACCESSIBLE, () => expect(useExerciseContext).toBeFunction());

        it(`${green('expects')} no argument`, () => expect(useExerciseContext).toHaveLength(0));

        it.skip('- when used w/o argument - ...', () => {
            // const result = useExerciseContext();
        });
    });
}
