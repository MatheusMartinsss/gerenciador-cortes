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
import { TreePine, Search } from 'lucide-react';
import { useModal } from "@/hooks/useModal"
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { useParams } from "@/hooks/useSearchParams"
import { Input } from '@/components/ui/input';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { formatSearchParam } from "@/lib/searchParam"
import * as exceljs from 'exceljs'
const tableCol = [{
    label: '#',
    key: '#',
    sortable: false
}, {
    label: 'N°',
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
    label: 'M3 Abate',
    key: 'sectionsVolumeM3',
    sortable: true
}, {
    label: 'Opções',
    key: 'options',
    sortable: false
}]

export const TreeTable = () => {
    const {
        setTree,
        trees,
        setTrees,
        removeTree,
        selectedTrees,
        removeSelectedTree,
        addSelectedTree,
        handleSort,
        handleSearchParam,
        handleOrderBy,
        handlePage,
        params } = useTree()
    const { setForm, isOpen } = useModal()
    const [searchText, setSearchText] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const { searchParam, sortOrder, orderBy, page } = params
    const [maxPages, setMaxPages] = useState(0)
    useEffect(() => {
        fetchData()
    }, [searchParam, page, sortOrder, orderBy])
    useEffect(() => {
        if (searchText.trim() == '') {
            handleSearchParam('')
        }
    }, [searchText])
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
    const handleSearch = (value: string) => {
        setSearchText(value)
    }
    const generateBatch = () => {
        const workBook = new exceljs.Workbook()
        const sheet = workBook.addWorksheet("tracar");
        sheet.columns = [
            {
                header: "Nº Árvore",
                key: 'id'
            }, 
        ]
        if (selectedTrees.length > 0) {
            selectedTrees.map((tree: any) => {
                sheet.addRow({
                    id: tree?.number,
                    
                })
            })
            workBook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "download.xlsx";
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
        }
    }
    return (
        <div className="flex flex-col w-full space-y-2 ">
            <div className='flex w-full flex-row space-x-2  '>
                <div>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            setForm('treesForm')
                        }}
                    >
                        <TreePine className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                </div>
                <div>
                    <Button
                        disabled={selectedTrees.length === 0}
                        variant='secondary'
                        onClick={() => {
                            generateBatch()
                        }}
                    >
                        <TreePine className="mr-2 h-4 w-4" />
                        Cortar
                    </Button>
                </div>
                <div>
                    <Button
                        disabled={selectedTrees.length === 0}
                        variant='secondary'
                        onClick={() => {
                            setForm('sectionsForm')
                        }}
                    >
                        <TreePine className="mr-2 h-4 w-4" />
                        Tracar
                    </Button>
                </div>
                <div className='flex'>
                    <div className='flex w-max-sm items-center space-x-1'>
                        <Input value={searchText} onChange={(e) => handleSearch(e.target.value)} ></Input>
                        <Button variant='outline' onClick={() => handleSearchParam(searchText)}> <Search className="mr-2 h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader className="bg-green-950 font-bold rounded-2xl ">
                    <TableRow>
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
                <TableBody className=" overflow-y-scroll w-full rounded-xl">
                    {loading ? (
                        <TableRow>
                            <TableCell className="disabled:pointer-events-none" colSpan={9}>
                                <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                            </TableCell>
                        </TableRow>
                    ) : (
                        trees.length > 0 ? (
                            trees.map((tree: any) => {
                                const isSelected = selectedTrees.map((x) => x.id).includes(tree.id)
                                return (
                                    <TableRow key={tree.id}>
                                        <TableCell aria-checked className="w-2">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => {
                                                    if (isSelected) {
                                                        removeSelectedTree(tree.id)
                                                    } else {
                                                        console.log(tree)
                                                        addSelectedTree(tree)
                                                    }
                                                }}
                                            >
                                            </Checkbox>
                                        </TableCell>
                                        <TableCell className="w-2">{tree.number}</TableCell>
                                        <TableCell >{tree.commonName}</TableCell>
                                        <TableCell >{tree.scientificName}</TableCell>
                                        <TableCell>{maskToMeters(tree.dap)}</TableCell>
                                        <TableCell>{maskToMeters(tree.meters)}</TableCell>
                                        <TableCell>{maskToM3(tree.volumeM3)}</TableCell>
                                        <TableCell>{maskToM3(tree.sectionsVolumeM3)}</TableCell>
                                        <TableCell className="space-x-2 ">
                                            {/*  <Button
                                                variant='outline'
                                                onClick={() => onSelect(tree)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Editar
                                            </Button> */}
                                            <Button
                                                variant='outline'
                                                onClick={() => onDelete(tree.id)}>
                                                <Trash className="mr-2 h-4 w-4" />
                                                Remover
                                            </Button>
                                            {/* <Button
                                                variant='outline'
                                                onClick={() => onView(tree.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Visualizar
                                        </Button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="disabled:pointer-events-none" >
                                    <div className="w-full flex flex-col items-center text-center justify-center h-[500px] bg-slate-200 rounded-lg space-y-4 ">
                                        <Label className="font-bold">Nenhuma arvore encontrada!</Label>
                                        <Button
                                            variant='secondary'
                                            onClick={() => {
                                                setForm('treesForm')
                                            }}
                                        >
                                            <TreePine className="mr-2 h-4 w-4" />
                                            Importar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>

                        )
                    )}
                </TableBody >
            </Table >
            <div className="flex justify-end">
                <div>
                    <TablePagination pages={maxPages} handlePage={handlePage} params={params} />
                </div>
            </div>
        </div>
    )
}