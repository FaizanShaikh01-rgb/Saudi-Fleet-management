// MUI Imports
import React from 'react'

import Grid from '@mui/material/Grid2'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data = [
    {
        title: 'Fleet Size',
        stats: '120',
        avatarIcon: 'ri-truck-line',
        avatarColor: 'primary',
        trend: 'positive',
        trendNumber: '12%',
        subtitle: 'Total Vehicles'
    },
    {
        title: 'Active Vehicles',
        stats: '95',
        avatarIcon: 'ri-car-line',
        avatarColor: 'success',
        trend: 'positive',
        trendNumber: '8%',
        subtitle: 'Currently in use'
    },
    {
        title: 'Under Maintenance',
        stats: '15',
        avatarIcon: 'ri-tools-line',
        avatarColor: 'warning',
        trend: 'negative',
        trendNumber: '5%',
        subtitle: 'In maintenance'
    },
    {
        title: 'Pending Assignment',
        stats: '10',
        avatarIcon: 'ri-time-line',
        avatarColor: 'error',
        trend: 'neutral',
        trendNumber: '0%',
        subtitle: 'Awaiting assignment'
    }
]

const VehicleListCards = () => {
    return (
        <Grid container spacing={6}>
            {data.map((item, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                    <HorizontalWithSubtitle {...item} />
                </Grid>
            ))}
        </Grid>
    )
}

export default VehicleListCards
