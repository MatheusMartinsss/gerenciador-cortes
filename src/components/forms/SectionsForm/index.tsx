"use client"
import { SearchTree } from "@/components/SearchTree";
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { ITree } from "@/domain/tree";
import FieldsArray from "./FieldsArray";

export const sectionSchema = z.object({
    section: z.string().min(1, "Seccção é obrigatória"),
    plate: z.string().min(1, "Número é obrigatório"),
    d1: z.number().positive(),
    d2: z.number().positive(),
    d3: z.number().positive(),
    d4: z.number().positive(),
    meters: z.number().positive(),
    volumeM3: z.number().positive(),

})
export const treeSchema = z.object({
    number: z.string().min(1, "Número é obrigatório"),
    dap: z.number().positive("DAP deve ser positivo"),
    meters: z.number().positive("Comprimento deve ser positivo"),
    range: z.number().int().min(1, "Alcance inválido"),
    specie_id: z.string().uuid().nullable(),
    scientificName: z.string().min(1, "Nome científico é obrigatório"),
    commonName: z.string().min(1, "Nome popular é obrigatório"),
    volumeM3: z.number().nonnegative("Volume deve ser positivo ou zero"),
    sections: z.array(sectionSchema).min(1, "Adicione ao menos corte")
})


export const formSchema = z.object({
    tree: z.array(treeSchema).min(1, "Adicione ao menos uma espécie"),
})


export type FormFieldValues = z.infer<typeof formSchema>


const SectionFormIndex = () => {
    const methods = useForm<FormFieldValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tree: [],
        },

    });

    return (
        <div className="flex w-full ">
            <FormProvider {...methods}>
                <div className="flex flex-col w-full">
                    <FieldsArray {...methods} />
                </div>
            </FormProvider>
        </div>
    )
}
export default SectionFormIndex