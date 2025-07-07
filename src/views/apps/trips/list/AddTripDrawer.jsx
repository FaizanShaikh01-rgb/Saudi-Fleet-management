import { useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'

// Import vehicle list for dropdown
import { db as logisticsDb } from '@/fake-db/apps/logistics'

const vehicleOptions = logisticsDb.vehicles.map(v => ({
    value: v.licensePlate,
    label: `${v.make} ${v.model} (${v.licensePlate})`
}))

const locationOptions = [
    'Paris, France',
    'Lyon, France',
    'Berlin, Germany',
    'Hamburg, Germany',
    'Madrid, Spain',
    'Valencia, Spain',
    'Rome, Italy',
    'Naples, Italy',
    'Amsterdam, Netherlands',
    'Brussels, Belgium',
    'Vienna, Austria',
    'Zurich, Switzerland'
]

const initialData = {
    vehicle: '',
    driver: '',
    startLocation: '',
    endLocation: '',
    startTime: '',
    endTime: '',
    distanceKm: '',
    notes: '',
    stops: ['']
}

const AddTripDrawer = props => {
    const { open, handleClose, tripData, setData } = props
    const [formData, setFormData] = useState(initialData)

    const {
        control,
        reset: resetForm,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            status: ''
        }
    })

    const handleStopChange = (idx, value) => {
        const newStops = [...formData.stops]

        newStops[idx] = value
        setFormData({ ...formData, stops: newStops })
    }

    const addStop = () => {
        setFormData({ ...formData, stops: [...formData.stops, ''] })
    }

    const removeStop = idx => {
        const newStops = formData.stops.filter((_, i) => i !== idx)

        setFormData({ ...formData, stops: newStops })
    }

    const onSubmit = data => {
        const newTrip = {
            id: (tripData?.length && tripData?.length + 1) || 1,
            vehicle: formData.vehicle,
            driver: formData.driver,
            startLocation: formData.startLocation,
            endLocation: formData.endLocation,
            stops: formData.stops.filter(Boolean),
            startTime: formData.startTime,
            endTime: formData.endTime,
            status: data.status,
            distanceKm: formData.distanceKm,
            notes: formData.notes
        }

        setData([...(tripData ?? []), newTrip])
        handleClose()
        setFormData(initialData)
        resetForm({ status: '' })
    }

    const handleReset = () => {
        handleClose()
        setFormData(initialData)
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Add New Trip</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
                    <FormControl fullWidth>
                        <InputLabel id='vehicle'>Select Vehicle</InputLabel>
                        <Select
                            labelId='vehicle'
                            value={formData.vehicle}
                            label='Select Vehicle'
                            onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                        >
                            {vehicleOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label='Driver'
                        fullWidth
                        placeholder='Driver Name'
                        value={formData.driver}
                        onChange={e => setFormData({ ...formData, driver: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel id='start-location'>Start Location</InputLabel>
                        <Select
                            labelId='start-location'
                            value={formData.startLocation}
                            label='Start Location'
                            onChange={e => setFormData({ ...formData, startLocation: e.target.value })}
                        >
                            {locationOptions.map(loc => (
                                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id='end-location'>End Location</InputLabel>
                        <Select
                            labelId='end-location'
                            value={formData.endLocation}
                            label='End Location'
                            onChange={e => setFormData({ ...formData, endLocation: e.target.value })}
                        >
                            {locationOptions.map(loc => (
                                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant='subtitle2'>Stops (Multi-stop route)</Typography>
                    {formData.stops.map((stop, idx) => (
                        <div key={idx} className='flex gap-2 items-center'>
                            <FormControl fullWidth>
                                <InputLabel id={`stop-${idx}`}>Stop {idx + 1}</InputLabel>
                                <Select
                                    labelId={`stop-${idx}`}
                                    value={stop}
                                    label={`Stop ${idx + 1}`}
                                    onChange={e => handleStopChange(idx, e.target.value)}
                                >
                                    <MenuItem value=''>None</MenuItem>
                                    {locationOptions.map(loc => (
                                        <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton size='small' color='error' onClick={() => removeStop(idx)} disabled={formData.stops.length === 1}>
                                <i className='ri-delete-bin-7-line' />
                            </IconButton>
                        </div>
                    ))}
                    <Button variant='outlined' onClick={addStop} type='button'>Add Stop</Button>
                    <TextField
                        label='Start Time'
                        fullWidth
                        placeholder='YYYY-MM-DDTHH:mm:ss'
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    />
                    <TextField
                        label='End Time'
                        fullWidth
                        placeholder='YYYY-MM-DDTHH:mm:ss'
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel id='status'>Select Status</InputLabel>
                        <Controller
                            name='status'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select label='Select Status' {...field} error={Boolean(errors.status)}>
                                    <MenuItem value='active'>Active</MenuItem>
                                    <MenuItem value='completed'>Completed</MenuItem>
                                    <MenuItem value='cancelled'>Cancelled</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.status && <FormHelperText error>This field is required.</FormHelperText>}
                    </FormControl>
                    <TextField
                        label='Distance (km)'
                        fullWidth
                        placeholder='Distance in kilometers'
                        value={formData.distanceKm}
                        onChange={e => setFormData({ ...formData, distanceKm: e.target.value })}
                    />
                    <TextField
                        label='Notes'
                        fullWidth
                        placeholder='Notes about the trip'
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit'>
                            Submit
                        </Button>
                        <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default AddTripDrawer; 
