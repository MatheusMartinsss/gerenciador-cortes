"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import * as exceljs from 'exceljs'
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { useQueryState } from "@/hooks/useSearchParams"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useDebounce } from "@uidotdev/usehooks"
import { useTableQueryParams } from "@/hooks/useTableQueryParams";
import { useRouter } from 'next/navigation'
import { ITree } from "@/domain/tree";
import { exportTreesToExcel } from "@/components/reports/exporTreesToExcel";
import { exportTreesToCutCsv } from "@/components/reports/exportTreesToCutCsv";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatM3WithSuffix } from "@/lib/masks";
import { findAllAutex } from "@/services/autexService";
export const TreeTable = () => {
    const [searchText, setSearchText] = useState<string>('')
    const [filterAutex, setFilterAutex] = useState<string>('')
    const { orderBy, order, search, setSearch, from, setFrom, setTo, to, dateField, setDateField, clearFilters, page } = useTableQueryParams()
    const textDebounce = useDebounce(search, 200)
    const { data: response, } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, orderBy, order, textDebounce, filterAutex],
        queryFn: async () => await findAllTrees({ page: Number(page), orderBy, order, searchTerm: textDebounce, autex: filterAutex }),
        placeholderData: keepPreviousData,


    })
    const { data: autexList, isLoading: isLoadingAutex, isError } = useQuery({
        queryKey: ['autex',],
        queryFn: async () => await findAllAutex({ page: 1, orderBy: '', order: '', noPagination: true }),
        placeholderData: keepPreviousData

    })
    const [rowSelection, setRowSelection] = useState({});
    const [selectedTrees, setSelectedTrees] = useState<ITree[]>([]);
    const clearSelecteds = () => {
        setRowSelection({})
        setSelectedTrees([])
    }
    const router = useRouter()
    const onSelectionDataChange = (newSelected: ITree[]) => {
        setSelectedTrees((prevSelected) => {
            const all = [...prevSelected];

            newSelected.forEach(newItem => {
                if (!all.some(tree => tree.id === newItem.id)) {
                    all.push(newItem);
                }
            });
            const currentPageIds = response?.data.map(tree => tree.id) || [];
            const selectedIds = newSelected.map(tree => tree.id);

            return all.filter(tree =>
                selectedIds.includes(tree.id) || !currentPageIds.includes(tree.id)
            );
        });
    };

    const onRowSelectionChange = (updater: any) => {
        setRowSelection(prev =>
            typeof updater === "function" ? updater(prev) : updater
        );
    };
    const generateReport = () => {
        exportTreesToExcel(selectedTrees)
    }
    const generateTreeCut = () => {
        exportTreesToCutCsv(selectedTrees)
    }
    const onSelectAutex = (e: string) => {
        setFilterAutex(e)
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
                <div className="col-span-auto">
                    <label htmlFor="to" className="text-sm font-medium text-muted-foreground">
                        Filtrar por autex
                    </label>
                    <div className="flex">
                        <Select onValueChange={onSelectAutex} value={filterAutex}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                                {!isLoadingAutex && autexList.data.map((autex: any) => (
                                    <SelectItem key={autex.id} value={autex.id}>
                                        {autex.detentor_autorizacao} - {autex.numero_autorizacao} -{" "}
                                        {formatM3WithSuffix(autex.volumeM3_total)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {filterAutex && (
                            <Button variant="ghost" size="icon" onClick={() => setFilterAutex("")}>
                                ✕
                            </Button>
                        )}
                    </div>
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
                onRowSelectionChange={onRowSelectionChange}
                onSelectionDataChange={onSelectionDataChange}
            />
            {selectedTrees.length > 0 && (
                <div className="fixed bottom-0 right-0 bg-white border border-gray-200 shadow-md rounded-xl px-6 py-3 z-50 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <span className="font-medium text-sm text-gray-700">
                        {selectedTrees.length} árvore(s) selecionada(s)
                    </span>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => clearSelecteds()}>
                            Limpar
                        </Button>
                        <Button size='sm' onClick={() => generateTreeCut()}> Gerar Corte</Button>
                        <Button size="sm" onClick={() => generateReport()}>
                            Gerar Relatorio
                        </Button>
                    </div>
                </div>
            )}
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response?.totalPages || 0} />
            </div>
        </div>
    )
}

