import { ArrowDown, ArrowUp } from "lucide-react";

interface ColumnHeaderProps {
    isSorted: string | boolean;
    toggleSorting: (isSorted: boolean) => void;
    label: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    icons?: {
        asc?: React.ReactNode;
        desc?: React.ReactNode;
    };
}

export const ColumnHeader = ({
    isSorted,
    toggleSorting,
    label,
    align = 'center',
    className,
    icons
}: ColumnHeaderProps) => {
    const alignment = {
        left: 'justify-start text-left',
        center: 'justify-center text-center',
        right: 'justify-end text-right',
    }[align];

    return (
        <div
            onClick={() => toggleSorting(isSorted === "asc")}
            className={`relative cursor-pointer select-none flex items-center ${alignment} ${className ?? ''}`}
            role="columnheader"
            aria-sort={
                isSorted === "asc"
                    ? "ascending"
                    : isSorted === "desc"
                        ? "descending"
                        : "none"
            }
        >
            {label}
            {isSorted && (
                <span className="absolute right-0 pr-2">
                    {isSorted === "asc"
                        ? icons?.asc ?? <ArrowUp className="h-4 w-4" />
                        : icons?.desc ?? <ArrowDown className="h-4 w-4" />}
                </span>
            )}
        </div>
    );
};
