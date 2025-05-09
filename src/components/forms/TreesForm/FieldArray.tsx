import React, { useEffect, useState } from "react";
import {
    Control,
    useFieldArray,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import { FormFieldValues } from "./FormFieldValues";
import NestedArray from "./NestedFieldArray";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { SpecieComboBox } from "@/components/ui/specieComboBox";
import { useQuery } from "@tanstack/react-query";
import { findAllSpecie } from "@/services/specieService";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
    const [editIndex, setEditMode] = useState<number | null>(null)
    const toggleEditMode = (index: number) => setEditMode((state) => { if (state == index) { return null } return index })
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast()
    const { data: species = [], isLoading } = useQuery({
        queryKey: ["species", searchTerm],
        queryFn: async () => await findAllSpecie({ searchTerm }),
        enabled: editIndex !== null,
    });

    useEffect(() => {
        if (editIndex) {
            setSearchTerm(" "); // força busca inicial
        }
    }, [editIndex]);

    return (
        <div className="space-y-4">
            {fields.map((item, index) => {
                const editMode = editIndex === index
                return (
                    <Card key={index} className="p-4 pt-8 rounded-2xl shadow-md mb-4 relative group">
                        <div className="absolute top-0 right-2 z-10 flex space-x-2">
                            {/* Botão de editar/concluir */}
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => toggleEditMode(index)}
                                className={cn(
                                    "transition-opacity duration-200 hover:bg-transparent hover:text-inherit",
                                    editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                                title={editMode ? "Concluir edição" : "Editar"}
                            >
                                {editMode ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Pencil className="w-4 h-4" />
                                )}
                            </Button>

                            {/* Botão de remover espécie */}
                            <AlertDialog >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        hidden={editMode}
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
                                            Deseja realmente remover a espécie "{watch(`specie.${index}.commonName`)}"?
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
                        <div key={index} className="flex flex-col space-y-1 justify-center  w-full">
                            <div className="flex justify-between items-center mb-2" >
                                {editMode ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                                        <div className="flex col-span-2 flex-col">
                                            <Label className="font-bold">N. Científico</Label>
                                            <Input
                                                {...register(`specie.${index}.scientificName`)}
                                                onChange={(e) => {
                                                    setValue(`specie.${index}.id`, null);
                                                    setValue(`specie.${index}.scientificName`, e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col col-span-2">
                                            <Label className="font-bold">N. Popular</Label>
                                            <Input {...register(`specie.${index}.commonName`)} />
                                        </div>

                                        {/* Divider opcional */}
                                        <div className="sm:col-span-4 flex items-center justify-center relative">
                                            <div className="flex items-center justify-center relative my-2">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-300" />
                                                </div>
                                                <div className="relative bg-white px-2 text-xs uppercase text-gray-400 tracking-wide">
                                                    ou selecione uma espécie existente
                                                </div>
                                            </div>
                                        </div>

                                        {/* Combobox */}
                                        <div className="sm:col-span-4">
                                            <SpecieComboBox
                                                onSelect={(selected) => {
                                                    if (!selected) {
                                                        setValue(`specie.${index}.id`, null);
                                                    } else {
                                                        setValue(`specie.${index}.id`, selected.id);
                                                        setValue(`specie.${index}.scientificName`, selected.scientificName);
                                                        setValue(`specie.${index}.commonName`, selected.commonName);
                                                    }
                                                }}
                                                options={species}
                                                value={watch(`specie.${index}.id`) || ""}
                                                onSearch={setSearchTerm}
                                                loading={isLoading}
                                                renderValue={(specie) =>
                                                    specie ? (
                                                        <div className="flex flex-col text-left w-full">
                                                            <span className="text-sm font-mono">
                                                                {specie.scientificName} - {specie.commonName}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            Selecionar espécie cadastrada
                                                        </span>
                                                    )
                                                }
                                            />

                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col">
                                            <Label className="font-bold">N. Cientifico</Label>
                                            <Label>{watch(`specie.${index}.scientificName`)}</Label>
                                        </div>
                                        <div className="flex flex-col">
                                            <Label className="font-bold">N. Popular</Label>
                                            <Label>{watch(`specie.${index}.commonName`)}</Label>
                                        </div>
                                        <div className="flex flex-col">
                                            <Label className="font-bold">QTD</Label>
                                            <Label className="text-center">{item.trees.length}</Label>
                                        </div>
                                        <div className="flex flex-col">
                                            <Label className="font-bold text-center">M3</Label>
                                            <Label className="text-center">{(item.trees.reduce((acc, obj) => {
                                                return acc + obj.volumeM3
                                            }, 0)).toFixed(3)}</Label>
                                        </div>
                                    </>
                                )}

                            </div>
                            <div
                                key={item.id}
                                className="flex space-x-2 border-t border-gray-300 items-center w-full h-4"
                            >
                                <div className="flex flex-col"></div>
                            </div>
                            <div className="flex flex-col  max-h-[150px] overflow-y-auto">
                                <NestedArray nestIndex={index} {...{ control, register, watch, setValue }} />
                            </div>
                        </div >
                    </Card >
                );
            })}
        </div >
    );
}


