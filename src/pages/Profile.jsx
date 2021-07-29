import React from 'react';

import { Grid, Typography } from '@material-ui/core';

import { useUserContext } from '../context';
import { BaseLayout } from '../helpers';

export default Profile;

function Profile() {
  const userData = useUserContext();

  return (
    <BaseLayout title="Profile" hasMainContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Typography>{`${userData.username} - ${userData.name}`}</Typography>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}
