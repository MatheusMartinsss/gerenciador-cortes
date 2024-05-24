import { useForm } from 'react-hook-form'
import { Button } from "../ui/button";
import api from "@/lib/api";
import FieldArray from "./FieldArray";
import { FormFieldValues } from "./FormFieldValues";
import { useTree } from '@/hooks/useTree';
import { useEffect } from 'react';
import { useModal } from '@/hooks/useModal';
import { useToast } from '../ui/use-toast';

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
            section: [{ tree_id: '', section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: 0, volumeM3: 0, specie_id: '' }]
        },

    ]
};

export const SectionsForm = () => {
    const { selectedTrees, clearSelectedTrees } = useTree()
    const { onClose } = useModal()
    const { toast } = useToast()
    const { control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        reset,
        watch,
        setValue } = useForm<FormFieldValues>({
            mode: 'onBlur'
        })

    useEffect(() => {
        if (selectedTrees) {
            const newValues = selectedTrees.map((tree) => {
                return {
                    ...tree,
                    sectionsVolumeM3: 0,
                    section: [{ tree_id: tree.id, section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: 0, volumeM3: 0, specie_id: tree.specie_id }]
                }
            })
            setValue('tree', newValues)
        }
    }, [selectedTrees])
    const onSubmit = async (value: FormFieldValues) => {
        const response = await api.post('/tree/section', value)
        if (response.status == 201) {
            toast({
                description: `Abates lançados com sucesso!.`,
                variant: 'default'
            })
            clearSelectedTrees()
            onClose()
        }

    }
    return (
        <div className="flex space-y-2 max-h-[800px]  ">
            <form className="w-full flex space-y-4 flex-col overflow-y-scroll p-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldArray
                    {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                />
                <Button type="submit">Salvar</Button>
            </form>
        </div>
    );
}