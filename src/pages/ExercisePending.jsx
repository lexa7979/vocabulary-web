import { Box, Button } from '@mui/material';
import React from 'react';

import { PictureCard } from '../components';

export default ExercisePending;

/**
 * @typedef IProps
 * @prop {import('../context/types').IExerciseContextLessonData} lesson
 * @prop {(value: React.SetStateAction<import('./Exercise').TExerciseSteps>) => void} setCurrStep
 */

/** @param {IProps} props */
function ExercisePending({ lesson, setCurrStep }) {
    const styles = getSxStyles();

    const onNext = () => {
        setCurrStep('question');
    };

    return (
        <Box sx={styles.twoColumns}>
            <PictureCard
                language="german"
                imageUrl="https://dictionary.cambridge.org/de/images/full/book_noun_001_01679.jpg"
                // imageUrl="https://as1.ftcdn.net/v2/jpg/00/66/34/82/1000_F_66348236_upbTvfzNFjIAm4XJqNUo3Gz4g8igW7TH.jpg"
                imageTitle={lesson.text}
            />
            <Box sx={styles.inputContainer}>
                <Button variant="contained" onClick={onNext} autoFocus>
                    Continue
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
