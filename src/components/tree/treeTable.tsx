"use client"
import {
    Table,
    TableBody,
    TableCell,
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
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        if (!isOpen) {
            setTree(null)
        }
    }, [isOpen])
    const fetchData = async () => {
        const { data } = await api.get('/tree')
        setTrees(data)
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
        <Table>
            <TableHeader>
                <TableRow>
                    {tableCol.map((col) => {
                        return (
                            <TableHead key={col.key} >{col.label}</TableHead>
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
                                <TableCell>
                                    <Button onClick={() => onSelect(tree)}>Editar</Button>
                                    <Button onClick={() => onDelete(tree.id)}>Excluir</Button>
                                    <Button onClick={() => onView(tree.id)}>Visualizar</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody >
        </Table >
    )
}