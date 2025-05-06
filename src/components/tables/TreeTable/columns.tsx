"use client"

import { formatM3WithSuffix, maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"

export type Tree = {
    id: string
    number: number
    commonName: string
    scientificName: string
    dap: number
    autex?: any;
    meters: number
    volumeM3: number
    sVolumeM3: number
}

export const columns: ColumnDef<Tree>[] = [
    {
        accessorKey: "number",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    Número
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
    },
    {
        accessorKey: "commonName",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    N. Popular
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("commonName")}</div>,
    },
    {
        accessorKey: "scientificName",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    N. Científico
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("scientificName")}</div>,
    },
    {
        accessorKey: "dap",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    DAP
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div>{maskToMeters(row.getValue("dap"))}</div>,
    },
    {
        accessorKey: "meters",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    Altura
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div>{maskToMeters(row.getValue("meters"))}</div>,
    },
    {
        accessorKey: "volumeM3",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    Explorável
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div>{formatM3WithSuffix(row.getValue("volumeM3"))}</div>,
    },
    {
        accessorKey: "sVolumeM3",
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : "none"}
                >
                    Explorado
                    {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
                </div>
            )
        },
        cell: ({ row }) => <div>{formatM3WithSuffix(row.getValue("sVolumeM3"))}</div>,
    }, {
        accessorFn: (row) => row.autex?.numero_autorizacao,
        id: "autex_numero", // necessário porque não tem accessorKey
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
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
                    Autex
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            )
        },
        cell: ({ row }) => <div>{row.getValue("autex_numero")}</div>,
    },
    {
        id: "actions",
        header: () => <div className="text-white">#</div>,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="flex flex-col">
                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <ViewTreeButton treeId={row.original.id} />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button size="sm" variant="ghost">
                            <Trash className="w-3 h-3 mr-2" />
                            Excluir
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
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