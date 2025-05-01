"use client"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { useQueryState } from "@/hooks/useSearchParams"
import { SortOrder } from "@/domain"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [, setOrderBy] = useQueryState('orderBy', 'number')
  const [, setSortOrder] = useQueryState<SortOrder>('order', 'ASC')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  return (
    <div className="rounded-md border bg-white overflow-x-auto min-h-[50vh]">
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-green-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort()
                const isSorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    role="columnheader"
                    aria-sort={
                      isSorted === 'asc' ? 'ascending'
                        : isSorted === 'desc' ? 'descending' : 'none'
                    }
                    onClick={() => {
                      if (isSortable) {
                        setOrderBy(header.column.id)
                        setSortOrder(isSorted === 'asc' ? 'DESC' : 'ASC')
                      }
                    }}
                    className="text-white font-medium cursor-pointer hover:bg-green-800 transition-colors"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {isSorted && (
                      <span className="ml-1 text-xs">
                        {isSorted === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-gray-400">
                Carregando...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-20 text-center text-gray-500 text-sm">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}