"use client"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import FieldsArray from "./FieldsArray";
import { Button } from "@/components/ui/button";
import { useDeleteDraft, useGetDraft, useSaveDraft } from "@/hooks/useDraft";
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import objectHash from 'object-hash';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSaveBatch, useSaveBatchAsDraft } from "@/hooks/useBatch";
import { ISection } from "@/domain/section";
import { exportSectionsToCutCsv } from "@/components/reports/exportSectionsToCutCsv";
import { findAllAutex } from "@/services/autexService";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatM3WithSuffix } from "@/lib/masks";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlert } from "@/context/AlertContex";

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
    autex_id: z.string().optional(),
    description: z.string().default(''),
    formHash: z.string(),
    formVersion: z.number(),
    id: z.string().nullable().default(null)

})

export type BatchSchema = z.infer<typeof formSchema>

const formType = "section_form"
const defaultValues = {
    tree: [],
    id: null,
    description: ''
}
const SectionFormIndex = ({ initialData }: { initialData: any }) => {
    const methods = useForm<BatchSchema>({
        resolver: zodResolver(formSchema),
        defaultValues

    });
    const { showAlert, hideAlert } = useAlert()
    const { data: autexList, isLoading: isLoadingAutex } = useQuery({
        queryKey: ['autex',],
        queryFn: async () => await findAllAutex({ page: 1, orderBy: '', order: '', noPagination: true }),
    })
    const { mutate: deleteDraft } = useDeleteDraft()
    const [sectionsCreated, setSectionsCreated] = useState<ISection[]>([])
    const { mutateAsync: saveBatchAsDraft, mutate: saveAsDraft, isPending: isPendingDraft } = useSaveBatchAsDraft({})
    const updatedRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useRef(
        debounce(async (data: any) => {
            if (!methods.getValues().id) {
                updatedRef.current = true;
                const response = await saveBatchAsDraft(methods.getValues());
                methods.setValue('id', response.id);
            } else if (!updatedRef.current && !isPendingDraft) {
                updatedRef.current = true;
                saveAsDraft(data);
            }

            // Libera novamente após 5 segundos
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                updatedRef.current = false;
            }, 5000);
        }, 2000)
    ).current;

    const resetForm = (data?: any) => {
        setSectionsCreated(data)
        methods.reset(defaultValues)
        deleteDraft(formType)
    }
    const { mutate: saveBatch, isPending } = useSaveBatch({ onSuccessCallback: resetForm })

    useEffect(() => {
        if (initialData) {
            methods.reset({
                ...initialData,
            });
        }
    }, []);

    const treeValue = methods.watch('tree');
    const hasData = methods.watch('tree').length > 0
    const filterAutex = methods.watch('autex_id')
    const formState = methods.watch()
    useEffect(() => {
        const hasId = !!formState.id;
        const hasTree = formState.tree?.length > 0;

        if (!updatedRef.current && (hasId || hasTree) && !isPendingDraft) {
            debouncedFn(formState);
        }
    }, [formState]);

    const onSubmit = async (formData: BatchSchema) => {
        saveBatch(formData)
    }
    const onSaveBatchAsDraft = () => {
        saveBatchAsDraft(methods.getValues())
    }
    const clearCreatedSections = () => {
        setSectionsCreated([])
    }
    const generateSectionsCsv = () => {
        exportSectionsToCutCsv(sectionsCreated)
        clearCreatedSections()
    }
    const onSelectAutex = (e: string) => {
        if (treeValue.length > 0) {
            showAlert({
                title: "Alerta",
                description: 'Ao selecionar outra autex você ira perder os dados já digitados',
                onCancel: () => {
                    hideAlert()
                },
                onConfirm: () => {
                    resetForm(defaultValues)
                    methods.setValue('autex_id', e)
                },
                type: 'destructive'
            })
        } else {
            methods.setValue('autex_id', e)
        }
    }
    return (
        <div className="flex w-full ">
            <FormProvider {...methods}>
                <div className="flex flex-col w-full space-y-2">
                    <label>Selecione uma Autex</label>
                    <div className="flex">
                        <Select onValueChange={onSelectAutex} value={filterAutex}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                                {!isLoadingAutex && autexList.data.map((autex: any) => (
                                    autex.id ? (
                                        <SelectItem key={autex.id} value={autex.id}>
                                            {autex.detentor_autorizacao} - {autex.numero_autorizacao} -{" "}
                                            {formatM3WithSuffix(autex.volumeM3_total)}
                                        </SelectItem>
                                    ) : null
                                ))}
                            </SelectContent>
                        </Select>
                        {filterAutex && (
                            <Button variant="ghost" size="icon" onClick={() => methods.setValue('autex_id', '')}>
                                ✕
                            </Button>
                        )}
                    </div>
                    {filterAutex ? (
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-2">
                            <div className="flex flex-col w-full space-y-2">
                                <FieldsArray {...methods} />
                            </div>
                            {hasData && (
                                <div className="w-full flex space-x-2">
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                type="button"
                                                title="Limpar formulario"

                                            >
                                                Limpar Formulario
                                            </Button>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Deseja mesmo limpar o formulario?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => resetForm()}>
                                                    Confirmar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <Button disabled={isPendingDraft} onClick={onSaveBatchAsDraft} type="button">Salvar como rascunho</Button>
                                    <Button disabled={isPending} type="submit">Salvar</Button>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="flex items-center space-x-4 w-full">
                            <Skeleton className="h-[50vh] w-full" />
                        </div>
                    )}

                </div>
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
export default SectionFormIndex