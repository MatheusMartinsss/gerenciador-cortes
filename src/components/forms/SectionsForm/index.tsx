"use client"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import FieldsArray from "./FieldsArray";
import { Button } from "@/components/ui/button";
import { useDeleteDraft, useGetDraft, useSaveDraft } from "@/hooks/useDraft";
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from "react";
import objectHash from 'object-hash';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSaveBatch } from "@/hooks/useBatch";

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
    formHash: z.string(),
    formVersion: z.number()

})


export type BatchSchema = z.infer<typeof formSchema>

const formType = "section_form"
const defaultValues = {
    tree: [],
    formHash: '',
    formVersion: 0
}
const SectionFormIndex = () => {
    const methods = useForm<BatchSchema>({
        resolver: zodResolver(formSchema),
        defaultValues

    });
    const { data: draftData, isLoading } = useGetDraft(formType);
    const { mutate: saveDraft } = useSaveDraft<BatchSchema>({
        formType,
        successMessage: 'Rascunho salvo com sucesso!',
    });
    const { mutate: deleteDraft } = useDeleteDraft()
    const resetForm = () => {
        methods.reset(defaultValues)
        deleteDraft(formType)
    }
    const { mutate: saveBatch, isPending } = useSaveBatch({ onSuccessCallback: resetForm })
    const lastHash = useRef<string>('');
    const lastVersion = useRef<number>(0);

    const generateDataHash = useCallback((data: BatchSchema['tree']) => {
        return objectHash.sha1(data);
    }, []);

    useEffect(() => {
        if (draftData && draftData?.tree?.length > 0) {
            methods.reset({
                ...draftData,
                formHash: objectHash(draftData.tree),
                formVersion: draftData.formVersion || 0
            });
            lastHash.current = draftData.formHash || '';
            lastVersion.current = draftData.formVersion || 0;
        }
    }, [draftData]);

    const treeValue = methods.watch('tree');
    const currentHash = useMemo(() => generateDataHash(treeValue), [treeValue]);
    const hasData = methods.watch('tree').length > 0
    useEffect(() => {
        const debouncedSave = debounce((hash: string, version: number) => {
            if (hash !== lastHash.current && hasData) {
                const payload = {
                    ...methods.getValues(),
                    formHash: hash,
                    formVersion: version + 1
                };
                saveDraft(payload);
                lastHash.current = hash;
                lastVersion.current = payload.formVersion;
                methods.setValue('formVersion', payload.formVersion);
            }
        }, 2000);

        debouncedSave(currentHash, methods.getValues('formVersion'));

        return () => debouncedSave.cancel();
    }, [currentHash]);

    const onSubmit = async (formData: BatchSchema) => {
        saveBatch(formData)
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
                            <Button disabled={isPending} type="submit">Salvar</Button>
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    )
}
export default SectionFormIndex