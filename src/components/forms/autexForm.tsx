"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { maskToM3, formatM3WithSuffix, formatVolumeM3 } from "@/lib/masks"
import { DecimalInput } from "../ui/decimalinput"

const schema = z.object({
    numero: z.string().min(1, "Obrigatório"),
    detentor: z.string().min(1, "Obrigatório"),
    cpfCnpj: z.string().min(11, "Obrigatório"),
    volumeExplorado: z.number().nonnegative(),
    volumeTotal: z.number().positive()
})

type AutexFormValues = z.infer<typeof schema>

const AutexForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm<AutexFormValues>({
        resolver: zodResolver(schema)
    })

    const volumeTotal = watch("volumeTotal")
    console.log(volumeTotal)
    const onSubmit = (data: AutexFormValues) => {
        console.log("Autex cadastrada:", data)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-md shadow w-full">
            <div className="space-y-2">
                <Label htmlFor="numero">Número da Autorização</Label>
                <Input id="numero" {...register("numero")} placeholder="12345" />
                {errors.numero && <span className="text-sm text-red-500">{errors.numero.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="detentor">Detentor da Autorização</Label>
                <Input id="detentor" {...register("detentor")} placeholder="Nome do detentor" />
                {errors.detentor && <span className="text-sm text-red-500">{errors.detentor.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ do Detentor</Label>
                <Input id="cpfCnpj" {...register("cpfCnpj")} placeholder="000.000.000-00" />
                {errors.cpfCnpj && <span className="text-sm text-red-500">{errors.cpfCnpj.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="volumeExplorado">Volume Explorado (m³)</Label>
                <Input type="number" step="0.01" id="volumeExplorado" {...register("volumeExplorado", { valueAsNumber: true })} placeholder="0.00" />
                {errors.volumeExplorado && <span className="text-sm text-red-500">{errors.volumeExplorado.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="volumeTotal">Volume Total (m³)</Label>
                <Controller
                    control={control}
                    name="volumeTotal"
                    render={({ field }) => (
                        <DecimalInput
                            {...field}
                            dividirPor={1000}
                            fractionDigits={3}
                            suffix="m³"
                            placeholder="0,000"
                        />
                    )}
                />
                {errors.volumeTotal && <span className="text-sm text-red-500">{errors.volumeTotal.message}</span>}
            </div>

            <div className="md:col-span-2">
                <Button type="submit">Cadastrar Autex</Button>
            </div>
        </form>
    )
}

export default AutexForm