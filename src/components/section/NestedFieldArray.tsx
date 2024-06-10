import React, { useEffect } from "react";
import { Control, Controller, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from "react-hook-form";
import { FormFieldValues } from "./FormFieldValues";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
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
})  {
    const { fields, remove, append, insert } = useFieldArray({
        control,
        name: `tree.${nestIndex}.section`

    });
    const tree = watch(`tree.${nestIndex}`)
    return (
        <div className="flex justify-center  flex-col space-y-2">
            {fields.map((item, k) => {
                const isFirstIndex = k === 0
                return (
                    <div className="flex space-x-1 2xl:space-x-8  items-center justify-center " key={item.id} >
                        <div >
                            {isFirstIndex && (<Label>Plaqueta</Label>)}
                            <Input {...register(`tree.${nestIndex}.section.${k}.number`)} />
                        </div>
                        <div >
                            {isFirstIndex && (<Label>Secção</Label>)}
                            <Input {...register(`tree.${nestIndex}.section.${k}.section`)} />
                        </div>
                        <div >
                            {isFirstIndex && <Label>D1</Label>}
                            <Controller
                                name={`tree.${nestIndex}.section.${k}.d1`}
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
                                name={`tree.${nestIndex}.section.${k}.d2`}
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
                            {isFirstIndex && <Label>D3</Label>}
                            <Controller
                                name={`tree.${nestIndex}.section.${k}.d3`}
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
                            {isFirstIndex && <Label>D4</Label>}
                            <Controller
                                name={`tree.${nestIndex}.section.${k}.d4`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={maskToMeters(field.value)}
                                        onChange={(e) => {
                                            setValue(`tree.${nestIndex}.section.${k}.d4`, unMask(e.target.value))
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
                                name={`tree.${nestIndex}.section.${k}.meters`}
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
                            {isFirstIndex && <Label>M3</Label>}
                            <SubTotal key={k} control={control} setValue={setValue} idx={k} nestIndex={nestIndex} />
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
                                    insert(k + 1, watch(`tree.${nestIndex}.section.${k}`))
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant='outline'
                                    onClick={() =>
                                        append({
                                            tree_id: tree.id,
                                            specie_id: tree.specie_id, 
                                            section: "",
                                            d1: 0,
                                            d2: 0,
                                            d3: 0,
                                            d4: 0,
                                            meters: 0,
                                            number: '',
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

const SubTotal = ({ nestIndex, idx, control, setValue }: {
    nestIndex: number,
    setValue: UseFormSetValue<FormFieldValues>,
    idx: number,
    control: Control<FormFieldValues>
}) => {
    const watch = useWatch({
        control,
        name: `tree.${nestIndex}.section.${idx}`
    })
    const { d1, d2, d3, d4, meters } = watch

    const watchTrees = useWatch({
        control,
        name: `tree.${nestIndex}.section`
    })

    useEffect(() => {
        const pi = Math.PI;
        const averageD1D2 = (((d1 / 100) + (d2 / 100)) / 2)
        const averageD3D4 = (((d3 / 100) + (d4 / 100)) / 2)
        const volumeM3 = ((((Math.pow(averageD1D2, 2) * (pi / 4)) + (Math.pow(averageD3D4, 2) * (pi / 4))) / 2) * (meters / 100))
        setValue(`tree.${nestIndex}.section.${idx}.volumeM3`, Math.ceil((volumeM3 * 1000)))
    }, [d1, d2, d3, d4, meters])

    useEffect(() => {
        const subTotal = watchTrees?.reduce((acc, obj) => {
            return acc + obj.volumeM3
        }, 0) || 0
        setValue(`tree.${nestIndex}.sectionsVolumeM3`, subTotal)
    }, [watch])

    return <Controller
        name={`tree.${nestIndex}.section.${idx}.volumeM3`}
        control={control}
        render={({ field }) => (
            <Input
                {...field}
                value={maskToM3(field.value)}
                readOnly
            >
            </Input>
        )}
    />
}
