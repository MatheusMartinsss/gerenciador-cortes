"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import api from "@/lib/api"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { useTree } from "@/hooks/useTree"
import { Button } from "../ui/button"
import { useModal } from "@/hooks/useModal"
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { useParams } from "@/hooks/useSearchParams"
import { TablePagination } from "../pagination/pagination"

const tableCol = [{
    label: 'N° Arvore',
    key: 'number',
    sortable: true
}, {
    label: 'N. Popular',
    key: 'commonName',
    sortable: true
}, {
    label: 'N. Cientifico',
    key: 'scientificName',
    sortable: true
}, {
    label: 'DAP',
    key: 'dap',
    sortable: true
}, {
    label: 'Altura',
    key: 'meters',
    sortable: true
}, {
    label: 'M3',
    key: 'volumeM3',
    sortable: true
}, {
    label: 'Opções',
    key: 'options',
    sortable: false
}]

export const TreeTable = () => {
    const { setTree, trees, setTrees, removeTree } = useTree()
    const { setForm, isOpen } = useModal()
    const { handleSort, params, handleOrderBy } = useParams()
    const [loading, setLoading] = useState(true)
    const { searchParam, sortOrder, from, end, orderBy, page } = params
    const [maxPages, setMaxPages] = useState(0)
    useEffect(() => {
        fetchData()
    }, [searchParam, page, sortOrder, from, end, orderBy])
    useEffect(() => {
        if (!isOpen) {
            setTree(null)
        }
    }, [isOpen])
    const fetchData = async () => {
        const { data: { data, pages } } = await api.get('/tree', {
            params: {
                page,
                orderBy,
                sortOrder,
                from,
                end,
                searchParam
            }
        })
        setTrees(data)
        setMaxPages(pages)
        setLoading(false)
    }
    const onSelect = (tree: any) => {
        setTree(tree)
        setForm('treeForm')
    }
    const onDelete = async (id: string) => {
        const { data } = await api.delete(`/tree?id=${id}`)
        if (data) {
            removeTree(id)
        }
    }
    const onView = async (id: string) => {
        const { data } = await api.get(`/tree?id=${id}`)
        setTree(data)

    }
    return (
        <div className="flex flex-col w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        {tableCol.map((col) => {
                            const isSortable = col.sortable
                            const selected = col.key === orderBy
                            if (selected) return (
                                <TableHead
                                    key={col.key}
                                    className="flex items-center "
                                    onClick={() => {
                                        handleSort()
                                    }} >
                                    {col.label}
                                    {sortOrder === 'asc' ? <MoveUp className="ml-2 h-4 w-4" /> : <MoveDown className="ml-2 h-4 w-4" />}
                                </TableHead>
                            )
                            return (
                                <TableHead key={col.key} onClick={() => {
                                    if (isSortable) {
                                        handleOrderBy(col.key)
                                    }
                                }} >
                                    {col.label}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell className="disabled:pointer-events-none" colSpan={7}>
                                <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                            </TableCell>
                        </TableRow>
                    ) : (
                        trees.map((tree: any) => {
                            return (
                                <TableRow key={tree.id}>
                                    <TableCell>{tree.number}</TableCell>
                                    <TableCell>{tree.commonName}</TableCell>
                                    <TableCell>{tree.scientificName}</TableCell>
                                    <TableCell>{maskToMeters(tree.dap)}</TableCell>
                                    <TableCell>{maskToMeters(tree.meters)}</TableCell>
                                    <TableCell>{maskToM3(tree.volumeM3)}</TableCell>
                                    <TableCell className="space-x-2 w-[400px]">
                                        <Button
                                            variant='outline'
                                            onClick={() => onSelect(tree)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant='outline'
                                            onClick={() => onDelete(tree.id)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            Remover
                                        </Button>
                                        <Button
                                            variant='outline'
                                            onClick={() => onView(tree.id)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Visualizar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody >
            </Table >
            <div className="flex justify-end">
                <div>
                    <TablePagination pages={maxPages} />
                </div>
            </div>
        </div>
    )
}