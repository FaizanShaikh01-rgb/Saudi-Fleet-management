// React Imports
import { useState } from 'react'

// MUI Imports
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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Vars
const initialData = {
    licensePlate: '',
    make: '',
    year: '',
    driver: '',
    lastServiceDate: ''
}

const AddVehicleDrawer = props => {
    // Props
    const { open, handleClose, vehicleData, setData } = props

    // States
    const [formData, setFormData] = useState(initialData)

    // Hooks
    const {
        control,
        reset: resetForm,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            model: '',
            type: '',
            status: ''
        }
    })

    const onSubmit = data => {
        const newVehicle = {
            id: (vehicleData?.length && vehicleData?.length + 1) || 1,
            licensePlate: formData.licensePlate,
            make: formData.make,
            model: data.model,
            year: formData.year,
            type: data.type,
            status: data.status,
            location: '', // You may want to add a location field or let user select
            driver: formData.driver,
            lastServiceDate: formData.lastServiceDate,
            warnings: '',
            progress: 0
        }

        setData([...(vehicleData ?? []), newVehicle])
        handleClose()
        setFormData(initialData)
        resetForm({ model: '', type: '', status: '' })
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
                <Typography variant='h5'>Add New Vehicle</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
                    <TextField
                        label='License Plate'
                        fullWidth
                        placeholder='ABC-1234'
                        value={formData.licensePlate}
                        onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                    />
                    <TextField
                        label='Make'
                        fullWidth
                        placeholder='Toyota, Ford, etc.'
                        value={formData.make}
                        onChange={e => setFormData({ ...formData, make: e.target.value })}
                    />
                    <Controller
                        name='model'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Model'
                                placeholder='Corolla, Sprinter, etc.'
                                {...(errors.model && { error: true, helperText: 'This field is required.' })}
                            />
                        )}
                    />
                    <TextField
                        label='Year'
                        fullWidth
                        placeholder='2022'
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                    <Controller
                        name='type'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel id='type'>Select Type</InputLabel>
                                <Select label='Select Type' {...field} error={Boolean(errors.type)}>
                                    <MenuItem value='Car'>Car</MenuItem>
                                    <MenuItem value='Van'>Van</MenuItem>
                                    <MenuItem value='Truck'>Truck</MenuItem>
                                    <MenuItem value='SUV'>SUV</MenuItem>
                                    <MenuItem value='Other'>Other</MenuItem>
                                </Select>
                                {errors.type && <FormHelperText error>This field is required.</FormHelperText>}
                            </FormControl>
                        )}
                    />
                    <FormControl fullWidth>
                        <InputLabel id='status' error={Boolean(errors.status)}>
                            Select Status
                        </InputLabel>
                        <Controller
                            name='status'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select label='Select Status' {...field} error={Boolean(errors.status)}>
                                    <MenuItem value='pending'>Pending</MenuItem>
                                    <MenuItem value='active'>Active</MenuItem>
                                    <MenuItem value='maintenance'>Maintenance</MenuItem>
                                    <MenuItem value='inactive'>Inactive</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.status && <FormHelperText error>This field is required.</FormHelperText>}
                    </FormControl>
                    <TextField
                        label='Driver'
                        fullWidth
                        placeholder='Driver Name'
                        value={formData.driver}
                        onChange={e => setFormData({ ...formData, driver: e.target.value })}
                    />
                    <TextField
                        label='Last Service Date'
                        fullWidth
                        placeholder='YYYY-MM-DD'
                        value={formData.lastServiceDate}
                        onChange={e => setFormData({ ...formData, lastServiceDate: e.target.value })}
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

export default AddVehicleDrawer
