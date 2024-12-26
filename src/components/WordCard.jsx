import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';

import LanguageIcon from './LanguageIcon';

export default WordCard;

/**
 * @typedef IWordCardProps
 * @prop {import('./LanguageIcon').TIconLanguages} language
 * @prop {string} text
 */

/** @param {IWordCardProps} props */
function WordCard({ language, text }) {
    const styles = getSxStyles();

    return (
        <Card elevation={8} sx={styles.card}>
            <LanguageIcon language={language} />
            <CardContent sx={styles.cardContent}>
                <Typography variant="h5">{text}</Typography>
            </CardContent>
        </Card>
    );
}

/** @returns {import('../types').TSxStyles<"card" | "cardContent">} */
function getSxStyles() {
    return {
        card: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'flex-start',
            minHeight: 175,
        },
        cardContent: {
            alignSelf: 'stretch',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
    };
}
