import * as Icons from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import React from 'react';

import { WordCard } from '../components';
import { useExerciseContext } from '../context';

export default ExerciseStepAnswer;

/**
 * @typedef IProps
 * @prop {import('../context/types').IExerciseContextLessonData} lesson
 * @prop {(value: React.SetStateAction<import('./Exercise').TExerciseSteps>) => void} setCurrStep
 */

/** @param {IProps} props */
function ExerciseStepAnswer({ lesson, setCurrStep }) {
    const { userAnswer, setUserAnswer, gotoNextLesson } = useExerciseContext();

    const hasCorrectAnswer = userAnswer === lesson.translation;

    const styles = getSxStyles();

    const onWrong = () => {
        gotoNextLesson();
        setCurrStep('pending');
        setUserAnswer('');
    };

    const onCorrect = () => {
        gotoNextLesson();
        setCurrStep('pending');
        setUserAnswer('');
    };

    return (
        <Box sx={styles.twoColumns}>
            <WordCard language="german" text={lesson.text} />
            <WordCard language="swedish" text={lesson.translation} />
            {userAnswer && (
                <>
                    <div />
                    <TextField
                        label="You answered"
                        value={userAnswer}
                        color={hasCorrectAnswer ? 'success' : 'error'}
                        focused
                        fullWidth
                    />
                </>
            )}
            <div />
            <Box sx={styles.buttons}>
                <Button
                    variant={hasCorrectAnswer ? 'outlined' : 'contained'}
                    startIcon={<Icons.Dangerous />}
                    onClick={onWrong}
                    autoFocus={!hasCorrectAnswer}
                >
                    Wrong
                </Button>
                <Button
                    variant={hasCorrectAnswer ? 'contained' : 'outlined'}
                    startIcon={<Icons.Verified />}
                    onClick={onCorrect}
                    autoFocus={hasCorrectAnswer}
                >
                    Correct
                </Button>
                {/* <Button variant="outlined" startIcon={<Icons.Flaky />}>
                        Partly correct
                    </Button>
                    <Button variant="outlined" startIcon={<Icons.PauseCircle />}>
                        Skip
                    </Button> */}
            </Box>
        </Box>
    );
}

/** @returns {import('../types').TSxStyles<"twoColumns" | "buttons">} */
function getSxStyles() {
    return {
        twoColumns: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: 750,
            gap: 3,
            mx: 'auto',
        },
        buttons: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
        },
    };
}
