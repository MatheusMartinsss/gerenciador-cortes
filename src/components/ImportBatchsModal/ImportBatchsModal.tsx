"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { Trash, Copy, CirclePlus, FileUp } from 'lucide-react';
import * as exceljs from 'exceljs'
import { useForm, useFieldArray } from 'react-hook-form'
import { FormFieldValues } from "./FormFieldValue"
import FieldArray from "./FieldArray"
import { ImportSectionsService } from "@/services/settingsService"


type RowData = Array<string | number | undefined>
const defaultValues: FormFieldValues = {
    tree: []
};
interface ISection {
    scientificName: string;
    commonName: string;
    number: number;
    section: string;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    meters: number;
    volumeM3: number;
    [key: string]: any; // Para cobrir campos extras
}


export const ImportBatchsModal = () => {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [grouped, setGrouped] = useState([])
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
    const formValue = watch('tree')
    const handleDialog = () => {
        setOpen((state) => !state)
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            const response = await ImportSectionsService(selectedFile)
            console.log(response)
        }
    };

    useEffect(() => {

    }, [file])

    const handleImport = async () => {
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const data = e.target.result as Buffer;
                    const workbook = new exceljs.Workbook();
                    await workbook.xlsx.load(data);
                    const worksheet = workbook.worksheets[0];
                    const headerRow: RowData = worksheet.getRow(1).values as RowData;

                    const rows: ISection[] = []
                    const numericColumns = ['d1', 'd2', 'd3', 'd4', 'meters', 'volumeM3', 'number']
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            let rowData: ISection = {
                                scientificName: '',
                                plate: '',
                                commonName: '',
                                number: 0,
                                section: '',
                                d1: 0,
                                d2: 0,
                                d3: 0,
                                d4: 0,
                                meters: 0,
                                volumeM3: 0
                            };
                            row.eachCell((cell, cellNumber) => {
                                const header = headerRow[cellNumber] as string
                                const renamedHeader = renameHeader(header as string)
                                if (numericColumns.includes(renamedHeader)) {
                                    if (renamedHeader == 'number' && cell.value) {
                                        rowData['plate'] = cell.value
                                        const formatedValue = String(cell.value).match(/^(\d+)([a-zA-Z])$/)
                                        if (formatedValue) {
                                            rowData[renamedHeader] = Number(formatedValue[1]) || 0
                                        }
                                    } else {
                                        rowData[renamedHeader] = Number(cell.value)
                                    }
                                }
                                else if (renamedHeader) {
                                    rowData[renamedHeader] = cell.value
                                }
                            })
                            rows.push(rowData)
                        }
                    })

                    const groupedByNumber = rows.reduce((acc: any, obj) => {
                        const { number } = obj;

                        let group: any = acc.find((item: any) => item.number === number);

                        if (!group) {
                            group = { number, sections: [] };
                            acc.push(group);
                        }

                        group.sections.push(obj);
                        return acc;
                    }, []);
                    setGrouped(groupedByNumber)
                    setValue('tree', groupedByNumber)
                }
            }
            reader.readAsBinaryString(file);
        }
    }

    function renameHeader(originalHeader: string): string {
        if (originalHeader.toLowerCase() === 'numero') {
            return 'number';
        } else if (originalHeader.toLocaleLowerCase() === 'cientifico') {
            return 'scientificName'
        } else if (originalHeader.toLocaleLowerCase() === 'popular') {
            return 'commonName'
        } else if (originalHeader.toLocaleLowerCase() === 'dap') {
            return 'dap'
        } else if (originalHeader.toLocaleLowerCase() === 'volume') {
            return 'volumeM3'
        }
        return originalHeader.toLocaleLowerCase();
    }

    return (
        <>
            <div className="flex items-center space-x-2">
                <Button variant='default' onClick={handleDialog}>Importar Abates</Button>
                <Label> Importar Abates de uma planilha CSV</Label>
            </div>
            <Dialog open={open} onOpenChange={handleDialog}>
                <DialogContent className="max-w-[90%] 2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto flex-col">
                    <DialogTitle className="shadow-sm p-2">
                        Importar Abates
                    </DialogTitle>
                    <div className="flex">
                        <div className="w-full">
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
                                accept=".xls,.xlsx,.csv"
                                ref={inputFileRef}
                                style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                    </div>
                    {/*formValue?.length === 0 || !formValue ? (
                        <div className='flex justify-center items-center text-center '>
                            <Label>Importe alguma planilha para carregar os dados...</Label>
                        </div>
                    ) : (
                        <div className='w-full flex flex-col   '>
                            <div >
                                <FieldArray
                                    {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                                />
                            </div>
                            <div >
                                <div className='w-full flex justify-center items-center p-4'>
                                    <Button className='w-full' type="submit">Salvar</Button>
                                </div>
                            </div>
                        </div>
                    )*/}
                </DialogContent>
            </Dialog>
        </>
    )
}