import * as Icons from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import { useUserContext } from '../context';
import Copyright from '../helpers/Copyright';

export default Login;

// const useStyles = _prepareStylesHook();

function Login() {
  // const css = useStyles();
  const css = {};

  const userData = useUserContext();

  const _signIn = () => userData.login('lexa', 'Alexander Urban');

  return (
    <Container component="main" maxWidth="xs" className="Login">
      <div className={css.paper}>
        <Avatar className={css.avatar}>
          <Icons.LockOutlined />
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

// function _prepareStylesHook() {
//   return makeStyles(theme => ({
//     paper: {
//       marginTop: theme.spacing(8),
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     avatar: {
//       margin: theme.spacing(1),
//       backgroundColor: theme.palette.secondary.main,
//     },
//     form: {
//       width: '100%', // Fix IE 11 issue.
//       marginTop: theme.spacing(1),
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2),
//     },
//   }));
// }
