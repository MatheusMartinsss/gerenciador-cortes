"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
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
import React, { useEffect } from "react"
import { useTableQueryParams } from "@/hooks/useTableQueryParams"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onSelectionChange?: (selected: any[]) => void;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onSelectionDataChange: (selected: any) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  rowSelection,
  onRowSelectionChange,
  onSelectionDataChange,
}: DataTableProps<TData, TValue>) {
  const { sorting, setSorting } = useTableQueryParams()
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      rowSelection
    },
    onRowSelectionChange,
    getRowId: (row) => (row as any).id.toString(),
  })

  useEffect(() => {
    onSelectionDataChange(table.getSelectedRowModel().rows.map(r => r.original));
  }, [rowSelection]);

  return (
    <div className="rounded-md border bg-white overflow-x-auto min-h-[50vh]">
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-green-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    role="columnheader"
                    aria-sort={
                      isSorted === 'asc' ? 'ascending'
                        : isSorted === 'desc' ? 'descending' : 'none'
                    }
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-white font-medium cursor-pointer hover:bg-green-800 transition-colors"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
              <TableCell colSpan={columns.length} >
                <div className="py-36 text-center  text-sm">
                  Nenhum resultado encontrado.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}