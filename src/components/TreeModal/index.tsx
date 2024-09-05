import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { ITreeWithSections } from "@/domain/tree"
import api from "@/lib/api"
import { dateMask, maskToM3, maskToMeters } from "@/lib/masks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useQueryState } from "@/hooks/useSearchParams"



export const TreeModal = () => {
    const [treeId, setTreeId] = useQueryState('treeId', '')
    const [tree, setTree] = useState<ITreeWithSections | null>(null)
    const [loading, setLoading] = useState(true)
    const open = treeId !== ''
    useEffect(() => {
        if (treeId) {
            const fetchData = async () => {
                const { data } = await api.get(`/tree/${treeId}`)
                setTree(data)
            }
            fetchData()
        }
    }, [treeId])

    const handleModalState = () => {
        setTreeId('')
    }

    return (
        <Dialog open={open} onOpenChange={handleModalState}>
            <DialogContent className="max-w-[80%]  2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto  ">
                {tree && (
                    <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-3  grid-rows-2 gap-2  p-2 justify-between  shadow-sm">
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700 ">N°</a>
                                <span className="font-medium text-sm  ">{tree.number}</span>
                            </div>
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700">Nome Popular</a>
                                <span className="font-medium text-sm ">{tree?.commonName}</span>
                            </div>
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700">Nome Cientifico</a>
                                <span className="font-medium text-sm">{tree?.scientificName}</span>
                            </div>
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700">Comprimento Total(m) </a>
                                <span className="font-medium text-sm ">{maskToMeters(tree.meters)}</span>
                            </div>
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700">Volume Exploravel</a>
                                <span className="font-medium text-sm  ">{maskToM3(tree?.volumeM3)}</span>
                            </div>
                            <div className="flex flex-col">
                                <a className="text-sm font-black text-gray-700">Volume Explorado</a>
                                <span className="font-medium text-sm  ">{maskToM3(tree?.sVolumeM3)}</span>
                            </div>
                        </div>
                        <div className="h-[50vh] relative overflow-auto shadow-md sm:rounded-lg">
                            <Table className="table-fixed">
                                <TableHeader className="bg-green-950 font-bold rounded-2xl sticky top-0 ">
                                    <TableRow>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>Plaqueta</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>Secção</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>D1</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>D2</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>D3</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>D4</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>Comp</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>Volume</TableHead>
                                        <TableHead className={`text-white font-medium w-20 text-center`}>Dt. Abate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tree.sections?.map((section) => {
                                        return (
                                            <TableRow key={section.id}>
                                                <TableCell className="text-sm font-medium text-center">{section.number}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{section.section}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToMeters(section.d1)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToMeters(section.d2)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToMeters(section.d3)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToMeters(section.d4)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToMeters(section.meters)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{maskToM3(section.volumeM3)}</TableCell>
                                                <TableCell className="text-sm font-medium text-center">{dateMask(section.createdAt)}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )

}