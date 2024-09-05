"use client"

import { maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"

export type Tree = {
    id: string
    number: number
    commonName: string
    scientificName: string
    dap: number
    meters: number
    volumeM3: number
    sVolumeM3: number
}

export const columns: ColumnDef<Tree>[] = [
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
        accessorKey: "commonName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    N. Popular
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="capitalize pr-2 pl-2 text-left">{row.getValue('commonName')}</div>
        }

    }, {
        accessorKey: "scientificName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    N. Cientifico
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="capitalize pr-2 pl-2 text-left w-full">{row.getValue('scientificName')}</div>
        }
    }, {
        accessorKey: "dap",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    DAP
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = maskToMeters(row.getValue('dap'))
            return <div className="capitalize pr-4 pl-4">{value}</div>
        }
    }, {
        accessorKey: 'meters',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Altura
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = maskToMeters(row.getValue('meters'))
            return <div className="capitalize pr-4 pl-4 ">{value}</div>
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
                    Exploravel
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = maskToM3(row.getValue('volumeM3'))
            return <div className="capitalize pr-8 pl-8 ">{value}</div>
        }
    }, {
        accessorKey: 'sVolumeM3',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Explorado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = maskToM3(row.getValue('sVolumeM3'))
            return <div className="capitalize pr-8 pl-8">{value}</div>
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