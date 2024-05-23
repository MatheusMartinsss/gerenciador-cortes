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
import { Label } from "@/components/ui/label";
import { maskToM3 } from "@/lib/masks";

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
    const { fields, append, remove, prepend } = useFieldArray({
        control,
        name: "specie"
    });

    return (
        <div className="space-y-4">
            {fields.map((item, index) => {
                return (
                    <div className="flex flex-col space-y-1 justify-center  w-full">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <Label className="font-bold">N. Cientifico</Label>
                                <Label>{item.scientificName}</Label>
                            </div>
                            <div className="flex flex-col">
                                <Label className="font-bold">N. Popular</Label>
                                <Label>{item.commonName}</Label>
                            </div>
                            <div className="flex flex-col">
                                <Label className="font-bold">QTD</Label>
                                <Label className="text-center">{item.trees.length}</Label>
                            </div>
                            <div className="flex flex-col">
                                <Label className="font-bold text-center">M3</Label>
                                <Label className="text-center">{maskToM3(item.trees.reduce((acc, obj) => {
                                    return acc + obj.volumeM3
                                }, 0))}</Label>
                            </div>
                        </div>

                        <div key={item.id} className="flex space-x-2 border-t-2 items-center w-full border-black border-l-2 border-l-black h-4 border-r-2 border-r-black">
                            <div className="flex flex-col">
                            </div>
                        </div>
                        <div className="flex flex-col p-2 max-h-[150px] overflow-y-auto">
                            <NestedArray nestIndex={index} {...{ control, register, watch, setValue }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


