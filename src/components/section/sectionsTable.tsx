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
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Trash, Pencil, Eye, MoveDown, MoveUp } from 'lucide-react';
import { useParams } from "@/hooks/useSearchParams"
import { TablePagination } from "../pagination/pagination"
import { Checkbox } from "../ui/checkbox"
import { useSection } from "@/hooks/useSection"
import { SectionTableHeader } from "./sectionTableHeader"

const tableCol = [{
    label: '#',
    key: '#',
    sortable: false
}, {
    label: 'N° Arvore',
    key: 'tree.number',
    sortable: true
}, {
    label: 'Plaqueta',
    key: 'number',
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
        handleOrderBy,
        handlePage
    } = useSection()
    const { setForm, isOpen } = useModal()
    const [loading, setLoading] = useState(true)
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
    return (
        <div className="flex flex-col w-full">
            <SectionTableHeader />
            <Table>
                <TableHeader>
                    <TableRow>
                        {tableCol.map((col) => {
                            const isSortable = col.sortable
                            const selected = col.key === orderBy
                            return (
                                <TableHead key={col.key}
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
                            <TableCell className="disabled:pointer-events-none" colSpan={7}>
                                <Skeleton className="h-[500px] w-full rounded-xl" ></Skeleton>
                            </TableCell>
                        </TableRow>
                    ) : (
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
                                    <TableCell>{section.tree.number}</TableCell>
                                    <TableCell>{section.number}</TableCell>
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
                                        <Button
                                            variant='outline'
                                            onClick={() => onView(section.id)}>
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
                    <TablePagination pages={maxPages} handlePage={handlePage} params={params} />
                </div>
            </div>
        </div>
    )
}