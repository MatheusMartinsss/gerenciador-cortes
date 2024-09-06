import { useForm } from 'react-hook-form'
import { Button } from "../ui/button";
import api from "@/lib/api";
import FieldArray from "./FieldArray";
import { CSVLink } from 'react-csv'
import { FormFieldValues } from "./FormFieldValues";
import { useRef, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from '../ui/alert-dialog';
import { Dialog, DialogContent } from "../ui/dialog"
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

interface ICutTreeModal {
    open: boolean
    handleModal: () => void
}
const sectionSchema = z.object({
    tree_id: z.string(),
    section: z
        .string()
        .min(1, "A seção não pode ser uma string vazia")
        .regex(/^[a-zA-Z]+$/, "A seção deve conter apenas letras"),
    plate: z.string(),
    specie_id: z.string(),
    d1: z.number().min(10),
    d2: z.number().min(10),
    d3: z.number().min(10),
    d4: z.number().min(10),
    meters: z.number().min(10),
    volumeM3: z.number(),
});

const treeSchema = z.object({
    id: z.string(),
    number: z.number(),
    dap: z.number(),
    range: z.number(),
    scientificName: z.string(),
    specie_id: z.string(),
    commonName: z.string(),
    volumeM3: z.number(),
    sVolumeM3: z.number(),
    cutVolM3: z.number(),
    section: z.array(sectionSchema).min(1),
});

const formFieldValuesSchema = z.object({
    description: z.string(),
    tree: z.array(treeSchema).min(1),
});

const defaultValues: FormFieldValues = {
    description: 'teste',
    tree: []
};
const headers = [
    { label: "N° da avore", key: "number" },
    { label: "Secção", key: "section" },
    { label: "Diametro 1", key: "d1" },
    { label: "Diametro 2", key: "d4" },
    { label: "Comprimento", key: "meters" },
];

const createBatch = async (data: FormFieldValues) => {
    const reponse = await api.post('/batch', [data])
    return reponse.data
}

export const CutTreeModal = ({ open, handleModal }: ICutTreeModal) => {
    const { toast } = useToast()
    const [createdSections, setCreatedSections] = useState<any>([])
    const csvLink = useRef<any>()
    const [openAlert, setAlertOpen] = useState(false)
    const { control, register, handleSubmit, getValues, formState: { errors }, reset, watch, setValue, } = useForm<FormFieldValues>({
        defaultValues: defaultValues,
        resolver: zodResolver(formFieldValuesSchema),
        mode: 'onSubmit'
    })
    const onSubmit = async (value: FormFieldValues) => {
        mutate(value)

    }
    const handleDialogAlert = () => {
        setAlertOpen((state) => !state)
    }
    const onCreate = (data: any) => {
        setCreatedSections(data)
        handleDialogAlert()
    }
    const { mutate, isPending } = useMutation({
        mutationFn: createBatch,
        onSuccess: onCreate,
    })
    const generateCsv = () => {
        if (csvLink.current) {
            csvLink.current.link.click()
        }
        handleCloseDialog()
    }
    const getFormatedData = () => {
        return createdSections.map((section: any) => {
            return {
                number: section.number,
                section: section.section,
                d1: (section.d1 / 100).toFixed(2).replace('.', ','),
                d4: (section.d4 / 100).toFixed(2).replace('.', ','),
                meters: (section.meters / 100).toFixed(2).replace('.', ','),
            }
        })
    }
    const handleCloseDialog = () => {
        setAlertOpen(false)
        reset()
        handleModal()
    }
    return (
        <Dialog open={open} onOpenChange={handleModal}>
            <DialogContent className="max-w-[90%]  2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto  ">
                <div className="flex w-full space-y-2">
                    <form className="w-full flex space-y-4 flex-col overflow-y-scroll p-4 justify-between" onSubmit={handleSubmit(onSubmit)}>
                        <FieldArray
                            {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                        />
                        <div className='w-full flex'>
                            <Button disabled={!getValues('tree').length || isPending} className='w-full' type="submit">Salvar</Button>
                        </div>
                    </form>
                    <AlertDialog
                        open={openAlert}
                    >
                        <AlertDialogContent>
                            <AlertDialogDescription>
                                Gostaria de gerar a planilha de corte das seções?
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleCloseDialog}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={generateCsv}>Gerar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CSVLink ref={csvLink} filename="tracar.csv" headers={headers} data={getFormatedData()} separator=";" className="hidden"></CSVLink>
                </div>
            </DialogContent>
        </Dialog>
    );
}