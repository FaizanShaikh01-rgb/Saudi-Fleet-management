// Component Imports
import VehicleList from '@views/apps/vehicles/list'

// Data Imports
// You need to implement getVehicleData in your server actions or use static data for now
import { getVehicleData } from '@/app/server/actions'

const VehicleListApp = async () => {
    // Vars
    const data = await getVehicleData()

    return <VehicleList vehicleData={data} />
}

export default VehicleListApp 
