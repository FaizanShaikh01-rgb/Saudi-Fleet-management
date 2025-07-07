"use client"

// MUI Imports
import { useState, useMemo } from 'react'


import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'

import { createColumnHelper, useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';

import AddTripDrawer from './AddTripDrawer';

import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const TripListTable = ({ tableData }) => {
    const [filteredData, setFilteredData] = useState(tableData)
    const [addTripOpen, setAddTripOpen] = useState(false);

    const columns = useMemo(() => [
        columnHelper.accessor('vehicle', { header: 'Vehicle', cell: info => info.getValue() }),
        columnHelper.accessor('driver', { header: 'Driver', cell: info => info.getValue() }),
        columnHelper.accessor('startLocation', { header: 'Start', cell: info => info.getValue() }),
        columnHelper.accessor('stops', { header: 'Stops', cell: info => (info.getValue() && info.getValue().length > 0 ? info.getValue().join(', ') : '-') }),
        columnHelper.accessor('endLocation', { header: 'End', cell: info => info.getValue() }),
        columnHelper.accessor('startTime', { header: 'Start Time', cell: info => info.getValue() }),
        columnHelper.accessor('endTime', { header: 'End Time', cell: info => info.getValue() }),
        columnHelper.accessor('status', { header: 'Status', cell: info => info.getValue() }),
        columnHelper.accessor('distanceKm', { header: 'Distance (km)', cell: info => info.getValue() }),
        columnHelper.accessor('notes', { header: 'Notes', cell: info => info.getValue() }),
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
    ], [])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })


    return (
        <Card>
            <CardHeader
                title='Trips'
                action={
                    <Button variant='contained' onClick={() => setAddTripOpen(true)}>
                        Add New Trip
                    </Button>
                }
            />
            <Divider />
            <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>{header.isPlaceholder ? null : header.column.columnDef.header}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
                count={table.getRowModel().rows.length}
                rowsPerPage={10}
                page={0}
            />
            <AddTripDrawer
                open={addTripOpen}
                handleClose={() => setAddTripOpen(false)}
                tripData={filteredData}
                setData={setFilteredData}
            />
        </Card>
    )
}

export default TripListTable 
