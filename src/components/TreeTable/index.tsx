"use client"
import {
    Table,
    TableBody,
    TableCaption,
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
import { Trash, Pencil, Eye, MoveDown, MoveUp, Ellipsis } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import * as exceljs from 'exceljs'
import { ViewTreeButton } from "./viewTreeButton"
import { DropdownMenuOptions } from "./DropDownMenu"
import { CutTreeButton } from "./CutTreeButton"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { ITree } from "@/domain/tree"

const tableCol = [{
    label: 'N°',
    key: 'number',
    sortable: true,
    numeric: true
}, {
    label: 'N. Popular',
    key: 'commonName',
    sortable: true,
    numeric: false
}, {
    label: 'N. Cientifico',
    key: 'scientificName',
    sortable: true,
    numeric: false
}, {
    label: 'DAP',
    key: 'dap',
    sortable: true,
    numeric: true
}, {
    label: 'Altura',
    key: 'meters',
    sortable: true,
    numeric: true
}, {
    label: 'Vol. Exploravel',
    key: 'volumeM3',
    sortable: true,
    numeric: true
}, {
    label: 'Vol. Explorado',
    key: 'sectionsVolumeM3',
    sortable: true,
    numeric: true
}, {
    label: 'Opções',
    key: 'options',
    sortable: false,
    numeric: false
}]

export const TreeTable = () => {
    const {
        setTree,
        setTrees,
        removeTree,
        selectedTrees,
        removeSelectedTree,
        addSelectedTree,
        addSelectedTrees,
        removeSelectedTrees,
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
    const { data: response, isLoading, isError } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, orderBy, sortOrder],
        queryFn: async () => await findAllTrees({ page, orderBy, order: sortOrder }),
        placeholderData: keepPreviousData

    })
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
            workBook.csv.writeBuffer().then((data) => {
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "download.csv";
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
        }
    }
    if (isLoading) return null
    if (isError) return null
    if (!response) return null
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
                    <CutTreeButton />
                </div>
                <div className='flex'>
                    <div className='flex w-max-sm items-center space-x-1'>
                        <Input value={searchText} onChange={(e) => handleSearch(e.target.value)} ></Input>
                        <Button variant='outline' onClick={() => handleSearchParam(searchText)}> <Search className="mr-2 h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            <div className="h-[80vh] relative overflow-auto shadow-md sm:rounded-lg">
                <Table className="table-fixed">
                    <TableHeader className="bg-green-950 font-bold rounded-2xl sticky top-0 ">
                        <TableRow>
                            <TableHead className="font-medium w-10">
                                <div className="flex">
                                    <Checkbox
                                        className=" border-slate-600 data-[state=checked]:bg-blue-400"
                                        checked={selectedTrees.length > 0}
                                        onCheckedChange={() => {
                                            if (selectedTrees.length > 0) {
                                                const treesIds = response?.data.map((tree) => tree.id)
                                                removeSelectedTrees(treesIds)
                                            } else {
                                                //     addSelectedTrees(trees)
                                            }
                                        }}
                                    >
                                    </Checkbox>
                                </div>
                            </TableHead>
                            {selectedTrees.length > 0 ? (
                                <TableHead colSpan={8}>
                                    {selectedTrees.length} Seleciondas
                                </TableHead>
                            ) : (
                                tableCol.map((col) => {
                                    const isSortable = col.sortable
                                    const selected = col.key === orderBy
                                    const isNumeric = col.numeric
                                    const isOptions = col.key == 'options'
                                    return (
                                        <TableHead
                                            className={`text-white font-medium ${isNumeric ? 'w-4' : 'w-28'}${isOptions && 'w-48 text-center'}`}
                                            key={col.key}
                                            onClick={() => {
                                                if (isSortable) {
                                                    handleOrderBy(col.key)
                                                    if (selected) {
                                                        handleSort()
                                                    }
                                                }
                                            }}
                                        >
                                            {!isSortable ? (
                                                <>
                                                    {col.label}
                                                </>
                                            ) : (
                                                <div className="flex space-x-2 items-center  ">
                                                    {col.label}
                                                    <div className="h-4 w-10 flex">
                                                        {selected && (
                                                            sortOrder === 'ASC' ?
                                                                <MoveUp className="h-4 w-4" /> :
                                                                <MoveDown className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </TableHead>
                                    )
                                })
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody   >
                        {isLoading ? (
                            <TableRow className="h-full w-full flex">
                                <TableCell className="disabled:pointer-events-none" colSpan={9}>
                                    <Skeleton className="h-full w-full rounded-xl" ></Skeleton>
                                </TableCell>
                            </TableRow>
                        ) : (
                            response?.data?.length > 0 ? (
                                response?.data.map((tree) => {
                                    const isSelected = selectedTrees.map((x) => x.id).includes(tree.id)
                                    return (
                                        <TableRow key={tree.id} >
                                            <TableCell >
                                                <Checkbox
                                                    className="border-slate-600 data-[state=checked]:bg-blue-400"
                                                    checked={isSelected}
                                                    onCheckedChange={() => {
                                                        if (isSelected) {
                                                            removeSelectedTree(tree.id)
                                                        } else {
                                                            addSelectedTree(tree)
                                                        }
                                                    }}
                                                >
                                                </Checkbox>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{tree.number}</TableCell>
                                            <TableCell className="text-sm font-medium" >{tree.commonName}</TableCell>
                                            <TableCell className="text-sm font-medium" >{tree.scientificName}</TableCell>
                                            <TableCell className="text-sm font-medium">{maskToMeters(tree.dap)}</TableCell>
                                            <TableCell className="text-sm font-medium">{maskToMeters(tree.meters)}</TableCell>
                                            <TableCell className="text-sm font-medium ">{maskToM3(tree.volumeM3)}</TableCell>
                                            <TableCell className="text-sm font-medium">{maskToM3(tree.sVolumeM3)}</TableCell>
                                            <TableCell className="text-center">
                                                <ViewTreeButton treeId={tree.id} />
                                                <Button variant="ghost">
                                                    <Trash className="w-5 h-5" />
                                                </Button>
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
                    <TableFooter className="bg-green-950 font-bold rounded-2xl sticky bottom-0 ">
                        <TableRow >
                            <TableCell colSpan={9}  >
                                <TablePagination pages={response?.totalPages} handlePage={handlePage} params={params} />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table >
            </div>
        </div>
    )
}