"use client"
import SectionFormEditIndex from "@/components/forms/SectionsFormEdit"
import { useGetBatchWithSections } from "@/hooks/useBatch"
import { useParams } from "next/navigation"


export default function EditarCortes() {
    const { id } = useParams()
    const { data, isLoading } = useGetBatchWithSections(id as string)
    if (isLoading) return <div>Carregando...</div>
    return (
        <div className="w-full flex min-h-screen">
            <SectionFormEditIndex data={data} />
        </div>
    )
}