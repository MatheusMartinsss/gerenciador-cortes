import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderOverlayProps {
    className?: string
    message?: string
}

export const LoaderOverlay = ({ className, message = "Carregando..." }: LoaderOverlayProps) => {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center",
                className
            )}
        >
            <div className="flex flex-col items-center gap-2 text-white animate-fade-in">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">{message}</span>
            </div>
        </div>
    )
}