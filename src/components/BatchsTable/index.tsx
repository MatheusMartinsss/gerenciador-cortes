"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import api from "@/lib/api"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { useModal } from "@/hooks/useModal"
import { dateMask, maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { useSection } from "@/hooks/useSection"
import { Input } from '@/components/ui/input';
import { TreePine, Search } from 'lucide-react';
import { Label } from "../ui/label"
import { CSVLink } from 'react-csv'
import { batch } from "@prisma/client"
import { IBatch } from "@/domain/batch"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllBatch, FindAllBatchResponse } from "@/services/batchService"
import { useQueryState } from "@/hooks/useSearchParams"
import { SortOrder } from "@/domain"


export const BatchsTable = () => {
    const [page] = useQueryState<number>('page', 1)
    const validFields = ['number', 'createAt', 'volumeM3'];
    const [orderBy] = useQueryState('orderBy', 'number', { type: 'enum', enum: validFields })
    const [order] = useQueryState<SortOrder>('order', 'ASC')
    const { data: response, isLoading, isError } = useQuery<FindAllBatchResponse>({
        queryKey: ['batchs', page, orderBy, order],
        queryFn: async () => await findAllBatch({ page: Number(page), orderBy, order }),
        placeholderData: keepPreviousData

    })

    if (isLoading) return null
    if (isError) return null
    if (!response) return null

    return (
        <div className="flex flex-col w-full space-y-2">
            <div className='flex w-full flex-row space-x-2  '>
                <div className='flex'>

                </div>
            </div>
            <div className="h-[80vh] relative overflow-auto shadow-md sm:rounded-lg">
                <DataTable data={response.data} columns={columns} />
            </div>

        </div>
    )
}