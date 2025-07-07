// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const TableFilters = ({ setData, tableData }) => {
    // States
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        const filteredData = tableData?.filter(vehicle => {
            if (type && vehicle.type !== type) return false
            if (status && vehicle.status !== status) return false

            return true
        })

        setData(filteredData || [])
    }, [type, status, tableData, setData])

    return (
        <CardContent>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id='type-select'>Select Type</InputLabel>
                        <Select
                            fullWidth
                            id='select-type'
                            value={type}
                            onChange={e => setType(e.target.value)}
                            label='Select Type'
                            labelId='type-select'
                            inputProps={{ placeholder: 'Select Type' }}
                        >
                            <MenuItem value=''>Select Type</MenuItem>
                            <MenuItem value='Truck'>Truck</MenuItem>
                            <MenuItem value='Car'>Car</MenuItem>
                            <MenuItem value='Van'>Van</MenuItem>
                            <MenuItem value='SUV'>SUV</MenuItem>
                            <MenuItem value='Other'>Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
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
                            <MenuItem value='pending'>Pending</MenuItem>
                            <MenuItem value='active'>Active</MenuItem>
                            <MenuItem value='maintenance'>Maintenance</MenuItem>
                            <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </CardContent>
    )
}

export default TableFilters
