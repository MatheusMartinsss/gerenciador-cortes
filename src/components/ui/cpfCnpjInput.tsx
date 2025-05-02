import { forwardRef, useMemo } from "react"
import { Input } from "@/components/ui/input" // substitua conforme seu design system
import { InputHTMLAttributes } from "react"

type CpfCnpjInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string
  onChange: (value: string) => void
}

const formatCpfCnpj = (value: string) => {
  if (typeof value !== "string") return ""
  const digits = value.replace(/\D/g, "")

  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})?/, "$1.$2.$3-$4")
  } else {
    // CNPJ: 00.000.000/0000-00
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})?/, "$1.$2.$3/$4-$5")
  }
}

export const CpfCnpjInput = forwardRef<HTMLInputElement, CpfCnpjInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatted = useMemo(() => formatCpfCnpj(value), [value])

    return (
      <Input
        {...props}
        ref={ref}
        value={formatted}
        maxLength={18}
        onChange={(e) => {
          const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 14)
          onChange(onlyDigits)
        }}
        placeholder="CPF ou CNPJ"
      />
    )
  }
)

CpfCnpjInput.displayName = "CpfCnpjInput"