"use client"
import SectionFormIndex from "@/components/forms/SectionsForm"
import { useGetBatchWithSectionsGroupedByTree } from "@/hooks/useBatch"
import { useParams } from "next/navigation"


export default function EditarCortes() {
    const { id } = useParams()
    const { data, isLoading } = useGetBatchWithSectionsGroupedByTree(id as string)
    if (isLoading) return <div>Carregando...</div>
    return (
        <div className="w-full flex min-h-screen">
            <SectionFormIndex initialData={data} />
        </div>
    )
}