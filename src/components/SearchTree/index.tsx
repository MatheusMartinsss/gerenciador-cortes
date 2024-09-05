import { ChangeEvent, useEffect, useState } from "react"
import api from "@/lib/api"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ITree } from "@/domain/tree"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "../ui/label"
import { maskToM3, maskToMeters } from "@/lib/masks"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

interface ISearchTreeProps {
    handleSelectedTree: (data: ITree) => void
}
const schema = z.object({
    searchInput: z.string().min(1),

})
export const SearchTree = ({ handleSelectedTree }: ISearchTreeProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const [data, setData] = useState<ITree[]>([])

    const fetchData = async (searchText: string) => {
        setIsLoading(true)
        const { data: { data } } = await api.get('/tree', {
            params: {
                searchParam: searchText
            }
        })
        if (data) {
            setIsLoading(false)
            setData(data)
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const { value } = event.target
        const result = schema.safeParse({ searchInput: value });
        if (result.success) {
            fetchData(value);
            setShowDropDown(true);
        } else {
            setShowDropDown(false);
        }

    }
    const handleSelected = (tree: ITree) => {
        setData([])
        setShowDropDown(false);
        handleSelectedTree(tree)
    }
    return (
        <div className="w-full relative">
            <div className="flex space-x-2">
                <Select defaultValue="number">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar Por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Opções</SelectLabel>
                            <SelectItem value="all">Livre</SelectItem>
                            <SelectItem value="number">Numero</SelectItem>
                            <SelectItem value="scientificName">N. Cientifico</SelectItem>
                            <SelectItem value="commonName">N. Popular</SelectItem>
                            <SelectItem value="range">Picada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input onChange={handleChange} type="search" placeholder="Digite o numero de uma arvore, nome popular, cientifico..."></Input>
            </div>
            <div className={`w-full h-60 border border-gray-300 rounded-md bg-white z-[999] absolute overflow-y-auto mt-2 ${!showDropDown && 'hidden'}`} >
                {data.length > 0 ? (
                    data.map((item, idx) => {
                        return (
                            <div onClick={() => handleSelected(item)} key={idx} className="px-5 py-3 border-b border-gray-200 text-stone-600 cursor-pointer hover:bg-slate-100 transition-colors">
                                <div className="grid grid-cols-7 ">
                                    <div className="flex flex-col space-x-1 xl:flex-row" >
                                        <span className="font-bold">N°</span>
                                        <a>{item.number}</a>
                                    </div>
                                    <div className="flex col-span-2">
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
                        <div>
                            <a>Nenhum resultado encontrado!</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}