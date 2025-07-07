import { useState, useEffect } from 'react'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const TableFilters = ({ setData, tableData }) => {
    const [status, setStatus] = useState('')

    useEffect(() => {
        const filteredData = tableData?.filter(trip => {
            if (status && trip.status !== status) return false

            return true
        })

        setData(filteredData || [])
    }, [status, tableData, setData])

    return (
        <CardContent>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id='status-select'>Select Status</InputLabel>
                        <Select
                            fullWidth
                            id='select-status'
                            label='Select Status'
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            labelId='status-select'
                            inputProps={{ placeholder: 'Select Status' }}
                        >
                            <MenuItem value=''>Select Status</MenuItem>
                            <MenuItem value='active'>Active</MenuItem>
                            <MenuItem value='completed'>Completed</MenuItem>
                            <MenuItem value='cancelled'>Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </CardContent>
    )
}

export default TableFilters 
