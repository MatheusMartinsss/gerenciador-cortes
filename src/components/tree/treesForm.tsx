"use client"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Trash, Copy, CirclePlus, FileUp } from 'lucide-react';
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { maskToM3, maskToMeters, unMask } from "@/lib/masks";
import * as exceljs from 'exceljs'
import { useEffect, useRef, useState } from "react";
import { ICreateTree } from "@/domain/tree";
import api from "@/lib/api";
import { useTree } from "@/hooks/useTree";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/hooks/useModal"

const TreeSchema = z.object({
    commonName: z.string().min(2),
    scientificName: z.string().min(2),
    number: z.coerce.number(),
    range: z.coerce.number(),
    dap: z.coerce.number(),
    meters: z.coerce.number(),
    volumeM3: z.coerce.number(),
})

const Schema = z.object({
    tree: z.array(TreeSchema)
})

export const TreesForm = () => {
    const { setTrees } = useTree()
    const { onClose } = useModal()
    const { toast } = useToast()
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const { register, control, handleSubmit, setValue } = useForm<z.infer<typeof Schema>>({
        defaultValues: {
            tree: [{
                number: 0,
                commonName: '',
                scientificName: '',
                range: 0,
                dap: 0,
                meters: 0,
                volumeM3: 0
            }]

        }
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };
    useEffect(() => { handleImport() }, [file])
    const { fields, insert, remove, append } = useFieldArray({
        control,
        name: 'tree'
    })
    const handleImport = async () => {
        if (file) {
            const reader = new FileReader()
            remove(0)
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    const data = e.target.result as Buffer;
                    const workbook = new exceljs.Workbook();
                    await workbook.xlsx.load(data);
                    const worksheet = workbook.worksheets[0];
                    const headerRow = worksheet.getRow(1).values;

                    const rows: ICreateTree[] = []
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            const rowData: ICreateTree = {
                                range: 0,
                                number: 0,
                                scientificName: '',
                                commonName: '',
                                dap: 0,
                                meters: 0,
                                volumeM3: 0
                            };

                            row.eachCell((cell, colNumber) => {
                                //@ts-ignore
                                const header = headerRow[colNumber]
                                const renamedHeader = renameHeader(header);
                                if (renamedHeader == 'dap' || renamedHeader == 'meters' || renamedHeader == 'volumeM3') {
                                    //@ts-ignore
                                    rowData[renamedHeader] = parseInt(renamedHeader == 'volumeM3' ? cell.value * 1000 : cell.value * 100);
                                } else {
                                    //@ts-ignore
                                    rowData[renamedHeader] = cell.value;
                                }
                            })
                            rows.push(rowData);
                        }
                    })

                    setValue('tree', rows)
                }
            }
            reader.readAsBinaryString(file);
        }
    }

    function renameHeader(originalHeader: string): string {
        if (originalHeader.toLowerCase() === 'arvore') {
            return 'number';
        } else if (originalHeader.toLowerCase() === 'picada') {
            return 'range';
        } else if (originalHeader.toLocaleLowerCase() === 'cientifico') {
            return 'scientificName'
        } else if (originalHeader.toLocaleLowerCase() === 'popular') {
            return 'commonName'
        } else if (originalHeader.toLocaleLowerCase() === 'dap') {
            return 'dap'
        } else if (originalHeader.toLocaleLowerCase() === 'altura') {
            return 'meters'
        } else if (originalHeader.toLocaleLowerCase() === 'volume') {
            return 'volumeM3'
        }
        return originalHeader;
    }

    const onSubmit = async (value: z.infer<typeof Schema>) => {
        try {
            const { data, status } = await api.post('/tree', value.tree)
            if (status == 201) {
                setTrees(data)
                onClose()
                toast({
                    description: `Arvores cadastradas com sucesso!.`,
                    variant: 'default'
                })
            }
        } catch (error) {
            toast({
                description: `Erro ao cadastrar, entre em contato com o suporte!.`,
                variant: 'destructive'
            })
        }
    }
    return (
        <div className="flex gap-4 flex-col max-h-[600px]  ">
            <div className="flex space-x-2">
                <div className="">
                    <Button
                        onClick={() => {
                            if (inputFileRef.current) {
                                inputFileRef.current.click();
                            }

                        }}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Carregar Planilha
                    </Button>
                    <input
                        type="file"
                        className=""
                        accept=".xls,.xlsx"
                        ref={inputFileRef}
                        style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
            </div>
            <div className="overflow-y-auto">
                <form className="flex justify-center  flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((item, idx) => {
                        const firsItem = idx === 0
                        return (
                            <div key={idx} className="flex space-x-2  items-center justify-center ">
                                <div className="w-[60px]">
                                    {firsItem && <Label className="font-bold">N°</Label>}
                                    <Input  {...register(`tree.${idx}.number`, { required: true, valueAsNumber: true })} />
                                </div>
                                <div className="w-[250px]">
                                    {firsItem && <Label className="font-bold">N. Cientifico</Label>}
                                    <Input {...register(`tree.${idx}.scientificName`, { required: true })} />
                                </div>
                                <div className="w-[200px]">
                                    {firsItem && <Label className="font-bold">N. Popular</Label>}
                                    <Input {...register(`tree.${idx}.commonName`, { required: true })} />
                                </div>
                                <div className="w-[60px]">
                                    {firsItem && <Label className="font-bold">Picada</Label>}
                                    <Input {...register(`tree.${idx}.range`, { required: true, valueAsNumber: true })} />
                                </div>
                                <div className="w-[60px]">
                                    {firsItem && <Label className="font-bold">DAP</Label>}
                                    <Controller
                                        name={`tree.${idx}.dap`}
                                        control={control}
                                        render={({ field }) => <Input
                                            {...field}
                                            value={maskToMeters(field.value)}
                                            onChange={(e) => {
                                                field.onChange(unMask(e.target.value))
                                            }}
                                        />}
                                    />
                                </div>
                                <div className="w-[80px]">
                                    {firsItem && <Label className="font-bold">Altura</Label>}
                                    <Controller
                                        name={`tree.${idx}.meters`}
                                        control={control}
                                        render={({ field }) => <Input
                                            {...field}
                                            value={maskToMeters(field.value)}
                                            onChange={(e) => {
                                                field.onChange(unMask(e.target.value))
                                            }}
                                        />}
                                    />
                                </div>
                                <div className="w-[100px]">
                                    {firsItem && <Label className="font-bold">M3</Label>}
                                    <Controller
                                        name={`tree.${idx}.volumeM3`}
                                        control={control}
                                        render={({ field }) => <Input
                                            {...field}
                                            value={maskToM3(field.value)}
                                            onChange={(e) => {
                                                field.onChange(unMask(e.target.value))
                                            }}
                                        />}
                                    />
                                </div>
                                <div  >
                                    {firsItem && <Label className="font-bold">Opções</Label>}
                                    <div className="flex space-x-1 justify-end items-end">
                                        <Button disabled={firsItem} variant='outline' size='icon' onClick={() => remove(idx)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                        <Button variant='outline' size='icon' onClick={() => {
                                            insert(idx + 1, item)
                                        }}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='icon'
                                            onClick={() => append({
                                                number: 0,
                                                commonName: '',
                                                scientificName: '',
                                                range: 0,
                                                dap: 0,
                                                meters: 0,
                                                volumeM3: 0
                                            })}
                                        >
                                            <CirclePlus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="flex justify-end space-x-4">
                        <Button variant='outline'>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}