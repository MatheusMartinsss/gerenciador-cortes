import React from "react";
import {
    Control,
    Controller,
    useFieldArray,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import { BatchSchema } from './index'
import { Label } from "@/components/ui/label";
import { maskToM3 } from "@/lib/masks";
import { SearchTree } from "@/components/SearchTree";
import { ITree } from "@/domain/tree";
import NestedFieldArray from "./NestedFieldArray";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CustomTree = ITree & {
    sectionsVolumeM3: number
}

export default function FieldsArray({
    control,
    register,
    setValue,
    getValues,
    watch,
}: {
    control: Control<BatchSchema>;
    register: UseFormRegister<BatchSchema>;
    setValue: UseFormSetValue<BatchSchema>;
    getValues: UseFormGetValues<BatchSchema>;
    watch: UseFormWatch<BatchSchema>
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tree"
    });
    const onSelectTree = (tree: ITree) => {
        append({
            ...tree, sectionsVolumeM3: 0, sections: [{
                d1: 0,
                d2: 0,
                d3: 0,
                d4: 0,
                meters: 0,
                plate: '',
                specie_id: tree.specie_id,
                section: '',
                tree_id: tree.id,
                volumeM3: 0
            }]
        });
    }
    const formSate = watch('tree')
    const autex_id = watch('autex_id')
    return (
        <div className="flex flex-col w-full space-y-4">
            <div className="w-full  bg-white">
                <SearchTree handleSelectedTree={onSelectTree} autex={autex_id} />
            </div>
            {formSate.length == 0 || !formSate ? (
                <Card className="p-6 rounded-2xl shadow-md mb-4 flex items-center justify-center h-[30vh] text-center">
                    <p className="text-lg font-medium text-gray-600">
                        Nenhuma árvore selecionada. Por favor, selecione pelo menos uma árvore para continuar.
                    </p>
                </Card>
            ) : (
                <div className="w-full flex flex-col" >
                    {fields.map((item, index) => {
                        return (
                            <Card className="p-4 pt-8 rounded-2xl shadow-md mb-4 relative group" key={index}>
                                <div className="flex flex-col space-y-1 justify-center items-center w-full" >
                                    <div className="absolute top-0 right-2 z-10 flex space-x-2">
                                        {/* Botão de remover espécie */}
                                        <AlertDialog >
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    type="button"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-transparent hover:text-inherit"
                                                    title="Remover espécie"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Deseja realmente remover a espécie "{watch(`tree.${index}.commonName`)}"?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            remove(index);
                                                        }}
                                                    >
                                                        Confirmar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <Label className="font-bold"> N° {item.number} {item.scientificName} {item.commonName} {item.volumeM3}</Label>
                                    <div key={item.id} className="flex space-x-2 border-t-2 items-center w-full border-black border-l-2 border-l-black h-4 border-r-2 border-r-black">
                                        <div className="flex flex-col">
                                        </div>
                                    </div>
                                    <div className="flex flex-col p-2">
                                        <NestedFieldArray nestIndex={index} {...{ control, register, watch, setValue }} />
                                    </div>
                                    <div className="flex w-full bg-slate-100 justify-end p-4">
                                        <Controller
                                            control={control}
                                            name={`tree.${index}.sectionsVolumeM3`}
                                            render={({ field }) => (
                                                <Label>Total:{maskToM3(field.value)}</Label>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                </div>
            )}
        </div >
    );
}

