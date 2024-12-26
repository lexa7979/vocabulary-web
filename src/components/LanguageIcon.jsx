import { CardMedia } from '@mui/material';
import React from 'react';

export default LanguageIcon;

/** @typedef {"german" | "swedish"} TIconLanguages */

/** @param {{ language: TIconLanguages}} props */
function LanguageIcon({ language }) {
    switch (language) {
        case 'german':
            return (
                <CardMedia
                    component="img"
                    alt="German"
                    height="24"
                    sx={{ width: 'auto' }}
                    image="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/800px-Flag_of_Germany.svg.png"
                />
            );

        case 'swedish':
            return (
                <CardMedia
                    component="img"
                    alt="Swedish"
                    height="24"
                    sx={{ width: 'auto' }}
                    image="https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/320px-Flag_of_Sweden.svg.png"
                />
            );

        default:
            return null;
    }
}
