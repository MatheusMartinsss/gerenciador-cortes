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
import { FormFieldValues } from "./FormFieldValues";
import NestedArray from "./NestedFieldArray";
import { Label } from "../ui/label";
import { maskToM3 } from "@/lib/masks";
import { SearchTree } from '../SearchTree';
import { ITree } from "@/domain/tree";
import { Button } from "../ui/button";
import { X } from 'lucide-react';
export default function Fields({
    control,
    register,
    setValue,
    getValues,
    watch,
}: {
    control: Control<FormFieldValues>;
    register: UseFormRegister<FormFieldValues>;
    setValue: UseFormSetValue<FormFieldValues>;
    getValues: UseFormGetValues<FormFieldValues>;
    watch: UseFormWatch<FormFieldValues>
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tree"
    });

    const handleSelectedTree = (tree: ITree) => {
        if (fields.find((item) => item.number == tree.number)) {
            return
        }
        append({
            ...tree,
            cutVolM3: 0,
            section: [{ tree_id: tree.id, section: "", d1: 0, d2: 0, d3: 0, d4: 0, meters: 0, number: '', volumeM3: 0, specie_id: tree.specie_id }]
        })
    }

    return (
        <div className="space-y-4">
            <div className='flex space-x-2'>
                <SearchTree handleSelectedTree={handleSelectedTree} />
            </div>
            {fields.length > 0 ? (
                fields.map((item, index) => {
                    return (
                        <div className="flex flex-col space-y-1 bg-slate-50  w-full rounded-md" key={index}>
                            <div className="flex w-full  justify-end rounded-sm items-end ">
                                <Button onClick={() => remove(index)} size='icon' variant='ghost'>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="w-full p-4 space-y-2">
                                <div className="grid  grid-cols-4  w-full ">
                                    <div className="flex flex-col w-10 ">
                                        <Label className="font-bold">N°</Label>
                                        <Label>{item.number}</Label>
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="font-bold">Especie</Label>
                                        <Label>{item.scientificName} {item.commonName}</Label>
                                    </div>
                                    <div className="flex flex-col  items-end">
                                        <div className="flex flex-col items-center">
                                            <Label className="font-bold">Exploravel</Label>
                                            <Label>{maskToM3(item.volumeM3)}</Label>
                                        </div>
                                    </div>
                                    <div className="flex flex-col  items-end">
                                        <div className="flex flex-col items-center">
                                            <Label className="font-bold">Explorado</Label>
                                            <Label>{maskToM3(item.sVolumeM3)}</Label>
                                        </div>
                                    </div>
                                </div>
                                <div key={item.id} className="flex space-x-2 border-t-2 items-center w-full border-black border-l-2 border-l-black h-4 border-r-2 border-r-black">
                                    <div className="flex flex-col">
                                    </div>
                                </div>
                                <div className="flex flex-col p-2">
                                    <NestedArray nestIndex={index} {...{ control, register, watch, setValue }} />
                                </div>
                                <div className="flex w-full bg-slate-100 justify-end p-4">
                                    <Controller
                                        control={control}
                                        name={`tree.${index}.cutVolM3`}
                                        render={({ field }) => (
                                            <Label>Total:{maskToM3(field.value)}</Label>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className=""> 
                    Adicione uma arvore
                </div>
            )}
        </div>
    );
}

