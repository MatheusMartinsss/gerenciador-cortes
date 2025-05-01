"use client"

import { useEffect, useState } from "react"
import { useTree } from "@/hooks/useTree"
import { Button } from "@/components/ui/button"
import { TreePine, Search } from 'lucide-react';
import { useModal } from "@/hooks/useModal"
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TablePagination } from "@/components/nagivation/pagination/pagination"
import * as exceljs from 'exceljs'
import { CutTreeButton } from "./CutTreeButton"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { useQueryState } from "@/hooks/useSearchParams"
import { TreeModal } from "@/components/modal/TreeModal"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useDebounce } from "@uidotdev/usehooks"

type SortOrder = 'ASC' | 'DESC' | '';

export const TreeTable = () => {
    const {
        setTree,
        selectedTrees,
        handleSearchParam,
    } = useTree()
    const { setForm, isOpen } = useModal()
    const [searchText, setSearchText] = useState<string>('')
    const textDebounce = useDebounce(searchText, 200)
    const [page] = useQueryState<number>('page', 1)
    const validFields = ['commonName', 'scientificName', 'createdAt', 'meters', 'sVolumeM3', 'volumeM3'];
    const [orderBy] = useQueryState('orderBy', 'number', { type: 'enum', enum: validFields })
    const [order] = useQueryState<SortOrder>('order', 'ASC')
    const { data: response, isLoading, isError } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, orderBy, order, textDebounce],
        queryFn: async () => await findAllTrees({ page: Number(page), orderBy, order, searchTerm: textDebounce }),
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

    return (
        <div >
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

            <DataTable columns={columns} data={response?.data || []} />

            <div className="bg-green-950 font-bold rounded-b-2xl p-2 flex w-full">
                <TablePagination pages={response?.totalPages || 0} />
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