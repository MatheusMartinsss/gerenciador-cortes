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
import { ColumnHeader } from "@/components/ui/columHeader";

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
                <ColumnHeader isSorted={isSorted} label="Autorizacao" toggleSorting={column.toggleSorting} align="left" />
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
                <ColumnHeader isSorted={isSorted} label="Detentor" toggleSorting={column.toggleSorting} align="left" />

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
                <ColumnHeader isSorted={isSorted} label="Vol. Total M3" toggleSorting={column.toggleSorting} align="center" />

            );
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{formatVolumeM3(row.getValue("volumeM3_total"))}</div>
        ),
    }, {
        accessorKey: "volumeM3_explorado",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <ColumnHeader isSorted={isSorted} label="Vol. Total M3" toggleSorting={column.toggleSorting} align="center" />
            );
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{formatVolumeM3(row.getValue("volumeM3_explorado"))}</div>
        ),
    },
    {
        accessorKey: "validade_inicial",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <ColumnHeader isSorted={isSorted} label="Validade Inicial" toggleSorting={column.toggleSorting} align="center" />

            );
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{dateMask(row.getValue("validade_inicial"))}</div>
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
