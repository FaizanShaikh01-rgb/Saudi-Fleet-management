// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TripListTable from './TripListTable'
import TripListCards from './TripListCards'

const TripList = ({ tripData }) => {
    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <TripListCards />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TripListTable tableData={tripData} />
            </Grid>
        </Grid>
    )
}

export default TripList 
