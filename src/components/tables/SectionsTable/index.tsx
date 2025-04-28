"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { useSection } from "@/hooks/useSection"
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CSVLink } from 'react-csv'
import { SectionsReports } from "./SectionsReport"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllSections, FindAllSectionsResponse } from "@/services/sectionService"
import { useQueryState } from "@/hooks/useSearchParams"
import { SortOrder } from "@/domain"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import { useDebounce } from "@uidotdev/usehooks"

export const SectionsTable = () => {
    const {
        selectedSections,
        handleSearchParam,
    } = useSection()
    const csvLink = useRef<any>()
    const [page] = useQueryState<number>('page', 1)
    const validFields = ['number', 'createAt', 'volumeM3'];
    const [orderBy] = useQueryState('orderBy', 'number', { type: 'enum', enum: validFields })
    const [searchText, setSearchText] = useState<string>('')
    const textDebounce = useDebounce(searchText, 200)
    const [order] = useQueryState<SortOrder>('order', 'ASC')
    const { data: response, isLoading, isError } = useQuery<FindAllSectionsResponse>({
        queryKey: ['batchs', page, orderBy, order, textDebounce],
        queryFn: async () => await findAllSections({ page: Number(page), orderBy, order, searchTerm: textDebounce }),
        placeholderData: keepPreviousData

    })
    if (isLoading) return null
    if (isError) return null
    if (!response) return null

    const generateBatch = () => {
        if (csvLink.current) {
            csvLink.current.link.click()
        }
    }
    const headers = [
        { label: "N° da avore", key: "tree.number" },
        { label: "Secção", key: "section" },
        { label: "Diametro 1", key: "d1" },
        { label: "Diametro 2", key: "d4" },
        { label: "Comprimento", key: "meters" },
    ];
    const getFormatedData = () => {
        return selectedSections.map((section) => {
            return {
                ...section,
                d1: (section.d1 / 100).toFixed(2).replace('.', ','),
                d4: (section.d4 / 100).toFixed(2).replace('.', ','),
                meters: (section.meters / 100).toFixed(2).replace('.', ','),
            }
        })
    }
    return (
        <div className="flex flex-col w-full space-y-2 p-8">
            <div className='flex w-full flex-row space-x-2  '>
                <div className='flex'>
                    <div className='flex w-max-sm items-center space-x-1'>
                        <CSVLink ref={csvLink} filename="tracar.csv" headers={headers} data={getFormatedData()} separator=";" className="hidden"></CSVLink>
                        <SectionsReports />
                        <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="search" placeholder="Pesquisar..." ></Input>
                    </div>
                </div>
            </div>
            <div className="h-[65vh] relative overflow-auto shadow-md sm:rounded-lg">
                <DataTable data={response.data} columns={columns} />
            </div>
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response?.totalPages} />
            </div>
        </div>
    )
}