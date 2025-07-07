import Grid from '@mui/material/Grid2'

import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

const data = [
    { title: 'Total Trips', stats: '320', avatarIcon: 'ri-road-map-line', avatarColor: 'primary', trend: 'positive', trendNumber: '10%', subtitle: 'All trips' },
    { title: 'Active Trips', stats: '120', avatarIcon: 'ri-map-pin-line', avatarColor: 'success', trend: 'positive', trendNumber: '5%', subtitle: 'Currently active' },
    { title: 'Completed Trips', stats: '180', avatarIcon: 'ri-check-double-line', avatarColor: 'info', trend: 'positive', trendNumber: '8%', subtitle: 'Completed' },
    { title: 'Cancelled Trips', stats: '20', avatarIcon: 'ri-close-circle-line', avatarColor: 'error', trend: 'negative', trendNumber: '2%', subtitle: 'Cancelled' }
]

const TripListCards = () => (
    <Grid container spacing={6}>
        {data.map((item, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <HorizontalWithSubtitle {...item} />
            </Grid>
        ))}
    </Grid>
)

export default TripListCards 
