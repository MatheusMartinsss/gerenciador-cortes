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
import { Button } from "../ui/button"
import { useModal } from "@/hooks/useModal"
import { Input } from '@/components/ui/input';
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp, TreePine, Search } from 'lucide-react';
import { TablePagination } from "../pagination/pagination"
import { usespecie } from "@/hooks/useSpecie"
import { Label } from "../ui/label"

const tableCol = [{
    label: 'N. Popular',
    key: 'commonName',
    sortable: true
}, {
    label: 'N. Cientifico',
    key: 'scientificName',
    sortable: true
}, {
    label: 'M3',
    key: 'volumeM3',
    sortable: true
}, {
    label: 'M3 Abatido',
    key: 'sectionsVolumeM3',
    sortable: true
}, {
    label: 'Opções',
    key: 'options',
    sortable: false
}]

export const SpecieTable = () => {
    const {
        setSpecie,
        species,
        setSpecies,
        removeSpecie,
        handleSort,
        handleOrderBy,
        handlePage,
        handleSearchParam,
        params
    } = usespecie()
    const { setForm, isOpen } = useModal()
    const [loading, setLoading] = useState(true)
    const { searchParam, sortOrder, orderBy, page } = params
    const [maxPages, setMaxPages] = useState(0)
    const [searchText, setSearchText] = useState<string>('')
    useEffect(() => {
        fetchData()
    }, [searchParam, page, sortOrder, orderBy])
    useEffect(() => {
        if (!isOpen) {
            setSpecie(null)
        }
    }, [isOpen])
    const fetchData = async () => {
        const { data: { data, pages } } = await api.get('/specie', {
            params: {
                page,
                orderBy,
                sortOrder,
                searchParam
            }
        })
        setSpecies(data)
        setMaxPages(pages)
        setLoading(false)
    }
    const onSelect = (tree: any) => {
        setSpecie(tree)
        setForm('specieForm')
    }
    const onDelete = async (id: string) => {
        const { data } = await api.delete(`/specie?id=${id}`)
        if (data) {
            removeSpecie(id)
        }
    }
    const onView = async (id: string) => {
        const { data } = await api.get(`/specie?id=${id}`)
        setSpecie(data)

    }
    return (
        <div className="flex flex-col w-full space-y-2">
            <div className='flex w-full flex-row space-x-2  '>
                <div>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            setForm('specieForm')
                        }}
                    >
                        <TreePine className="mr-2 h-4 w-4" />
                        Cadastrar
                    </Button>
                </div>

                <div className='flex'>
                    <div className='flex w-max-sm items-center space-x-1'>
                        <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} ></Input>
                        <Button variant='outline' onClick={() => handleSearchParam(searchText)}> <Search className="mr-2 h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            <div className="h-[80vh] relative overflow-auto shadow-md sm:rounded-lg">
                <Table className="table-fixed">
                    <TableHeader className="bg-green-950 font-bold rounded-2xl ">
                        <TableRow >
                            {tableCol.map((col) => {
                                const isSortable = col.sortable
                                const selected = col.key === orderBy
                                return (
                                    <TableHead className="text-white" key={col.key}
                                        onClick={() => {
                                            if (isSortable) {
                                                handleOrderBy(col.key)
                                                if (selected) {
                                                    handleSort()

                                                }
                                            }
                                        }}
                                    >
                                        <div className="flex space-x-2">
                                            {col.label}
                                            <div className="h-4 w-10 flex items-center justify-center">
                                                {selected && (
                                                    sortOrder === 'asc' ?
                                                        <MoveUp className="h-4 w-4" /> :
                                                        <MoveDown className="h-4 w-4" />
                                                )}
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
                                <TableCell className="disabled:pointer-events-none" colSpan={5}>
                                    <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                                </TableCell>
                            </TableRow>
                        ) : (
                            species.length > 0 ? (
                                species.map((spcie: any) => {
                                    return (
                                        <TableRow key={spcie.id}>
                                            <TableCell className="">{spcie.commonName}</TableCell>
                                            <TableCell className="">{spcie.scientificName}</TableCell>
                                            <TableCell>{maskToM3(spcie.volumeM3)}</TableCell>
                                            <TableCell>{maskToM3(spcie.sectionsVolumeM3)}</TableCell>
                                            <TableCell className="space-x-2 w-[400px]">
                                                <Button
                                                    variant='outline'
                                                    onClick={() => onSelect(spcie)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant='outline'
                                                    onClick={() => onDelete(spcie.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Remover
                                                </Button>
                                                {/*  <Button
                                                variant='outline'
                                                onClick={() => onView(spcie.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Visualizar
                                </Button> */}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} className="disabled:pointer-events-none" >
                                        <div className="w-full flex flex-col items-center text-center justify-center h-[500px] bg-slate-200 rounded-lg space-y-4 ">
                                            <Label className="font-bold">Nenhuma especie encontrada!</Label>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody >
                    <TableFooter className="bg-green-950 font-bold rounded-2xl sticky bottom-0 ">
                        <TableRow >
                            <TableCell colSpan={5}  >
                               
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table >
            </div>
        </div>
    )
}