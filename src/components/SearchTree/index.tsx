import { ChangeEvent, useEffect, useRef, useState } from "react"
import api from "@/lib/api"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ITree } from "@/domain/tree"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "../ui/label"
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { findAllTrees, FindAllTreesResponse } from "@/services/treeService"
import { ChevronsRight, ChevronsLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDebounce } from '@uidotdev/usehooks'
interface ISearchTreeProps {
    handleSelectedTree: (data: ITree) => void
}
const schema = z.object({
    searchInput: z.string(),

})
export const SearchTree = ({ handleSelectedTree }: ISearchTreeProps) => {
    const [showDropDown, setShowDropDown] = useState(false)
    const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState<string>('number')
    const filterDebounce = useDebounce(filterBy, 500)
    const [text, setText] = useState<string>('')
    const textDebounce = useDebounce(text, 200)
    const { data: response } = useQuery<FindAllTreesResponse>({
        queryKey: ['trees', page, filterBy, textDebounce, filterDebounce],
        queryFn: async () => await findAllTrees({ page: Number(page), filterBy, searchTerm: textDebounce }),
        placeholderData: keepPreviousData

    })

    let totalPages = response?.totalPages || 0
    useEffect(() => {
        setPage(1)
    }, [filterBy, textDebounce])

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropDown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, inputRef]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const { value } = event.target
        const result = schema.safeParse({ searchInput: value });
        if (result.success) {
            setText(result.data?.searchInput)
            setShowDropDown(true);
        }
    }
    const handleDropDown = () => {
        setShowDropDown((state) => !state)
    }

    const handleSelected = (tree: ITree) => {
        setText('')
        setShowDropDown(false);
        handleSelectedTree(tree)
    }
    const handlePage = (page: number) => {
        setPage(page)
    }
    const handlePreviousPage = () => {
        if (page <= 1) return
        handlePage(page - 1)
    }
    const handleDoublePreviousPage = () => {
        if (page <= 1) return
        if (page == 2) {
            handlePage(page - 1)
        } else {
            handlePage(page - 2)
        }
    }
    const handleNextPage = () => {
        if (page == totalPages) return
        handlePage(page + 1)
    }
    const handleDoublePage = () => {
        if (page == totalPages) return
        if (page == totalPages - 1) {
            handlePage(page + 1)
        } else {
            handlePage(page + 2)
        }
    }
    return (
        <div className="w-full relative" >
            <div className="flex w-full space-x-2">
                <Select onValueChange={(value) => setFilterBy(value)} defaultValue="number" >
                    <SelectTrigger className="w-[120px] p-1">
                        <SelectValue placeholder="Filtrar Por" />
                    </SelectTrigger>
                    <SelectContent  >
                        <SelectGroup>
                            <SelectLabel>Opções</SelectLabel>
                            <SelectItem value="number">Numero</SelectItem>
                            <SelectItem value="scientificName">Cientifico</SelectItem>
                            <SelectItem value="commonName">Popular</SelectItem>
                            <SelectItem value="range">Picada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input ref={inputRef} onChange={handleChange} onFocus={handleDropDown} type="search" placeholder="Digite o numero de uma arvore, nome popular, cientifico..."></Input>
            </div>
            <div ref={dropdownRef} className={`w-full h-80 border border-gray-300 rounded-md bg-white z-[999] absolute  mt-2 ${!showDropDown && 'hidden'}`} >
                <div className="h-64 overflow-y-auto">
                    {response && response.data.length > 0 ? (
                        response.data.map((item, idx) => {
                            return (
                                <div onClick={() => handleSelected(item)} key={idx} className="px-5 py-3 border-b border-gray-200 text-stone-600 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="grid grid-cols-7 ">
                                        <div className="flex flex-col space-x-1 xl:flex-row" >
                                            <span className="font-bold">N°</span>
                                            <a>{item.number}</a>
                                        </div>
                                        <div className="flex col-span-2 text-wrap">
                                            {item.commonName} {item.scientificName}
                                        </div>
                                        <div className="flex flex-col space-x-1 xl:flex-row" >
                                            <span className="font-bold">Altura </span>
                                            <a>{maskToMeters(item.meters)}</a>
                                        </div>
                                        <div className="flex flex-col space-x-1 xl:flex-row" >
                                            <span className="font-bold">Picada</span>
                                            <a>{item.range}</a>
                                        </div>
                                        <div className="flex flex-col space-x-1 xl:flex-row"  >
                                            <span className="font-bold">Exploravel</span>
                                            <a>{maskToM3(item.volumeM3)}</a>
                                        </div>
                                        <div className="flex flex-col space-x-1 xl:flex-row "  >
                                            <span className="font-bold">Explorado</span>
                                            <a>{maskToM3(item.sVolumeM3)}</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <a>Nenhum resultado encontrado!</a>
                        </div>
                    )}
                </div>
                <div className="h-14 flex justify-between items-center border-t border-gray-200 p-2 ">
                    <Button type="button" size='sm' onClick={handleDropDown} variant='destructive'>
                        CANCELAR
                    </Button>
                    <div className='flex space-x-2'>
                        <div className='items-center flex '>
                            <Label>Pagina {page} de {response?.totalPages}</Label>
                        </div>
                        <Button type="button" className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleDoublePreviousPage}>
                            <ChevronsLeft className='h-4 w-4 ' />
                        </Button>
                        <Button type="button" className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handlePreviousPage}>
                            <ChevronLeft className='h-4 w-4 ' />
                        </Button>
                        <Button type="button" className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleNextPage}>
                            <ChevronRight className='h-4 w-4 ' />
                        </Button>
                        <Button type="button" className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleDoublePage}>
                            <ChevronsRight className='h-4 w-4 ' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}