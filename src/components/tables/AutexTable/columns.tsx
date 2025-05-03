"use client";

import { dateMask, formatVolumeM3 } from "@/lib/masks";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";

export type Autex = {
    id: string;
    numero_autorizacao: string;
    detentor_autorizacao: string;
    volumeM3_total: number;
    validade_inicial: Date;
};

export const columns: ColumnDef<Autex>[] = [
    {
        accessorKey: "numero_autorizacao",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Autorização
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("numero_autorizacao")}</div>
        ),
    },
    {
        accessorKey: "detentor_autorizacao",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Detentor
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("detentor_autorizacao")}</div>
        ),
    },
    {
        accessorKey: "volumeM3_total",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Vol. Total M³
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => (
            <div>{formatVolumeM3(row.getValue("volumeM3_total"))}</div>
        ),
    },
    {
        accessorKey: "validade_inicial",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <div
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="cursor-pointer select-none text-white flex items-center"
                    role="columnheader"
                    aria-sort={
                        isSorted === "asc"
                            ? "ascending"
                            : isSorted === "desc"
                                ? "descending"
                                : "none"
                    }
                >
                    Validade Inicial
                    {isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                </div>
            );
        },
        cell: ({ row }) => (
            <div>{dateMask(row.getValue("validade_inicial"))}</div>
        ),
    },
    {
        id: "actions",
        header: () => (
            <div className="text-white" role="columnheader">
                Ações
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="flex flex-col">
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        {/* Itens do menu aqui */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];
