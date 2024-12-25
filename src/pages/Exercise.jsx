import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import * as Icons from '@mui/icons-material';

import { useExerciseContext } from '../context';
import BaseLayout from '../helpers/BaseLayout';

export default Exercise;

const STEPS = {
    INITIAL: 'initial',
    QUESTION: 'question',
    ANSWER: 'answer',
    PENDING: 'pending',
};

function Exercise() {
    const { getLessonsCount, isLastLesson, getCurrLesson, gotoFirstLesson, gotoNextLesson } = useExerciseContext();

    const [currStep, setCurrStep] = useState(STEPS.INITIAL);
    const [userInput, setUserInput] = useState('');

    const styles = getSxStyles();

    /** @type {React.RefObject<HTMLButtonElement>} */
    const primaryButtonRef = useRef(null);
    /** @type {React.RefObject<HTMLInputElement>} */
    const focusedInputRef = useRef(null);

    useEffect(() => {
        if (focusedInputRef.current) {
            focusedInputRef.current.focus();
        }
        if (primaryButtonRef.current) {
            primaryButtonRef.current.focus();
        }
    }, [focusedInputRef.current, primaryButtonRef.current]);

    if (getLessonsCount() === 0 || (currStep === STEPS.PENDING && isLastLesson())) {
        return <BaseLayout title="Glosförhör">No more words for today.</BaseLayout>;
    }

    const lesson = getCurrLesson();

    if (!lesson || currStep === STEPS.INITIAL) {
        const onStart = () => {
            if (!lesson) {
                gotoFirstLesson();
            }
            setCurrStep(STEPS.QUESTION);
        };
        return (
            <BaseLayout title="Glosförhör" hasMainContainer>
                <Button variant="contained" onClick={onStart} ref={primaryButtonRef}>
                    Let&apos;s go
                </Button>
            </BaseLayout>
        );
    }

    switch (currStep) {
        case STEPS.QUESTION: {
            const onCheck = () => {
                setCurrStep(STEPS.ANSWER);
            };
            /** @param {React.ChangeEvent<HTMLInputElement} event */
            const onInput = event => {
                setUserInput(event.target.value);
                if (event.target.value === lesson.translation) {
                    onCheck();
                }
            };
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <Box sx={styles.twoColumns}>
                        <div>Translate:</div>
                        <div>{lesson.text}</div>
                        <div />
                        <TextField label="Swedish" value={userInput} onChange={onInput} inputRef={focusedInputRef} />
                        <Button variant="contained" onClick={onCheck}>
                            Check
                        </Button>
                    </Box>
                </BaseLayout>
            );
        }
        case STEPS.ANSWER: {
            const onWrong = () => {
                setCurrStep(STEPS.PENDING);
                setUserInput('');
            };
            const onCorrect = () => {
                setCurrStep(STEPS.PENDING);
                setUserInput('');
            };
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <Box sx={styles.twoColumns}>
                        <div>Svenska</div>
                        <div>Tyska</div>
                        <div>{lesson.text}</div>
                        <div>{lesson.translation}</div>
                        <div>{lesson.comment}</div>
                        <div />
                        <Button variant="outlined" startIcon={<Icons.Dangerous />} onClick={onWrong}>
                            Wrong
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Icons.Verified />}
                            onClick={onCorrect}
                            ref={primaryButtonRef}
                        >
                            Correct
                        </Button>
                    </Box>
                </BaseLayout>
            );
        }
        case STEPS.PENDING: {
            const onNext = () => {
                gotoNextLesson();
                setCurrStep(STEPS.QUESTION);
            };
            return (
                <BaseLayout title="Glosförhör" hasMainContainer>
                    <Button variant="contained" onClick={onNext} ref={primaryButtonRef}>
                        Next word
                    </Button>
                </BaseLayout>
            );
        }
        default:
            throw new Error(`<Exercise/> failed - invalid step ${currStep}`);
    }
}

/** @returns {import('../types').TSxStyles<"twoColumns">} */
function getSxStyles() {
    return {
        twoColumns: {
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: 1,
        },
    };
}
