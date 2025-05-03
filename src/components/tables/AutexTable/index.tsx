"use client"
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllAutex } from "@/services/autexService"
import { useTableQueryParams } from "@/hooks/useTableQueryParams"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const AutexTable = () => {
    const { orderBy, order, search, setSearch, from, setFrom, setTo, to, dateField, setDateField, clearFilters, page } = useTableQueryParams()
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['autex', page, orderBy, order],
        queryFn: async () => await findAllAutex({ page: Number(page), orderBy, order }),
        placeholderData: keepPreviousData

    })
    if (isLoading) return null
    if (isError) return null
    if (!response) return null

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
                        <option value="validade_inicial">Validade Inicial</option>
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