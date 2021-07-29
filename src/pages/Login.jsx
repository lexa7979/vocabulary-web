import React from 'react';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { useUserContext } from '../context';
import Copyright from '../helpers/Copyright';

export default Login;

const useStyles = _prepareStylesHook();

function Login() {
  const userData = useUserContext();
  const css = useStyles();

  const _signIn = () => userData.login('lexa', 'Alexander Urban');

  return (
    <Container component="main" maxWidth="xs" className="Login">
      <div className={css.paper}>
        <Avatar className={css.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form className={css.form} noValidate>
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
            className={css.submit}
            onClick={_signIn}
          >
            Log In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

function _prepareStylesHook() {
  return makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
}
