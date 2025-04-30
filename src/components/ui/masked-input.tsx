"use client"
import React from "react"
import InputMask from "react-input-mask"
import { Input } from "./input"

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string
    alwaysMasked?: boolean
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
    ({ mask, alwaysMasked = false, onChange, ...props }, ref) => {
        return (
            <InputMask
                mask={mask}
                alwaysShowMask={false}
                {...props}
                onChange={(e) => {
                    // Remove a máscara para salvar limpo (exceto se sempre mascarado)
                    const unmaskedValue = e.target.value.replace(/\D/g, "")
                    if (onChange) {
                        const event = {
                            ...e,
                            target: {
                                ...e.target,
                                value: alwaysMasked ? e.target.value : unmaskedValue,
                            },
                        }
                        onChange(event as React.ChangeEvent<HTMLInputElement>)
                    }
                }}
            >
                {(inputProps: any) => <Input ref={ref} {...inputProps} />}
            </InputMask>
        )
    }
)

MaskedInput.displayName = "MaskedInput"