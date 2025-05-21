"use client"

import { dateMask, formatVolumeM3, maskToM3, maskToMeters } from "@/lib/masks"
import { ColumnDef, SortingFn } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { Trash, Eye, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Printer } from 'lucide-react';
import { useQueryState } from "@/hooks/useSearchParams"
import { useRouter } from "next/navigation"
import { useDeleteBatch, useGetBatch, useGetBatchWithSections } from "@/hooks/useBatch"
import { useGetSectionsByBatchId } from "@/hooks/useSection"
import { exportSectionsToCutCsv } from "@/components/reports/exportSectionsToCutCsv"
import { useAlert } from "@/context/AlertContex"
export type Batch = {
    id: string
    number: number
    volumeM3: number
    createdAt: Date
}



export const columns: ColumnDef<Batch>[] = [
    {
        accessorKey: 'number',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="relative cursor-pointer select-none text-white flex items-center justify-center text-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Numero
                    {isSorted && (
                        <span className="absolute right-0 pr-2">
                            {isSorted === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                        </span>
                    )}
                </div>
            );
        },
        cell: ({ row }) => {
            return <div className="capitalize text-center">{row.getValue('number')}</div>
        }
    }, {
        accessorKey: 'status',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="relative cursor-pointer select-none text-white flex items-center justify-center text-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Status
                    {isSorted && (
                        <span className="absolute right-0 pr-2">
                            {isSorted === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                        </span>
                    )}
                </div>
            );
        },
        cell: ({ row }) => {
            const value = row.getValue('status');
            const statusClass = value === 'finalized'
                ? 'border-green-600 text-green-700 bg-green-50'
                : 'border-red-600 text-red-700 bg-red-50';

            return (
                <div className="w-full h-full flex justify-center items-center">
                    <div className={`capitalize rounded border px-2 py-0.5 text-sm w-fit ${statusClass}`}>
                        {value === 'finalized' ? 'Finalizado' : 'Rascunho'}
                    </div>
                </div>
            );
        }

    },
    {
        accessorKey: 'volumeM3',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="relative cursor-pointer select-none text-white flex items-center justify-center text-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Vol. M3
                    {isSorted && (
                        <span className="absolute right-0 pr-2">
                            {isSorted === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                        </span>
                    )}
                </div>
            );
        },
        cell: ({ row }) => {
            const value = formatVolumeM3(row.getValue('volumeM3'))
            return <div className="capitalize text-center">{value}</div>
        }
    }, {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="relative cursor-pointer select-none text-white flex items-center justify-center text-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    <span className="mx-auto">Dt. Emissão</span>
                    {isSorted && (
                        <span className="absolute right-0 pr-2">
                            {isSorted === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                        </span>
                    )}
                </div>

            );
        },
        cell: ({ row }) => {
            return <div className="capitalize text-center">{dateMask(row.getValue('createdAt'))}</div>
        }
    }, {
        id: 'actions',
        header: () => <div className="text-center text-white">Opções</div>,
        size: 10,        // largura base da coluna
        maxSize: 10,     // largura máxima permitida
        minSize: 10,     // opcional: garante que não estique demais
        enableResizing: false, // impede redimensionamento se for suportado
        cell: ({ row }) => {
            const batchId = row.original.id;
            return (
                <div className="flex justify-center gap-1">
                    <ViewButton batchId={batchId} />
                    <GenerateCsv batchId={batchId} />
                    <DeleteButton batchId={batchId} />
                </div>
            );
        }
    }
]

const ViewButton = ({ batchId }: { batchId: string }) => {
    const router = useRouter()
    return (
        <Button
            variant='ghost'
            onClick={() => router.push(`/cortes/editar/${batchId}`)}>
            <Eye className="h-4 w-4 mr-2" />
        </Button>
    )
}
const GenerateCsv = ({ batchId }: { batchId: string }) => {
    const { refetch } = useGetSectionsByBatchId(batchId, false)

    const handleClick = async () => {
        const { data } = await refetch()
        if (data) {
            exportSectionsToCutCsv(data)
        }
    }
    return (
        <Button
            variant='ghost'
            onClick={handleClick}
        >
            <Printer className="h-4 w-4 mr-2" />
        </Button>
    )
}

const DeleteButton = ({ batchId }: { batchId: string }) => {
    const { refetch } = useGetBatchWithSections(batchId, false);
    const { showAlert } = useAlert();
    const { mutate: deleteBatch } = useDeleteBatch({ batchId });

    const handleDeleteAttempt = async () => {
        const { data } = await refetch();

        if (!data) return;

        if (data.sections.length > 0) {
            showAlert({
                title: 'AVISO',
                description: `O corte ${data.number} possui ${data.sections.length} seções. Deseja mesmo deletar? Isso apagará todas as seções lançadas.`,
                type: 'destructive',
                onConfirm: () => {
                    deleteBatch()
                },
            });
        } else {
            showAlert({
                title: 'Confirmação',
                description: `Deseja realmente deletar o corte ${data.number}?`,
                type: 'destructive',
                onConfirm: () => {
                    deleteBatch()
                    console.log('Confirmado: deletar batch sem seções');
                },
            });
        }
    };

    return (
        <Button variant="ghost" onClick={handleDeleteAttempt}>
            <Trash className="h-4 w-4 mr-2" />
        </Button>
    );
};
