"use client"
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllBatch, FindAllBatchResponse } from "@/services/batchService"
import { useTableQueryParams } from "@/hooks/useTableQueryParams"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatM3WithSuffix } from "@/lib/masks"
import { findAllAutex } from "@/services/autexService"
import { useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"


export const BatchsTable = () => {
    const { orderBy, order, search, setSearch, from, setFrom, setTo, to, dateField, setDateField, clearFilters, page } = useTableQueryParams()
    const [filterAutex, setFilterAutex] = useState<string>('')
    const textDebounce = useDebounce(search, 200)

    const { data: response, isLoading, isError } = useQuery<FindAllBatchResponse>({
        queryKey: ['batchs', page, orderBy, order],
        queryFn: async () => await findAllBatch({ page: Number(page), orderBy, order }),
        placeholderData: keepPreviousData

    })
    const { data: autexList, isLoading: isLoadingAutex } = useQuery({
        queryKey: ['autex',],
        queryFn: async () => await findAllAutex({ page: 1, orderBy: '', order: '', noPagination: true }),
        placeholderData: keepPreviousData

    })
    const onSelectAutex = (e: string) => {
        setFilterAutex(e)
    }
    if (isLoading) return null
    if (isError) return null
    if (!response) return null

    return (
        <div className="flex flex-col w-full h-full  space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-muted p-4 rounded-md border">
                <div className="col-span-4">
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
            <DataTable data={response.data} columns={columns} />
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response.totalPages} />
            </div>
        </div>
    )
}