import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
} from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import {
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useState } from "react"
import { Input } from "./input"

export function SearchTree() {
    const [isOpen, setOpen] = useState(false)
    return (
        <div className="">
            <div className="flex items-center w-full">
                <Input />
            </div>

            <ul className="w-[300px] rounded-md mt-1 bg-slate-200 scroll-smooth absolute max-h-[260px] overflow-x-hidden overflow-y-auto">
                <li
                    className="flex items-center h-[40px] p-1 hover:bg-slate-300"
                >
                    <div className="flex items-center space-x-1">
                        <div>Teste</div>
                    </div>
                </li>
            </ul>

        </div>
    )
}