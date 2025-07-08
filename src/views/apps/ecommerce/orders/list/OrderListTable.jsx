/* -------------------------------------------------------------------------- */
/*  OrderListTable – Fleet Management version                                 */
/* -------------------------------------------------------------------------- */
// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'

// Third‑party Imports
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
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

// Map each shipment status to an MUI Chip color
export const shipmentStatusColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' },
  Idle: { color: 'secondary' },
  'Loading Dock': { color: 'default' },
  'On Route': { color: 'primary' },
  Maintenance: { color: 'error' }
}

// Chip colors for perishable flag
export const orderTypeColor = {
  perashible: { color: 'error' },
  'non perashible': { color: 'success' }
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => setValue(initialValue), [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TextField
      size='small'
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

const columnHelper = createColumnHelper()

const OrderListTable = ({ orderData }) => {
  /* -- state ------------------------------------------------------------- */
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(orderData)
  const [globalFilter, setGlobalFilter] = useState('')
  const { lang: locale } = useParams()

  const columns = useMemo(
  () => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      )
    },

    columnHelper.accessor('order', {
      header: 'Order',
      cell: ({ row }) => (
        <Typography
          component={Link}
          href={getLocalizedUrl(`/apps/fleet/orders/details/${row.original.order}`, locale)}
          color='primary.main'
        >
          #{row.original.order}
        </Typography>
      )
    }),

    columnHelper.accessor('po', {
      header: 'PO',
      cell: ({ row }) => <Typography>#{row.original.po}</Typography>
    }),

    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: ({ row }) => {
        const customer = row.original.customer || 'Unknown'
        const avatar = row.original.avatar

        return (
          <div className='flex items-center gap-3'>
            {avatar ? (
              <CustomAvatar src={avatar} skin='light' size={34} />
            ) : (
              <CustomAvatar skin='light' size={34}>
                {getInitials(customer)}
              </CustomAvatar>
            )}
            <div className='flex flex-col'>
              <Typography
                component={Link}
                href={getLocalizedUrl('/apps/ecommerce/customers/details/placeholder', locale)}
                color='text.primary'
                className='font-medium hover:text-primary'
              >
                {customer}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      }
    }),

    columnHelper.accessor('shipment status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original['shipment status']}
          color={shipmentStatusColor[row.original['shipment status']]?.color || 'default'}
          variant='tonal'
          size='small'
        />
      )
    }),

    columnHelper.accessor('order type', {
      header: 'Order Type',
      cell: ({ row }) => (
        <Chip
          label={row.original['order type']}
          color={orderTypeColor[row.original['order type']]?.color || 'default'}
          variant='tonal'
          size='small'
        />
      )
    }),

    columnHelper.accessor('date', {
      header: 'Date / Time',
      cell: ({ row }) => (
        <Typography>
          {new Date(row.original.date).toDateString()}, {row.original['time stamp'] || 'N/A'}
        </Typography>
      )
    }),

    columnHelper.accessor('action', {
      header: 'Action',
      enableSorting: false,
      cell: ({ row }) => (
        <OptionMenu
          iconButtonProps={{ size: 'medium' }}
          iconClassName='text-[22px]'
          options={[
            {
              text: 'View',
              icon: 'ri-eye-line',
              href: getLocalizedUrl(`/apps/fleet/orders/details/${row.original.order}`, locale),
              linkProps: { className: 'flex items-center gap-2 is-full plb-2 pli-4' }
            },
            {
              text: 'Delete',
              icon: 'ri-delete-bin-7-line',
              menuItemProps: {
                onClick: () => setData(data.filter(o => o.id !== row.original.id)),
                className: 'flex items-center gap-2 pli-4'
              }
            }
          ]}
        />
      )
    })
  ],
  [data, locale]
)

  /* -- table instance --------------------------------------------------- */
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    filterFns: { fuzzy: fuzzyFilter },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  /* ---------------------------------------------------------------------- */
  /*  Render                                                               */
  /* ---------------------------------------------------------------------- */

  return (
    <Card>
      {/* Top bar */}
      <CardContent className='flex justify-between flex-col sm:flex-row sm:items-center gap-4'>
  <DebouncedInput
  value={globalFilter ?? ''}
  onChange={val => setGlobalFilter(String(val))}
  placeholder='Search Order / Customer'
  className='sm:w-auto w-full'
/>
  <Button
    variant='outlined'
    color='secondary'
    startIcon={<i className='ri-upload-2-line' />}
  >
    Export
  </Button>
</CardContent>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='ri-arrow-up-s-line text-xl' />,
                          desc: <i className='ri-arrow-down-s-line text-xl' />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
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
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component='div'
        className='border-bs'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        SelectProps={{ inputProps: { 'aria-label': 'rows per page' } }}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default OrderListTable
