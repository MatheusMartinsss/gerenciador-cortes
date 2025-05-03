"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DecimalInput } from "../ui/decimalinput"
import { CpfCnpjInput } from "../ui/cpfCnpjInput"
import { createAutex } from "@/services/autexService"
import { useToast } from "../ui/use-toast"

const schema = z.object({
    numero_autorizacao: z.string().min(1, "Obrigatório"),
    detentor_autorizacao: z.string().min(1, "Obrigatório"),
    cpf_cnpj: z.string().min(11, "Obrigatório"),
    validade_inicial: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
    validade_final: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
    volumeM3_total: z.number().positive()
})

type AutexFormValues = z.infer<typeof schema>

const AutexForm = () => {
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<AutexFormValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: AutexFormValues) => {
        try {
            const response = await createAutex(data)
            if (response) {
                toast({
                    title: 'Autex cadastrada!',
                    variant: 'default',
                })
            }
            reset()
        } catch (error) {
            toast({
                title: 'Autex não cadastrada!',
                description: 'Ocorreu um erro durante o salvamento, tente novamente.',
                variant: 'destructive'
            })
        }

    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-md shadow w-full">
            <div className="space-y-2">
                <Label htmlFor="numero">Número da Autorização</Label>
                <Input id="numero" {...register("numero_autorizacao")} placeholder="12345" />
                {errors.numero_autorizacao && <span className="text-sm text-red-500">{errors.numero_autorizacao.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="detentor">Detentor da Autorização</Label>
                <Input id="detentor" {...register("detentor_autorizacao")} placeholder="Nome do detentor" />
                {errors.detentor_autorizacao && <span className="text-sm text-red-500">{errors.detentor_autorizacao.message}</span>}
            </div>

            <div className="space-y-2 col-span-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ do Detentor</Label>
                <Controller
                    control={control}
                    name="cpf_cnpj"
                    render={({ field }) => (
                        <CpfCnpjInput
                            {...field}
                        />
                    )}
                />
                {errors.cpf_cnpj && <span className="text-sm text-red-500">{errors.cpf_cnpj.message}</span>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="validadeInicial">Validade Inicial</Label>
                <Input type="date" id="validadeInicial" {...register("validade_inicial")} />
                {errors.validade_inicial && <span className="text-sm text-red-500">{errors.validade_inicial.message}</span>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="validadeFinal">Validade Final</Label>
                <Input type="date" id="validadeFinal" {...register("validade_final")} />
                {errors.validade_final && <span className="text-sm text-red-500">{errors.validade_final.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="volumeM3_Total">Volume Total (m³)</Label>
                <Controller
                    control={control}
                    name="volumeM3_total"
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
                {errors.volumeM3_total && <span className="text-sm text-red-500">{errors.volumeM3_total.message}</span>}
            </div>

            <div className="md:col-span-2">
                <Button type="submit">Cadastrar Autex</Button>
            </div>
        </form>
    )
}

export default AutexForm