import { Grid2 as Grid, Typography } from '@mui/material';
import React from 'react';

import { useUserContext } from '../context';
import BaseLayout from '../helpers/BaseLayout';

export default Profile;

function Profile() {
    const userData = useUserContext();

    return (
        <BaseLayout title="Profile" hasMainContainer>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                    <Typography>{`${userData.username} - ${userData.name}`}</Typography>
                </Grid>
            </Grid>
        </BaseLayout>
    );
}
