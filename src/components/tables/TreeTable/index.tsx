"use client"

import { useEffect, useState } from "react"
import { useTree } from "@/hooks/useTree"
import { Button } from "@/components/ui/button"
import { TreePine, Search } from 'lucide-react';
import { useModal } from "@/hooks/useModal"
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import * as exceljs from 'exceljs'
import { CutTreeButton } from "./CutTreeButton"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { useQueryState } from "@/hooks/useSearchParams"
import { TreeModal } from "@/components/modal/TreeModal"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useDebounce } from "@uidotdev/usehooks"
import { useTableQueryParams } from "@/hooks/useTableQueryParams";
import { useRouter } from 'next/navigation'
import { ITree } from "@/domain/tree";
export const TreeTable = () => {
    const [searchText, setSearchText] = useState<string>('')
    const { orderBy, order, search, setSearch, from, setFrom, setTo, to, dateField, setDateField, clearFilters, page } = useTableQueryParams()
    const textDebounce = useDebounce(search, 200)
    const { data: response, isLoading, isError } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, orderBy, order, textDebounce],
        queryFn: async () => await findAllTrees({ page: Number(page), orderBy, order, searchTerm: textDebounce }),
        placeholderData: keepPreviousData

    })
    const [rowSelection, setRowSelection] = useState({});
    const [selectedTrees, setSelectedTrees] = useState<ITree[]>([]);
    console.log(rowSelection, selectedTrees)
    const router = useRouter()
    const onSelectionChange = (data: any) => {
        console.log(data)
    }
    return (
        <div className="flex flex-col w-full h-full space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-muted p-4 rounded-md border">
                <div className="flex flex-col gap-1 col-span-4">
                    <label htmlFor="search" className="text-sm font-medium text-muted-foreground">
                        Buscar
                    </label>
                    <Input
                        id="search"
                        placeholder="Nome ou autorização"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="dateField" className="text-sm font-medium text-muted-foreground">
                        Campo de data
                    </label>
                    <select
                        id="dateField"
                        className="border rounded px-2 py-2 text-sm"
                        value={dateField}
                        onChange={(e) => setDateField(e.target.value)}
                    >
                        <option value="createdAt">Criado em</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="from" className="text-sm font-medium text-muted-foreground">
                        Data de (início)
                    </label>
                    <Input
                        type="date"
                        id="from"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="to" className="text-sm font-medium text-muted-foreground">
                        Data até (fim)
                    </label>
                    <Input
                        type="date"
                        id="to"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Button variant='default' size='sm' onClick={clearFilters}>Limpar Filtros</Button>
                </div>


            </div>
            <DataTable
                columns={columns}
                data={response?.data || []}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onSelectionDataChange={setSelectedTrees}
            />

            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response?.totalPages || 0} />
            </div>
            <TreeModal />
        </div>
    )
}

export const ViewTreeButton = ({ treeId }: { treeId: string }) => {
    const [, setSelectedTreeId] = useQueryState('treeId', '')
    const selectTree = (id: string) => {
        setSelectedTreeId(id)
    }
    return (
        <Button
            variant='ghost'
            onClick={() => selectTree(treeId)}>
            <Eye className="h-3 w-3 mr-2" />
            Detalhes
        </Button>
    )
}