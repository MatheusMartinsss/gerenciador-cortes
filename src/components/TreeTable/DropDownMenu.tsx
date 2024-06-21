import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Ellipsis
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,

} from "@/components/ui/dropdown-menu"

export function DropdownMenuOptions() {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost"><Ellipsis /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Detalhes</DropdownMenuItem>
                <DropdownMenuItem>Remover</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}