import { useForm, useFieldArray, Controller } from 'react-hook-form'
import FieldArray from "./FieldArray";
import { useEffect, useRef, useState } from "react";
import { FileUp } from 'lucide-react';
import { ICreateTree } from "@/domain/tree";
import * as exceljs from 'exceljs'
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/button';
import { formatM3WithSuffix, normalizeString } from '@/lib/masks';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { findAllAutex } from '@/services/autexService';
import { Card } from '@/components/ui/card';
import { LoaderOverlay } from '@/components/ui/loader-overlay';
import { useCreateTrees } from '@/hooks/useCreateTreesMutation';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
const defaultValues: FormFieldValues = {
    autex_id: '',
    specie: []
};

interface GroupedSpecies {
    [key: string]: ICreateTree[]
}
export const treeSchema = z.object({
    number: z.string().min(1, "Número é obrigatório"),
    dap: z.number().positive("DAP deve ser positivo"),
    meters: z.number().positive("Comprimento deve ser positivo"),
    range: z.number().int().min(1, "Alcance inválido"),
    specie_id: z.string().uuid().nullable(),
    scientificName: z.string().min(1, "Nome científico é obrigatório"),
    commonName: z.string().min(1, "Nome popular é obrigatório"),
    volumeM3: z.number().nonnegative("Volume deve ser positivo ou zero"),
})

export const specieSchema = z.object({
    id: z.string().uuid().nullable(),
    commonName: z.string().min(1, "Nome popular é obrigatório"),
    scientificName: z.string().min(1, "Nome científico é obrigatório"),
    trees: z.array(treeSchema).min(1, "Insira pelo menos uma árvore"),
})

export const formSchema = z.object({
    autex_id: z.string().uuid("ID do Autex inválido"),
    specie: z.array(specieSchema).min(1, "Adicione ao menos uma espécie"),
})


export type FormFieldValues = z.infer<typeof formSchema>

export const TreesForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const { onClose } = useModal()
    const { control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        reset,
        watch,
        setValue } = useForm<FormFieldValues>({
            resolver: zodResolver(formSchema),
            mode: 'onBlur'
        })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };
    const { data: autexList, isLoading: isLoadingAutex, isError } = useQuery({
        queryKey: ['autex',],
        queryFn: async () => await findAllAutex({ page: 1, orderBy: '', order: '', noPagination: true }),
        placeholderData: keepPreviousData

    })
    const { mutate: createTrees, isPending, isSuccess } = useCreateTrees(onClose)


    useEffect(() => { handleImport() }, [file])
    const { remove } = useFieldArray({
        control,
        name: 'specie'
    })
    const formValue = watch('specie')
    const autexId = watch('autex_id')
    const handleImport = async () => {
        if (file) {
            const reader = new FileReader()
            remove(0)
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    const data = e.target.result as any;
                    const workbook = new exceljs.Workbook();
                    await workbook.xlsx.load(data);
                    const worksheet = workbook.worksheets[0];
                    const headerRow = worksheet.getRow(1).values;

                    const rows: ICreateTree[] = []
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            const rowData: ICreateTree = {
                                range: 0,
                                number: '',
                                scientificName: '',
                                specie_id: null,
                                commonName: '',
                                dap: 0,
                                meters: 0,
                                autex_id: autexId,
                                volumeM3: 0
                            };

                            row.eachCell((cell, colNumber) => {
                                //@ts-ignore
                                const header = headerRow[colNumber]
                                const renamedHeader = renameHeader(header);
                                if (renamedHeader === 'dap' || renamedHeader === 'meters' || renamedHeader === 'volumeM3') {
                                    const rawValue = String(cell.value)
                                        .replace(",", ".")
                                        .replace(/[^\d.-]/g, "");

                                    if (renamedHeader === 'meters') {
                                        const metersValue = parseFloat(rawValue);
                                        // Se for menor que 100, multiplica por 100 (ex: 10 → 1000)
                                        rowData[renamedHeader] = metersValue < 100 ? metersValue * 100 : metersValue;
                                    }
                                    else if (renamedHeader === 'volumeM3') {
                                        const cleaned = String(cell.value)
                                            .replace(",", ".")
                                            .replace(/[^\d.-]/g, "");

                                        const volumeNumber = parseFloat(cleaned);

                                        if (!isNaN(volumeNumber)) {
                                            // Arredonda para 3 casas decimais e converte para inteiro fixo
                                            const rounded = Math.round(Number(volumeNumber.toFixed(3)) * 1000);
                                            rowData[renamedHeader] = rounded / 1000;
                                        } else {
                                            rowData[renamedHeader] = 0;
                                        }
                                    }
                                    else {
                                        rowData[renamedHeader] = Number(rawValue);
                                    }
                                }
                                else if (renamedHeader === "scientificName" || renamedHeader === 'commonName') {
                                    rowData[renamedHeader] = normalizeString(String(cell.value));
                                }
                                else {
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
                                trees: value.map((tree) => {
                                    return {
                                        ...tree,
                                        number: String(tree.number)
                                    }
                                })
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
        createTrees(value)
        if (isSuccess) {
            reset()
        }
    }
    return (
        <div className="flex flex-col space-y-1 w-full">
            <div className="grid-cols-1 gap-2 space-y-2">
                {isPending && <LoaderOverlay message='Cadastrando arvores...' />}
                <div className="space-y-2">
                    <label htmlFor="autex">Selecione uma Autex</label>
                    <Controller
                        name="autex_id"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Escolha uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                    {!isLoadingAutex && autexList.data.map((autex: any) => (
                                        <SelectItem key={autex.id} value={autex.id}>
                                            {autex.detentor_autorizacao} - {autex.numero_autorizacao} -{" "}
                                            {formatM3WithSuffix(autex.volumeM3_total)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

            </div>
            <form className="w-full flex space-y-4 flex-col  p-4 " onSubmit={handleSubmit(onSubmit)}>
                {formValue?.length === 0 || !formValue ? (
                    <Card className="p-4 rounded-2xl shadow-md mb-4">
                        <div className='flex justify-center items-center text-center flex-col space-y-4 '>
                            <Label>Importe alguma planilha para carregar os dados...</Label>
                            <div className="w-full">
                                <Button
                                    type='button'
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
                    </Card>
                ) : (
                    <div className="w-full flex flex-col">
                        {/* Conteúdo com scroll interno */}
                        <div className="max-h-[60vh] overflow-y-auto px-4">
                            <FieldArray
                                {...{ control, register, defaultValues, getValues, setValue, errors, watch }}
                            />
                        </div>

                        {/* Botão sempre visível */}
                        <div className="w-full flex justify-center items-center p-4">
                            <Button className="w-full" type="submit">Salvar</Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}