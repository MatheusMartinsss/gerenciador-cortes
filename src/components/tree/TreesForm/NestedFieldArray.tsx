import React, { useEffect } from "react";
import { Control, Controller, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from "react-hook-form";
import { FormFieldValues } from "./FormFieldValues";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Copy, CirclePlus } from 'lucide-react';
import { maskToM3, maskToMeters, unMask } from "@/lib/masks";

export default function NestedFieldArray({
    nestIndex,
    control,
    register,
    setValue,
    watch
}: {
    nestIndex: number;
    control: Control<FormFieldValues>;
    register: UseFormRegister<FormFieldValues>;
    watch: UseFormWatch<FormFieldValues>
    setValue: UseFormSetValue<FormFieldValues>
}) {
    const { fields, remove, append, insert } = useFieldArray({
        control,
        name: `specie.${nestIndex}.trees`

    });
    const specie_id = watch(`specie.${nestIndex}.id`)
    return (
        <div className="flex justify-center  flex-col space-y-4">
            {fields.map((item, k) => {
                const isFirstIndex = k === 0
                return (
                    <div className="flex 2xl:space-x-8 space-x-4  justify-between " key={item.id} >
                        <div >
                            {isFirstIndex && (<Label>Plaqueta</Label>)}
                            <Input {...register(`specie.${nestIndex}.trees.${k}.number`, { valueAsNumber: true })} />
                        </div>
                        <div >
                            {isFirstIndex && <Label>DAP</Label>}
                            <Controller
                                name={`specie.${nestIndex}.trees.${k}.dap`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={maskToMeters(field.value)}
                                        onChange={(e) => {
                                            field.onChange(unMask(e.target.value))
                                        }}
                                    >
                                    </Input>
                                )}
                            />
                        </div>
                        <div >
                            {isFirstIndex && <Label>Comp</Label>}
                            <Controller
                                name={`specie.${nestIndex}.trees.${k}.meters`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={maskToMeters(field.value)}
                                        onChange={(e) => {
                                            field.onChange(unMask(e.target.value))
                                        }}
                                    >
                                    </Input>
                                )}
                            />
                        </div>
                        <div>
                            {isFirstIndex && <Label>Volume M3</Label>}
                            <Controller
                                name={`specie.${nestIndex}.trees.${k}.volumeM3`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={maskToM3(field.value)}
                                        onChange={(e) => {
                                            field.onChange(unMask(e.target.value))
                                        }}
                                    >
                                    </Input>
                                )}
                            />
                        </div>

                        <div >
                            {isFirstIndex && <Label>Opções</Label>}
                            <div className="flex space-x-1 justify-end items-end">
                                <Button
                                    variant='outline'
                                    type="button"
                                    onClick={() => remove(k)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                                <Button variant='outline' type="button" onClick={() => {
                                    insert(k + 1, watch(`specie.${nestIndex}.trees.${k}`))
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant='outline'
                                    onClick={() =>
                                        append({
                                            specie_id,
                                            dap: 0,
                                            commonName: '',
                                            range: 0,
                                            scientificName: '',
                                            meters: 0,
                                            number: 0,
                                            volumeM3: 0
                                        })
                                    }
                                >
                                    <CirclePlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

