"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import api from "@/lib/api"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"


const tableCol = [{
    label: 'id',
    key: 'id',
    sortable: false,
}, {
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
}]

export const TreeTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data } = await api.get('/tree')
            setData(data)
            setLoading(false)
        } catch (error) {

        }
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
                    data.map((tree: any) => {
                        return (
                            <TableRow key={tree.id}>
                                <TableCell >{tree.id}</TableCell>
                                <TableCell>{tree.number}</TableCell>
                                <TableCell>{tree.commonName}</TableCell>
                                <TableCell>{tree.scientificName}</TableCell>
                                <TableCell>{tree.dap}</TableCell>
                                <TableCell>{tree.meters}</TableCell>
                                <TableCell>{tree.volumeM3}</TableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody >
        </Table >
    )
}