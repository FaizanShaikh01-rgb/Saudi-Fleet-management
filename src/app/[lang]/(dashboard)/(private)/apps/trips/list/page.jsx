// Component Imports
import TripList from '@views/apps/trips/list'

// Data Imports
import { getTripData } from '@/app/server/actions'

const TripListApp = async () => {
    const data = await getTripData()


    return <TripList tripData={data} />
}

export default TripListApp 
