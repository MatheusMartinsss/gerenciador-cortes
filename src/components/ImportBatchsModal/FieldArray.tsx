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
import { FormFieldValues } from "./FormFieldValue";
import NestedArray from "./NestedFieldArray";
import { Label } from "@/components/ui/label";
import { maskToM3 } from "@/lib/masks";
import { SearchTree } from "../SearchTree";

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
        name: "tree"
    });
    const handleSelectTree = (value, index) => {
        setValue(`tree.${index}`, value)
        console.log(value, index)
    }
    return (
        <div className="space-y-4">
            {fields.map((item, index) => {
                return (
                    <div key={index} className="flex flex-col space-y-1 justify-center  w-full">
                        <SearchTree handleSelectedTree={(value) => {
                            handleSelectTree(value, index)
                        }} />
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
                                <Label className="text-center">{item.sections.length}</Label>
                            </div>
                        </div>

                        <div key={item.id} className="flex space-x-2 border-t-2 items-center w-full border-black border-l-2 border-l-black h-4 border-r-2 border-r-black">
                            <div className="flex flex-col">
                            </div>
                        </div>
                        <div className="flex flex-col  max-h-[150px] overflow-y-auto">
                            <NestedArray nestIndex={index} {...{ control, register, watch, setValue }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

