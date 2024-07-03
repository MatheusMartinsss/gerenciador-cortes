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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from '../ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from '../ui/input';
import { SearchTree } from '../SearchTree';
import { ITree } from '@/domain/tree';

interface ICutTreeModal {
    open: boolean
    handleModal: () => void
}

const defaultValues: FormFieldValues = {
    tree: [
        {
            commonName: '',
            id: '',
            range: 0,
            cutVolM3: 0,
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


export const CutTreeModal = ({ open, handleModal }: ICutTreeModal) => {
    const { selectedTrees, clearSelectedTrees } = useTree()
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
        setValue,
    } = useForm<FormFieldValues>({
        mode: 'onBlur',
        defaultValues: defaultValues

    })
    useEffect(() => {
        if (selectedTrees) {
            const currentValue = getValues('tree')
            const newValue = selectedTrees.map((tree) => {
                const alreadyExists = currentValue.find((x) => x.id == tree.id)
                if (alreadyExists) {
                    return alreadyExists
                }
                return {
                    ...tree,
                    cutVolM3: 0,
                    section: [{ tree_id: tree.id, section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: '', volumeM3: 0, specie_id: tree.specie_id }]
                }
            })
            setValue('tree', newValue)
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
        handleModal()
    }
    return (
        <Dialog open={open} onOpenChange={handleModal}>
            <DialogContent className="max-w-[80%]  2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto  ">
                <div className="flex w-full space-y-2">
                    <form className="w-full flex space-y-4 flex-col overflow-y-scroll p-4" onSubmit={handleSubmit(onSubmit)}>
                        <FieldArray
                            {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                        />
                        <div className='w-full flex'>
                            <Button disabled={!getValues('tree').length} className='w-full' type="submit">Salvar</Button>
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