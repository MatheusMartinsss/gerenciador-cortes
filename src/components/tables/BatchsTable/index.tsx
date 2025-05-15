"use client"
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllBatch, FindAllBatchResponse } from "@/services/batchService"
import { useTableQueryParams } from "@/hooks/useTableQueryParams"


export const BatchsTable = () => {
    const {order, orderBy, page} = useTableQueryParams()
    const { data: response, isLoading, isError } = useQuery<FindAllBatchResponse>({
        queryKey: ['batchs', page, orderBy, order],
        queryFn: async () => await findAllBatch({ page: Number(page), orderBy, order }),
        placeholderData: keepPreviousData

    })

    if (isLoading) return null
    if (isError) return null
    if (!response) return null

    return (
        <div className="flex flex-col w-full h-full p-8 space-y-2">
            <DataTable data={response.data} columns={columns} />
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response.totalPages} />
            </div>
        </div>
    )
}