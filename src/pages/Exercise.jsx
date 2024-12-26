import { Button } from '@mui/material';
import React, { useState } from 'react';

import { useExerciseContext } from '../context';
import { BaseLayout } from '../helpers';
import ExerciseAnswer from './ExerciseAnswer';
import ExercisePending from './ExercisePending';
import ExerciseQuestion from './ExerciseQuestion';

export default Exercise;

/** @typedef {"initial" | "question" | "answer" | "pending"} TExerciseSteps */

/** @type {TExerciseSteps} */
const initialStep = 'pending';

function Exercise() {
    const { getLessonsCount, getCurrLesson } = useExerciseContext();

    const [currStep, setCurrStep] = useState(initialStep);

    if (getLessonsCount() === 0) {
        return <BaseLayout title="Glosförhör">No more words for today.</BaseLayout>;
    }

    const lesson = getCurrLesson();

    if (!lesson) {
        return (
            <BaseLayout title="Glosförhör" hasMainContainer>
                <ExerciseInitial lesson={lesson} setCurrStep={setCurrStep} />
            </BaseLayout>
        );
    }

    switch (currStep) {
        case 'question':
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <ExerciseQuestion lesson={lesson} setCurrStep={setCurrStep} />
                </BaseLayout>
            );

        case 'answer':
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <ExerciseAnswer lesson={lesson} setCurrStep={setCurrStep} />
                </BaseLayout>
            );

        case 'pending':
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <ExercisePending lesson={lesson} setCurrStep={setCurrStep} />
                </BaseLayout>
            );

        default:
            throw new Error(`<Exercise/> failed - invalid step ${currStep}`);
    }
}

/**
 * @typedef IExerciseStepProps
 * @prop {import('../context/types').IExerciseContextLessonData} lesson
 * @prop {(value: React.SetStateAction<TExerciseSteps>) => void} setCurrStep
 */

/** @param {IExerciseStepProps} props */
function ExerciseInitial({ lesson, setCurrStep }) {
    const { gotoFirstLesson } = useExerciseContext();

    const onStart = () => {
        if (!lesson) {
            gotoFirstLesson();
        }
        setCurrStep('question');
    };

    return (
        <Button variant="contained" onClick={onStart} autoFocus>
            Let&apos;s go
        </Button>
    );
}
