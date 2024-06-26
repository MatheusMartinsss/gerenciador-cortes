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
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { useSection } from "@/hooks/useSection"
import { Input } from '@/components/ui/input';
import { TreePine, Search } from 'lucide-react';
import { Label } from "../ui/label"
import { CSVLink } from 'react-csv'
import { SectionsReports } from "./SectionsReport"

const tableCol = [{
    label: '#',
    key: '#',
    sortable: false
}, {
    label: 'N°',
    key: 'tree.number',
    sortable: true
}, {
    label: 'Plaqueta',
    key: 'number',
    sortable: true
}, {
    label: 'Secção',
    key: 'section',
    sortable: true
}, {
    label: 'N. Cientifico',
    key: 'tree.scientificName',
    sortable: true
}, {
    label: 'N. Popular',
    key: 'tree.commonName',
    sortable: true
}, {
    label: 'D1',
    key: 'd1',
    sortable: true
}, {
    label: 'D2',
    key: 'd2',
    sortable: true
}, {
    label: 'D3',
    key: 'd3',
    sortable: true
}, {
    label: 'D4',
    key: 'd4',
    sortable: true
}, {
    label: 'Comp.',
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

export const SectionsTable = () => {
    const [searchText, setSearchText] = useState<string>('')
    const {
        setSection,
        sections,
        setSections,
        removeSection,
        selectedSections,
        removeSelectedSection,
        addSelectedSection,
        params,
        handleSort,
        handleSearchParam,
        handleOrderBy,
        handlePage
    } = useSection()
    const { setForm, isOpen } = useModal()
    const [loading, setLoading] = useState(true)
    const [sectionsToCut, setSectionsToCut] = useState<any>([])
    const sectionsToCutRef = useRef(sectionsToCut)
    const csvLink = useRef<any>()
    const { searchParam, sortOrder, orderBy, page } = params
    const [maxPages, setMaxPages] = useState(0)
    useEffect(() => {
        fetchData()
    }, [searchParam, page, sortOrder, orderBy])
    useEffect(() => {
        if (!isOpen) {
            setSection(null)
        }
    }, [isOpen])
    useEffect(() => {
        sectionsToCutRef.current = sectionsToCut
    }, [sectionsToCut])
    const fetchData = async () => {
        const { data: { data, pages } } = await api.get('/section', {
            params: {
                page,
                orderBy,
                sortOrder,
                searchParam
            }
        })
        setSections(data)
        setMaxPages(pages)
        setLoading(false)
    }
    const onSelect = (section: any) => {
        setSection(section)

    }
    const onDelete = async (id: string) => {
        const { data } = await api.delete(`/section?id=${id}`)
        if (data) {
            removeSection(id)
        }
    }
    const onView = async (id: string) => {
        const { data } = await api.get(`/section?id=${id}`)
        setSection(data)

    }
    const generateBatch = () => {
        if (csvLink.current) {
            csvLink.current.link.click()
        }
    }
    const headers = [
        { label: "N° da avore", key: "tree.number" },
        { label: "Secção", key: "section" },
        { label: "Diametro 1", key: "d1" },
        { label: "Diametro 2", key: "d4" },
        { label: "Comprimento", key: "meters" },
    ];
    const getFormatedData = () => {
        return selectedSections.map((section) => {
            return {
                ...section,
                d1: (section.d1 / 100).toFixed(2).replace('.', ','),
                d4: (section.d4 / 100).toFixed(2).replace('.', ','),
                meters: (section.meters / 100).toFixed(2).replace('.', ','),
            }
        })
    }
    return (
        <div className="flex flex-col w-full space-y-2">
            <div className='flex w-full flex-row space-x-2  '>
                <div className='flex'>
                    <div className='flex w-max-sm items-center space-x-1'>
                        <Button disabled={selectedSections.length === 0} size='sm' onClick={generateBatch}>Gerar Corte</Button>
                        <CSVLink ref={csvLink} filename="tracar.csv" headers={headers} data={getFormatedData()} separator=";" className="hidden"></CSVLink>
                        <SectionsReports />
                        <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} ></Input>
                        <Button variant='outline' onClick={() => handleSearchParam(searchText)}> <Search className="mr-2 h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            <div className="h-[80vh] relative overflow-auto shadow-md sm:rounded-lg">
                <Table className="table-fixed">
                    <TableHeader className="bg-green-950 font-bold rounded-2xl ">
                        <TableRow className="">
                            {tableCol.map((col) => {
                                const isSortable = col.sortable
                                const selected = col.key === orderBy
                                return (
                                    <TableHead
                                        className="text-white text-center"
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
                                        <div className="flex space-x-2 text-center">
                                            {col.label}
                                            <div className="h-4 w-4 flex items-center justify-center">
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
                                <TableCell className="disabled:pointer-events-none" colSpan={13}>
                                    <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sections.length > 0 ? (
                                sections.map((section: any) => {
                                    const isSelected = selectedSections.map((x) => x.id).includes(section.id)
                                    return (
                                        <TableRow key={section.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => {
                                                        if (isSelected) {
                                                            removeSelectedSection(section.id)
                                                        } else {
                                                            addSelectedSection(section)
                                                        }
                                                    }}
                                                >
                                                </Checkbox>
                                            </TableCell>
                                            <TableCell >{section.tree.number}</TableCell>
                                            <TableCell>{section.number}</TableCell>
                                            <TableCell>{section.section}</TableCell>
                                            <TableCell>{section.tree.scientificName}</TableCell>
                                            <TableCell>{section.tree.commonName}</TableCell>
                                            <TableCell>{maskToMeters(section.d1)}</TableCell>
                                            <TableCell>{maskToMeters(section.d2)}</TableCell>
                                            <TableCell>{maskToMeters(section.d3)}</TableCell>
                                            <TableCell>{maskToMeters(section.d4)}</TableCell>
                                            <TableCell>{maskToMeters(section.meters)}</TableCell>
                                            <TableCell>{maskToM3(section.volumeM3)}</TableCell>
                                            <TableCell className="space-x-2 w-[400px]">
                                                <Button
                                                    variant='outline'
                                                    onClick={() => onDelete(section.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Remover
                                                </Button>
                                                {/*  <Button
                                                variant='outline'
                                                onClick={() => onView(section.id)}>
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
                                            <Label className="font-bold">Nenhuma secção encontrada!</Label>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody >
                    <TableFooter className="bg-green-950 font-bold rounded-2xl sticky bottom-0 ">
                        <TableRow >
                            <TableCell colSpan={13}  >
                                <TablePagination pages={maxPages} handlePage={handlePage} params={params} />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table >
            </div>

        </div>
    )
}