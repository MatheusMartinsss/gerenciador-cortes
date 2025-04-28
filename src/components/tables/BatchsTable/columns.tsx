"use client"

import { dateMask, maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"

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
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }}
                >
                    Numero
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>

            )
        },
        cell: ({ row }) => {
            return <div className="capitalize pr-8 pl-8">{row.getValue('number')}</div>
        }
    }, {
        accessorKey: 'volumeM3',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Volume M3
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = maskToM3(row.getValue('volumeM3'))
            return <div className="capitalize pr-8 pl-8 ">{value}</div>
        }
    }, {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-4 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Emissão
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="capitalize pr-2 pl-2 ">
                {dateMask(row.getValue('createdAt'))}
            </div>
        }
    }, {
        id: 'actions',
        header: ({ column }) => {
            return (
                <div className="pr-4 pl-4 text-white">#</div>
            )
        },
        cell: ({ row }) => {
            const treeId = row.original.id
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
                            <ViewTreeButton treeId={treeId} />
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