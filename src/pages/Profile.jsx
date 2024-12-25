import { Grid2 as Grid, Typography } from '@mui/material';
import React from 'react';

import { useLoginContext } from '../context';
import BaseLayout from '../helpers/BaseLayout';

export default Profile;

function Profile() {
    const { username, name } = useLoginContext();

    return (
        <BaseLayout title="Profile" hasMainContainer>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                    <Typography>{`${username} - ${name}`}</Typography>
                </Grid>
            </Grid>
        </BaseLayout>
    );
}
