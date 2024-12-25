import { Grid2, Typography } from '@mui/material';
import React from 'react';

import { useLoginContext } from '../context';
import BaseLayout from '../helpers/BaseLayout';

export default Home;

function Home() {
    const userData = useLoginContext();

    return (
        <BaseLayout title="Home" hasMainContainer>
            <Grid2 container spacing={3}>
                <Grid2 columns={{ xs: 12, md: 8, lg: 9 }}>
                    <Typography>{`Welcome, ${userData.name}`}</Typography>
                </Grid2>
            </Grid2>
        </BaseLayout>
    );
}
