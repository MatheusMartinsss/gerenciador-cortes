"use client"
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllBatch, FindAllBatchResponse } from "@/services/batchService"
import { useQueryState } from "@/hooks/useSearchParams"
import { SortOrder } from "@/domain"


export const BatchsTable = () => {
    const [page] = useQueryState<number>('page', 1)
    const validFields = ['number', 'createAt', 'volumeM3'];
    const [orderBy] = useQueryState('orderBy', 'createdAt', { type: 'enum', enum: validFields })
    const [order] = useQueryState<SortOrder>('order', 'DESC')
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
            <div className="h-[68vh] relative overflow-auto shadow-md sm:rounded-lg">
                <DataTable data={response.data} columns={columns} />
            </div>
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response.totalPages} />
            </div>
        </div>
    )
}