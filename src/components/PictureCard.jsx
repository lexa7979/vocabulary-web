import { Box, Card, CardMedia } from '@mui/material';
import React from 'react';
import LanguageIcon from './LanguageIcon';

export default PictureCard;

/**
 * @typedef IProps
 * @prop {import('./LanguageIcon').TIconLanguages} [language]
 * @prop {string} imageUrl
 * @prop {string} imageTitle
 */

/** @param {IProps} props */
function PictureCard({ language, imageUrl, imageTitle }) {
    const styles = getSxStyles();

    return (
        <Card elevation={8} sx={styles.card}>
            {language && (
                <Box sx={styles.languageIcon}>
                    <LanguageIcon language={language} />
                </Box>
            )}
            {imageUrl && (
                <Box sx={styles.mediaContainer}>
                    <CardMedia component="img" image={imageUrl} alt={imageTitle} title={imageTitle} sx={styles.media} />
                </Box>
            )}
        </Card>
    );
}

/** @returns {import('../types').TSxStyles<"card" | "languageIcon" | "mediaContainer" | "media">} */
function getSxStyles() {
    return {
        card: {
            height: 175,
            position: 'relative',
        },
        languageIcon: {
            position: 'absolute',
            left: 0,
            top: 0,
        },
        mediaContainer: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        media: {
            maxHeight: '100%',
            maxWidth: '100%',
            height: 'auto',
            width: 'auto',
        },
    };
}
