'use client'

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import {
  flexRender,
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

const schema = yup.object().shape({
  vehicleName: yup.string().required(),
  type: yup.string().required(),
  model: yup.string().required(),
  year: yup.number().typeError('Year must be a number').required(),
  registrationNumber: yup.string().required(),
  numberPlate: yup.string().required(),
  destination: yup.array().min(1, 'Select at least one destination').required(),
  numberOfTyres: yup.number().typeError('Must be a number').required(),
  weight: yup.number().typeError('Must be a number').required()
})

const columnHelper = createColumnHelper()

const FormValidationSchema = () => {
  const [data, setData] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo(
    () => [
      columnHelper.accessor('vehicleName', { header: 'Vehicle Name' }),
      columnHelper.accessor('type', { header: 'Type' }),
      columnHelper.accessor('model', { header: 'Model' }),
      columnHelper.accessor('year', { header: 'Year' }),
      columnHelper.accessor('registrationNumber', { header: 'Registration No.' }),
      columnHelper.accessor('numberPlate', { header: 'Number Plate' }),
      columnHelper.accessor('destination', {
        header: 'Destination',
        cell: ({ row }) => row.original.destination.join(', ')
      }),
      columnHelper.accessor('numberOfTyres', { header: 'Tyres' }),
      columnHelper.accessor('weight', { header: 'Weight' })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vehicleName: '',
      type: '',
      model: '',
      year: '',
      registrationNumber: '',
      numberPlate: '',
      destination: [],
      numberOfTyres: '',
      weight: ''
    }
  })

  const onSubmit = dataForm => {
    setData(prev => [...prev, { ...dataForm, id: Math.random() }])
    setDrawerOpen(false)
    reset()
  }

  return (
    <>
      <Card>
        <CardHeader title='Vehicle List - Schema Validation' />
        <Divider />
        <div className='flex justify-end p-4'>
          <Button variant='contained' onClick={() => setDrawerOpen(true)}>
            Add New Vehicle
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='vehicleName'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Vehicle Name'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='type'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Type'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='model'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Model'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='year'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Year'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='registrationNumber'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Registration No.'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='numberPlate'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Number Plate'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <FormControl fullWidth style={{ marginTop: 16 }}>
              <InputLabel>Destination</InputLabel>
              <Controller
                name='destination'
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
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
                )}
              />
            </FormControl>
            <Controller
              name='numberOfTyres'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Tyres'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='weight'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label='Weight'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' color='error' onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  )
}

export default FormValidationSchema
