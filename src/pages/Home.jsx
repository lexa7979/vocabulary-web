import React from 'react';
// import clsx from 'clsx';

import { Box, Grid, Typography } from '@material-ui/core';

import { useUserContext } from '../context';
import { Copyright, BaseLayout } from '../helpers';

export default Home;

// const useStyles = _prepareStylesHook();

function Home() {
  const userData = useUserContext();
  // const css = useStyles();

  return (
    <BaseLayout title="Home" hasMainContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Typography>{`Welcome, ${userData.name}`}</Typography>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </BaseLayout>
  );
}

// function _prepareStylesHook() {
//   return makeStyles(theme => ({
//     root: {},
//   }));
// }
