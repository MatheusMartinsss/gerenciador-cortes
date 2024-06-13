import { useForm, useFormContext } from 'react-hook-form'
import { Button } from "../ui/button";
import api from "@/lib/api";
import FieldArray from "./FieldArray";
import { CSVLink } from 'react-csv'
import { FormFieldValues } from "./FormFieldValues";
import { useTree } from '@/hooks/useTree';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useToast } from '../ui/use-toast';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from '../ui/alert-dialog';


const defaultValues: FormFieldValues = {
    tree: [
        {
            commonName: '',
            id: '',
            range: 0,
            dap: 0,
            number: 0,
            scientificName: '',
            volumeM3: 0,
            sectionsVolumeM3: 0,
            specie_id: '',
            section: [{ tree_id: '', section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: '', volumeM3: 0, specie_id: '' }]
        },

    ]
};
const headers = [
    { label: "N° da avore", key: "number" },
    { label: "Secção", key: "section" },
    { label: "Diametro 1", key: "d1" },
    { label: "Diametro 2", key: "d4" },
    { label: "Comprimento", key: "meters" },
];
export const SectionsForm = () => {
    const { selectedTrees, clearSelectedTrees } = useTree()
    const { onClose } = useModal()
    const { toast } = useToast()
    const [createdSections, setCreatedSections] = useState<any>([])
    const csvLink = useRef<any>()
    const [openAlert, setAlertOpen] = useState(false)
    const { control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        reset,
        watch,
        setValue } = useFormContext<FormFieldValues>()

    useEffect(() => {
        if (selectedTrees) {
            if (getValues('tree').length) {
                const currentValue = getValues('tree')
                const newValue = selectedTrees.map((tree) => {
                    const alreadyExists = currentValue.find((x) => x.id == tree.id)
                    if (alreadyExists) {
                        return alreadyExists
                    }
                    return {
                        ...tree,
                        sectionsVolumeM3: 0,
                        section: [{ tree_id: tree.id, section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: '', volumeM3: 0, specie_id: tree.specie_id }]
                    }
                })
                setValue('tree', newValue)
            } else {
                const newValues = selectedTrees.map((tree) => {
                    return {
                        ...tree,
                        sectionsVolumeM3: 0,
                        section: [{ tree_id: tree.id, section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: '', volumeM3: 0, specie_id: tree.specie_id }]
                    }
                })
                setValue('tree', newValues)
            }
        }
    }, [selectedTrees])
    const onSubmit = async (value: FormFieldValues) => {
        const response = await api.post('/tree/section', value)
        if (response.status == 201) {
            toast({
                description: `Abates lançados com sucesso!.`,
                variant: 'default'
            })
        }
        const sections = value.tree
            .map(tree => {
                if (tree.section) {
                    return tree.section.map(section => ({
                        ...section,
                        number: tree.number
                    }));
                } else {
                    return [];
                }
            })
            .flat();
        setCreatedSections(sections)
        handleDialogAlert()
    }
    const handleDialogAlert = () => {
        setAlertOpen((state) => !state)
    }
    const generateCsv = () => {
        if (csvLink.current) {
            csvLink.current.link.click()
        }
        handleCloseDialog()
    }
    const getFormatedData = () => {
        return createdSections.map((section: any) => {
            return {
                ...section,
                d1: (section.d1 / 100).toFixed(2).replace('.', ','),
                d4: (section.d4 / 100).toFixed(2).replace('.', ','),
                meters: (section.meters / 100).toFixed(2).replace('.', ','),
            }
        })
    }
    const handleCloseDialog = () => {
        setAlertOpen(false)
        clearSelectedTrees()
        reset()
        onClose()
    }
    return (
        <div className="flex space-y-2   ">
            <form className="w-full flex space-y-4 flex-col overflow-y-scroll p-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldArray
                    {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                />
                <Button type="submit">Salvar</Button>
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
    );
}