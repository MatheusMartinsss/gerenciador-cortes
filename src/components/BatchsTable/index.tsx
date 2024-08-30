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
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { useModal } from "@/hooks/useModal"
import { dateMask, maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { useSection } from "@/hooks/useSection"
import { Input } from '@/components/ui/input';
import { TreePine, Search } from 'lucide-react';
import { Label } from "../ui/label"
import { CSVLink } from 'react-csv'
import { batch } from "@prisma/client"
import { IBatch } from "@/domain/batch"


const tableCol = [{
    label: '#',
    key: '#',
    sortable: false
}, {
    label: 'Data',
    key: 'createdAt',
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

export const BatchsTable = () => {
    const [searchText, setSearchText] = useState<string>('')
    const [batchs, setBatchs] = useState<IBatch[] | []>([])
    const { setForm, isOpen } = useModal()
    const [loading, setLoading] = useState(true)
    const [sectionsToCut, setSectionsToCut] = useState<any>([])
    const sectionsToCutRef = useRef(sectionsToCut)
    const [maxPages, setMaxPages] = useState(0)
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        sectionsToCutRef.current = sectionsToCut
    }, [sectionsToCut])
    const fetchData = async () => {
        const { data } = await api.get('/batch', {

        })
        console.log(data[0])
        setBatchs(data)
        setLoading(false)
    }



    return (
        <div className="flex flex-col w-full space-y-2">
            <div className='flex w-full flex-row space-x-2  '>
                <div className='flex'>

                </div>
            </div>
            <div className="h-[80vh] relative overflow-auto shadow-md sm:rounded-lg">
                <Table className="table-fixed">
                    <TableHeader className="bg-green-950 font-bold rounded-2xl ">
                        <TableRow className="">
                            {tableCol.map((col) => {
                                const isSortable = col.sortable
                                //  const selected = col.key === orderBy
                                return (
                                    <TableHead
                                        className="text-white text-center"
                                        key={col.key}
                                        onClick={() => {
                                            /* if (isSortable) {
                                                 handleOrderBy(col.key)
                                                 if (selected) {
                                                     handleSort()
 
                                                 }
                                             }*/
                                        }}
                                    >
                                        <div className="flex space-x-2 text-center">
                                            {col.label}
                                            <div className="h-4 w-4 flex items-center justify-center">
                                                {/*selected && (
                                                    sortOrder === 'asc' ?
                                                        <MoveUp className="h-4 w-4" /> :
                                                        <MoveDown className="h-4 w-4" />
                                                )*/}
                                            </div>
                                        </div>
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell className="disabled:pointer-events-none" colSpan={13}>
                                    <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                                </TableCell>
                            </TableRow>
                        ) : (
                            batchs.length > 0 ? (
                                batchs.map((batch: IBatch) => {
                                    const isSelected = true
                                    return (
                                        <TableRow key={batch.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => {
                                                        /*  if (isSelected) {
                                                              removeSelectedbatch(batch.id)
                                                          } else {
                                                              addSelectedbatch(batch)
                                                          }*/
                                                    }}
                                                >
                                                </Checkbox>
                                            </TableCell>
                                            <TableCell>{dateMask(batch.createdAt)}</TableCell>
                                            <TableCell>{maskToM3(batch.volumeM3)}</TableCell>
                                            <TableCell className="space-x-2 w-[400px]">
                                                <Button
                                                    variant='outline'
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Remover
                                                </Button>

                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="disabled:pointer-events-none" >
                                        <div className="w-full flex flex-col items-center text-center justify-center h-[500px] bg-slate-200 rounded-lg space-y-4 ">
                                            <Label className="font-bold">Nenhuma secção encontrada!</Label>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody >
                    <TableFooter className="bg-green-950 font-bold rounded-2xl sticky bottom-0 ">
                        <TableRow >
                            <TableCell colSpan={4}  >

                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table >
            </div>

        </div>
    )
}