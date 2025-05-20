"use client"

import { dateMask, formatVolumeM3, maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"
import { useRouter } from "next/navigation"
export type Batch = {
    id: string
    number: number
    volumeM3: number
    createdAt: Date
}



export const columns: ColumnDef<Batch>[] = [
    {
        accessorKey: 'number',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Numero
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="capitalize">{row.getValue('number')}</div>
        }
    }, {
        accessorKey: 'status',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Status
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => {
            const value = row.getValue('status')
            if (value == 'finalized') {
                return <div className="capitalize rounded border w-fit px-2 py-0.5 text-sm border-green-600 text-green-700 bg-green-50">Finalizado</div>
            }
            return <div className="capitalize rounded border w-fit px-2 py-0.5 text-sm border-red-600 text-red-700 bg-red-50">Rascunho</div>
        }
    },
    {
        accessorKey: 'volumeM3',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Vol. M3
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => {
            const value = formatVolumeM3(row.getValue('volumeM3'))
            return <div className="capitalize">{value}</div>
        }
    }, {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Dt. Emissão
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="capitalize">{dateMask(row.getValue('createdAt'))}</div>
        }
    }, {
        id: 'actions',
        header: ({ column }) => {
            return (
                <div className="capitalize">#</div>
            )
        },
        cell: ({ row }) => {
            const batchId = row.original.id
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="flex flex-col">
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <ViewButton batchId={batchId} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button size='sm' variant="ghost">
                                <Trash className="w-3 h-3 mr-2" />
                                Excluir
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

const ViewButton = ({ batchId }: { batchId: string }) => {
    const router = useRouter()
    return (
        <Button
            variant='ghost'
            onClick={() => router.push(`/cortes/editar/${batchId}`)}>
            <Eye className="h-3 w-3 mr-2" />
            Detalhes
        </Button>
    )
}