import * as Icons from '@mui/icons-material';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from '@mui/material';
import React from 'react';

import { useExerciseContext, useLoginContext } from '../context';
import Copyright from '../helpers/Copyright';

export default Login;

const TEST_LESSONS = [
    { text: 'Wort 1', translation: 'ord 1', comment: 'dummy translation 1' },
    { text: 'Wort 2', translation: 'ord 2', comment: 'dummy translation 2' },
    { text: 'Wort 3', translation: 'ord 3', comment: 'dummy translation 3' },
    { text: 'Wort 4', translation: 'ord 4', comment: 'dummy translation 4' },
];

function Login() {
    const { login } = useLoginContext();
    const { setAllLessons } = useExerciseContext();

    const styles = getSxStyles();

    const _signIn = () => {
        login('lexa', 'Alexander Urban');
        setAllLessons(TEST_LESSONS);
    };

    return (
        <Container component="main" maxWidth="xs" className="Login">
            <Box sx={styles.paper}>
                <Avatar sx={styles.avatar}>
                    <Icons.LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <Box component="form" sx={styles.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        disabled
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        disabled
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                        disabled
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={styles.submit}
                        onClick={_signIn}
                    >
                        Log In
                    </Button>
                </Box>
            </Box>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}

/** @returns {import('../types').TSxStyles<"paper" | "avatar" | "form" | "submit">} */
function getSxStyles() {
    return {
        paper: {
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: theme => ({
            m: 1,
            backgroundColor: theme.palette.secondary.main,
        }),
        form: {
            width: '100%', // Fix IE 11 issue.
            mt: 1,
        },
        submit: {
            mt: 3,
            mx: 2,
        },
    };
}
