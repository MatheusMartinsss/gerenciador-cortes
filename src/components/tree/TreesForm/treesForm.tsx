import { useForm, useFieldArray } from 'react-hook-form'
import api from "@/lib/api";
import FieldArray from "./FieldArray";
import { FormFieldValues } from "./FormFieldValues";
import { useTree } from '@/hooks/useTree';
import { useEffect, useRef, useState } from "react";
import { Trash, Copy, CirclePlus, FileUp } from 'lucide-react';
import { ICreateTree } from "@/domain/tree";
import * as exceljs from 'exceljs'
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { normalizeString } from '@/lib/masks';
const defaultValues: FormFieldValues = {
    specie: [{
        commonName: '',
        id: '',
        scientificName: '',
        trees: [{
            commonName: '',
            dap: 0,
            number: 0,
            range: 0,
            scientificName: '',
            specie_id: '',
            volumeM3: 0,
            meters: 0,
        }]
    },]
};

interface GroupedSpecies {
    [key: string]: ICreateTree[]
}

export const TreesForm = () => {
    const { selectedTrees, clearSelectedTrees } = useTree()
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const { onClose } = useModal()
    const { toast } = useToast()
    const { control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        reset,
        watch,
        setValue } = useForm<FormFieldValues>({
            mode: 'onBlur'
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
        name: 'specie'
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
                                specie_id: '',
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
                                } else if(renamedHeader == "scientificName" || renamedHeader == 'commonName'){
                                    rowData[renamedHeader] = normalizeString(String(cell.value))
                                } else {
                                    //@ts-ignore
                                    rowData[renamedHeader] = cell.value;
                                }
                                
                            })
                            rows.push(rowData);
                        }
                    })
                    const speciesGrouped = rows.reduce((acc: GroupedSpecies, obj, index) => {
                        const { scientificName } = obj
                        if (!acc[scientificName]) {
                            acc[scientificName] = [];
                        }
                        acc[scientificName].push(obj)
                        return acc;
                    }, {})

                    const obj = await Promise.all(
                        Object.entries(speciesGrouped).map(async ([key, value]) => {
                            return {
                                id: null,
                                commonName: value[0].commonName,
                                scientificName: value[0].scientificName,
                                trees: value
                            }
                        })
                    )
                    setValue('specie', obj)
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

    const onSubmit = async (value: FormFieldValues) => {
        await api.post('/tree', value)
    }
    return (
        <div className="flex flex-col space-y-2 max-h-[800px]  ">
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
            <form className="w-full flex space-y-4 flex-col overflow-y-scroll p-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldArray
                    {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                />
                <Button type="submit">Salvar</Button>
            </form>
        </div>
    );
}