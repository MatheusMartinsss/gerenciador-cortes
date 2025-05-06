"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Specie = {
    id: string;
    scientificName: string;
    commonName: string;
};

type Props = {
    value?: string;
    onSelect: (specie: Specie) => void;
    onSearch: (term: string) => void;
    options: Specie[];
    loading?: boolean;
    renderValue?: (specie?: Specie) => React.ReactNode;
};

export function SpecieComboBox({ value, onSelect, onSearch, options, loading, renderValue }: Props) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const selectedSpecie = options.find((s) => s.id === value);

    // Debounced search
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(inputValue);
        }, 300);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={loading}
                >
                    {renderValue
                        ? renderValue(selectedSpecie)
                        : selectedSpecie
                            ? `${selectedSpecie.scientificName} - ${selectedSpecie.commonName}`
                            : loading
                                ? "Carregando..."
                                : "Selecione uma espécie"}
                    {selectedSpecie ? (
                        <X
                            className="ml-2 h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(undefined as any);
                            }}
                        />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar espécie..."
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                        {loading && <div className="p-2 text-sm">Carregando...</div>}
                        {!loading && options.length === 0 && (
                            <CommandEmpty>Nenhuma espécie encontrada.</CommandEmpty>
                        )}
                        <CommandGroup>
                            <CommandItem
                                value="__none__"
                                onSelect={() => {
                                    onSelect(undefined as any); // ou `null` se preferir
                                    setOpen(false);
                                }}
                            >
                                Limpar seleção
                                <Check className={cn("ml-auto h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                            {options.map((specie) => (
                                <CommandItem
                                    key={specie.id}
                                    value={specie.scientificName}
                                    onSelect={() => {
                                        onSelect(specie);
                                        setOpen(false);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onSelect(specie);
                                        setOpen(false);
                                    }}
                                >
                                    {specie.scientificName} - {specie.commonName}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === specie.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}