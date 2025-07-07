// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import VehicleListTable from './VehicleListTable'
import VehicleListCards from './VehicleListCards'

const VehicleList = ({ vehicleData }) => {
    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <VehicleListCards />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <VehicleListTable tableData={vehicleData} />
            </Grid>
        </Grid>
    )
}

export default VehicleList 
