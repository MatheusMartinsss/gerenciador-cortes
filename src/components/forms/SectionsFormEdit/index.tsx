"use client"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import FieldsArray from "./FieldsArray";
import { Button } from "@/components/ui/button";
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSaveBatch } from "@/hooks/useBatch";
import { ISection } from "@/domain/section";
import { exportSectionsToCutCsv } from "@/components/reports/exportSectionsToCutCsv";

export const sectionSchema = z.object({
    section: z.string().min(1, "Seccção é obrigatória"),
    plate: z.string().min(1, "Número é obrigatório"),
    specie_id: z.string(),
    tree_id: z.string(),
    d1: z.number().positive(),
    d2: z.number().positive(),
    d3: z.number().positive(),
    d4: z.number().positive(),
    meters: z.number().positive(),
    volumeM3: z.number().positive(),

})
export const treeSchema = z.object({
    id: z.string(),
    number: z.string().min(1, "Número é obrigatório"),
    dap: z.number().positive("DAP deve ser positivo"),
    meters: z.number().positive("Comprimento deve ser positivo"),
    range: z.number().int().min(1, "Alcance inválido"),
    specie_id: z.string().uuid(),
    scientificName: z.string().min(1, "Nome científico é obrigatório"),
    commonName: z.string().min(1, "Nome popular é obrigatório"),
    volumeM3: z.number().nonnegative("Volume deve ser positivo ou zero"),
    sections: z.array(sectionSchema).min(1, "Adicione ao menos corte"),
    sectionsVolumeM3: z.number()
})

export const formSchema = z.object({
    tree: z.array(treeSchema).min(1, "Adicione ao menos uma espécie"),
    description: z.string(),
    id: z.string(),
    volumeM3: z.number(),
    createdAt: z.date(),
    number: z.number()
})

export type BatchSchema = z.infer<typeof formSchema>

const defaultValues = {
    tree: [],
}
const SectionFormEditIndex = ({ data }: { data: any }) => {
    const methods = useForm<BatchSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: data

    });

    const [sectionsCreated, setSectionsCreated] = useState<ISection[]>([])
    const resetForm = (data?: any) => {
        setSectionsCreated(data)
        methods.reset(defaultValues)
    }
    const { mutate: saveBatch, isPending } = useSaveBatch({ onSuccessCallback: resetForm })

    const treeValue = methods.watch('tree');
    const hasData = methods.watch('tree').length > 0


    const onSubmit = async (formData: BatchSchema) => {
        //  saveBatch(formData)
    }
    const clearCreatedSections = () => {
        setSectionsCreated([])
    }
    const generateSectionsCsv = () => {
        exportSectionsToCutCsv(sectionsCreated)
        clearCreatedSections()
    }
    return (
        <div className="flex w-full ">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-2">
                    <div className="flex flex-col w-full space-y-2">
                        <FieldsArray {...methods} />
                    </div>
                    {hasData && (
                        <div className="w-full flex space-x-2">
                            <Button disabled={isPending} type="submit">Salvar</Button>
                        </div>
                    )}
                </form>
            </FormProvider>
            <AlertDialog open={sectionsCreated.length > 0} onOpenChange={clearCreatedSections} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Relatorio</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deseja gerar o relatorio de abate?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => clearCreatedSections()}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => generateSectionsCsv()}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
export default SectionFormEditIndex

