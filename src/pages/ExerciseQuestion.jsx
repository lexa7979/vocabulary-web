import { Box, Button, TextField } from '@mui/material';
import React from 'react';

import { WordCard } from '../components';
import { useExerciseContext } from '../context';

export default ExerciseStepQuestion;

/**
 * @typedef IProps
 * @prop {import('../context/types').IExerciseContextLessonData} lesson
 * @prop {(value: React.SetStateAction<import('./Exercise').TExerciseSteps>) => void} setCurrStep
 */

/** @param {IProps} props */
function ExerciseStepQuestion({ lesson, setCurrStep }) {
    const { userAnswer, setUserAnswer } = useExerciseContext();

    const styles = getSxStyles();

    const onCheck = () => {
        setCurrStep('answer');
    };

    /** @param {React.ChangeEvent<HTMLInputElement>} event */
    const onInput = event => {
        setUserAnswer(event.target.value);
        if (event.target.value === lesson.translation) {
            onCheck();
        }
    };

    return (
        <Box sx={styles.twoColumns}>
            <WordCard language="german" text={lesson.text} />
            <Box sx={styles.inputContainer}>
                <TextField
                    label="Swedish translation"
                    value={userAnswer}
                    onChange={onInput}
                    autoFocus
                    fullWidth
                    autoComplete="off"
                />
                <Button type="submit" variant="contained" onClick={onCheck} fullWidth>
                    Check
                </Button>
            </Box>
        </Box>
    );
}

/** @returns {import('../types').TSxStyles<"twoColumns" | "inputContainer">} */
function getSxStyles() {
    return {
        twoColumns: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: 750,
            gap: 3,
            mx: 'auto',
        },
        inputContainer: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            gap: 2,
        },
    };
}
