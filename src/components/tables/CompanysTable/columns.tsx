"use client"

import { dateMask, maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"

export type Company = {
    id: string
    razaoSocial: string
    cnpj: string;
    isActive: boolean;
    createdAt: Date
}

export const columns: ColumnDef<Company>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>

            )
        },
        cell: ({ row }) => {
            return <div className="capitalize pr-8 pl-8">{row.getValue('number')}</div>
        }
    }, {
        accessorKey: 'razaoSocial',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Razao Social
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }, {
        accessorKey: 'cnpj',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-2 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    CNPJ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }, {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="p-4 text-white"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Criado
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

