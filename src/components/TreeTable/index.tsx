"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { useTree } from "@/hooks/useTree"
import { Button } from "../ui/button"
import { TreePine, Search } from 'lucide-react';
import { useModal } from "@/hooks/useModal"
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Eye, MoveDown, MoveUp, Ellipsis } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import * as exceljs from 'exceljs'
import { CutTreeButton } from "./CutTreeButton"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { useQueryState } from "@/hooks/useSearchParams"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { TreeModal } from "../TreeModal"
import { DataTable } from "./data-table"
import { columns } from "./columns"

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
    label: 'Exploravel',
    key: 'volumeM3',
    sortable: true,
    numeric: true
}, {
    label: 'Vol. Explorado',
    key: 'sVolumeM3',
    sortable: true,
    numeric: true
}, {
    label: 'Opções',
    key: 'options',
    sortable: false,
    numeric: false
}]
type SortOrder = 'ASC' | 'DESC' | '';

export const TreeTable = () => {
    const {
        setTree,
        selectedTrees,
        handleSearchParam,
    } = useTree()
    const { setForm, isOpen } = useModal()
    const [searchText, setSearchText] = useState<string>('')
    const [page] = useQueryState<number>('page', 1)
    const validFields = ['commonName', 'scientificName', 'createdAt'];
    const [orderBy, setOrderBy] = useQueryState('orderBy', 'createdAt', { type: 'enum', enum: validFields })
    const [order, setSortOrder] = useQueryState<SortOrder>('order', 'ASC')
    const { data: response, isLoading, isError } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, orderBy, order],
        queryFn: async () => await findAllTrees({ page: Number(page), orderBy, order }),
        placeholderData: keepPreviousData

    })
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
        <div className="flex flex-col w-full">
            <div className='flex w-full flex-row space-x-2'>
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
            <div className="h-[68vh] relative overflow-auto shadow-md sm:rounded-lg">
                <DataTable columns={columns} data={response.data} />
            </div>
            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response?.totalPages} />
            </div>
            <TreeModal />
        </div>
    )
}

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