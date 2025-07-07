'use client'

import { useState, useMemo, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import TablePagination from '@mui/material/TablePagination'
import {
  flexRender,
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const FormValidationTrip = () => {
  const [data, setData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formData, setFormData] = useState({
    tripName: '',
    startLocation: '',
    destination: [],
    date: '',
    vehicle: ''
  })

  const savedVehicle = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('savedVehicle')) : null

  useEffect(() => {
    // Auto-select vehicle when destination changes
    const matches = formData.destination.some(dest => savedVehicle?.destination?.includes(dest))
    if (matches) {
      setFormData(prev => ({ ...prev, vehicle: savedVehicle.vehicleName }))
    } else {
      setFormData(prev => ({ ...prev, vehicle: '' }))
    }
  }, [formData.destination])

  const columns = useMemo(
    () => [
      columnHelper.accessor('tripName', { header: 'Trip Name' }),
      columnHelper.accessor('startLocation', { header: 'Start Location' }),
      columnHelper.accessor('destination', {
        header: 'Destination',
        cell: ({ row }) => row.original.destination.join(', ')
      }),
      columnHelper.accessor('date', { header: 'Date' }),
      columnHelper.accessor('vehicle', { header: 'Vehicle' })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDestinationChange = e => {
    setFormData(prev => ({ ...prev, destination: e.target.value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setData([...data, { ...formData, id: Math.random() }])
    setDrawerOpen(false)
    setFormData({
      tripName: '',
      startLocation: '',
      destination: [],
      date: '',
      vehicle: ''
    })
  }

  return (
    <>
      <Card>
        <CardHeader title='Trip List' />
        <Divider />
        <div className='flex justify-end p-4'>
          <Button variant='contained' onClick={() => setDrawerOpen(true)}>
            Add New Trip
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No data
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component='div'
          count={table.getRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ padding: 20, width: 350 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label='Trip Name'
                  fullWidth
                  name='tripName'
                  value={formData.tripName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Start Location'
                  fullWidth
                  name='startLocation'
                  value={formData.startLocation}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Destination</InputLabel>
                  <Select
                    multiple
                    value={formData.destination}
                    onChange={handleDestinationChange}
                    renderValue={selected => (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {selected.map(value => (
                          <Chip key={value} label={value} />
                        ))}
                      </div>
                    )}
                  >
                    {['Riyadh', 'Dammam', 'Medina', 'Makkah'].map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Date'
                  type='date'
                  fullWidth
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Vehicle'
                  fullWidth
                  name='vehicle'
                  value={formData.vehicle}
                  onChange={handleChange}
                  required
                  // disabled // Comment this line if you want to allow manual change
                />
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', gap: 8 }}>
                <Button variant='contained' type='submit' fullWidth>
                  Submit
                </Button>
                <Button variant='outlined' color='error' onClick={() => setDrawerOpen(false)} fullWidth>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Drawer>
    </>
  )
}

export default FormValidationTrip
