import { Input } from "@/components/ui/input"
import { InputHTMLAttributes, forwardRef } from "react"

type DecimalInputProps = {
    value: number
    onChange: (value: number) => void
    dividirPor?: number
    fractionDigits?: number
    suffix?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">


const parseDecimalFromMasked = (value: string, divisor: number, fractionDigits: number): number => {
    const raw = value
    const cleaned = raw.replace(/[\.\s\D]+/g, "").replace(/^0+/, "")
    const parsed = parseInt(cleaned || "0", 10)
    return parsed / divisor
}

const formatDecimalToPtBR = (value: number, digits: number): string => {
    if (typeof value !== "number" || isNaN(value)) return ""

    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    })

}

export const DecimalInput = forwardRef<HTMLInputElement, DecimalInputProps>(
    ({ value, onChange, dividirPor = 1, fractionDigits = 2, suffix, ...props }, ref) => {
        return (
            <div className="relative">
                <Input
                    ref={ref}
                    {...props}
                    value={formatDecimalToPtBR(value, fractionDigits)}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && value !== 0) {
                            onChange(0)
                            e.preventDefault()
                        }
                    }}
                    onChange={(e) => onChange(parseDecimalFromMasked(e.target.value, dividirPor, fractionDigits))}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        )
    }
)

DecimalInput.displayName = "DecimalInput"