import React, { useEffect } from "react";
import { Control, Controller, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from "react-hook-form";
import { FormFieldValues } from "./FormFieldValue";
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
        name: `tree.${nestIndex}.sections`

    });

    return (
        <div className="flex justify-center  flex-col space-y-4">
            {fields.map((item, k) => {
                const isFirstIndex = k === 0
                return (
                    <div className="flex 2xl:space-x-8 space-x-4  justify-between " key={item.id} >
                        <div >
                            {isFirstIndex && (<Label>Plaqueta</Label>)}
                            <Input {...register(`tree.${nestIndex}.sections.${k}.plate`)} />
                        </div>
                        <div >
                            {isFirstIndex && <Label>D1</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.d1`}
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
                            {isFirstIndex && <Label>D2</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.d2`}
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
                            {isFirstIndex && <Label>D3</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.d3`}
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
                            {isFirstIndex && <Label>D4</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.d4`}
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
                            {isFirstIndex && <Label>Comp</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.meters`}
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
                            {isFirstIndex && <Label>M3</Label>}
                            <Controller
                                name={`tree.${nestIndex}.sections.${k}.volumeM3`}
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
                                    insert(k + 1, watch(`tree.${nestIndex}.sections.${k}`))
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant='outline'
                                    onClick={() =>
                                        append({
                                            plate: '',
                                            d1: 0,
                                            d2: 0,
                                            d3: 0,
                                            d4: 0,
                                            section: '',
                                            commonName: '',
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

