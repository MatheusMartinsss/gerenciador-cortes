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

    return (
        <div className="space-y-4">
            {fields.map((item, index) => {
                return (
                    <div className="flex flex-col space-y-1 justify-center items-center w-full">
                        <Label className="font-bold"> N° {item.number} {item.scientificName} {item.commonName}</Label>
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
                                name={`tree.${index}.sectionsVolumeM3`}
                                render={({ field }) => (
                                    <Label>Total:{maskToM3(field.value)}</Label>
                                )}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

