'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import AddVehicleDrawer from './AddVehicleDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const vehicleRoleObj = {
    admin: { icon: 'ri-vip-crown-line', color: 'error' },
    author: { icon: 'ri-computer-line', color: 'warning' },
    editor: { icon: 'ri-edit-box-line', color: 'info' },
    maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
    subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const vehicleStatusObj = {
    active: 'success',
    pending: 'warning',
    inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const VehicleListTable = ({ tableData }) => {
    // States
    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState(...[tableData])
    const [filteredData, setFilteredData] = useState(data)
    const [globalFilter, setGlobalFilter] = useState('')

    // Hooks
    const { lang: locale } = useParams()

    // Table columns for vehicles
    const columns = useMemo(
        () => [
            columnHelper.accessor('id', { header: 'ID', cell: info => info.getValue() }),
            columnHelper.accessor('licensePlate', { header: 'License Plate', cell: info => info.getValue() }),
            columnHelper.accessor('make', { header: 'Make', cell: info => info.getValue() }),
            columnHelper.accessor('model', { header: 'Model', cell: info => info.getValue() }),
            columnHelper.accessor('year', { header: 'Year', cell: info => info.getValue() }),
            columnHelper.accessor('type', { header: 'Type', cell: info => info.getValue() }),
            columnHelper.accessor('status', { header: 'Status', cell: info => info.getValue() }),
            columnHelper.accessor('location', { header: 'Location', cell: info => info.getValue() }),
            columnHelper.accessor('driver', { header: 'Driver', cell: info => info.getValue() }),
            columnHelper.accessor('lastServiceDate', { header: 'Last Service', cell: info => info.getValue() }),
            columnHelper.accessor('warnings', { header: 'Warnings', cell: info => info.getValue() }),
            columnHelper.accessor('progress', { header: 'Progress', cell: info => `${info.getValue()}%` }),
            {
                id: 'action',
                header: 'Action',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <IconButton size='small' onClick={() => {/* handle edit */ }}>
                            <i className='ri-edit-box-line text-textSecondary' />
                        </IconButton>
                        <IconButton size='small' onClick={() => {/* handle delete */ }}>
                            <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                    </div>
                )
            }
        ],
        []
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            rowSelection,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        enableRowSelection: false,
        globalFilterFn: fuzzyFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    })

    return (
        <Card>
            <CardHeader
                title='Vehicle List'
                action={
                    <Button variant='contained' onClick={() => setAddVehicleOpen(true)}>
                        Add New Vehicle
                    </Button>
                }
                className='pbe-4'
            />
            <TableFilters setData={setFilteredData} tableData={data} />
            <Divider />
            <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {table.getFilteredRowModel().rows.length === 0 ? (
                        <tbody>
                            <tr>
                                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                    No data available
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {table
                                .getRowModel()
                                .rows.slice(0, table.getState().pagination.pageSize)
                                .map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    )}
                </table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
                className='border-bs'
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={table.getState().pagination.pageSize}
                page={table.getState().pagination.pageIndex}
                SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' }
                }}
                onPageChange={(_, page) => {
                    table.setPageIndex(page)
                }}
                onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
            />
            <AddVehicleDrawer
                open={addVehicleOpen}
                handleClose={() => setAddVehicleOpen(false)}
                vehicleData={data}
                setData={setData}
            />
        </Card>
    )
}

export default VehicleListTable
