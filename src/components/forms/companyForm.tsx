'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MaskedInput } from "@/components/ui/masked-input"
import { useEffect, useState } from "react"
import { useCepLookup } from "@/hooks/useCepLookup"
import { toast } from "../ui/use-toast"
import { useCnpjLookup } from "@/hooks/useCnpjLookup"
import { LoaderOverlay } from "../ui/loader-overlay"

const formSchema = z.object({
    razaoSocial: z.string().min(1),
    nomePouplar: z.string().min(1),
    cnpj: z.string().min(14),
    inscricaoEstadual: z.string(),
    email: z.string().email().optional().or(z.literal("")),
    fone: z.string(),
    address: z.object({
        logradouro: z.string(),
        numero: z.string(),
        bairro: z.string(),
        cidade: z.string(),
        uf: z.string().length(2),
        cep: z.string().min(8),
        codigo_municipio: z.string()
    }),
    tenant: z.object({
        name: z.string(),
        slug: z.string(),
        customDomain: z.string().optional(),
        config: z.string().optional(),
    }),
    user: z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })
})

type FormValues = z.infer<typeof formSchema>

const CompanyForm = () => {
    const [cepToSearch, setCepToSearch] = useState("")
    const [cnpjToSearch, setCnpjToSearch] = useState("")
    const { data: cepData, isError: isErrorCepLookUp, isSuccess: isSuccessCepLookUp, isLoading: isCepLoading } = useCepLookup(cepToSearch, cepToSearch.length === 8)
    const { data: cnpjData, isError: isErrorCnpjLookUp, isSuccess: isSuccessCnpjLookUp, isLoading: isCnpjLoading } = useCnpjLookup(cnpjToSearch, cnpjToSearch.length === 14)
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            razaoSocial: "",
            nomePouplar: "",
            cnpj: "",
            inscricaoEstadual: "",
            email: "",
            fone: "",
            address: {
                logradouro: "",
                numero: "",
                bairro: "",
                cidade: "",
                uf: "",
                cep: "",
                codigo_municipio: ""
            },
            tenant: {
                name: "",
                slug: "",
                customDomain: "",
                config: "",
            },
            user: {
                firstname: "",
                lastname: "",
                email: "",
                password: "",
            }
        }
    })
    useEffect(() => {
        if (isSuccessCepLookUp && cepData) {
            console.log(cepData)
            form.setValue("address.logradouro", cepData.street || "")
            form.setValue("address.bairro", cepData.neighborhood || "")
            form.setValue("address.cidade", cepData.city || "")
            form.setValue("address.uf", cepData.state || "")
        }

        if (isErrorCepLookUp) {
            toast({
                variant: "destructive",
                title: "CEP inválido",
                description: "Não foi possível encontrar o endereço para o CEP informado.",
            })
        }
    }, [isSuccessCepLookUp, isErrorCepLookUp, cepData, form])

    useEffect(() => {
        if (isSuccessCnpjLookUp && cnpjData) {
            form.setValue('razaoSocial', cnpjData.razao_social || '')
            form.setValue('nomePouplar', cnpjData.nome_fantasia || '')
            form.setValue('email', cnpjData.email || '')
            form.setValue('fone', cnpjData.ddd_telefone_1 || '')
            form.setValue('address.cep', cnpjData.cep || '')
            form.setValue('address.logradouro', cnpjData.logradouro || '')
            form.setValue('address.cidade', cnpjData.municipio || '')
            form.setValue('address.numero', cnpjData.numero || '')
            form.setValue('address.bairro', cnpjData.bairro || '')
            form.setValue('address.codigo_municipio', String(cnpjData.codigo_municipio) || '')
            form.setValue('address.uf', cnpjData.uf || '')

        }

        if (isErrorCnpjLookUp) {
            toast({
                variant: "destructive",
                title: "CNPJ inválido",
                description: "Não foi possível encontrar o CNPJ informado.",
            })
        }
    }, [isSuccessCnpjLookUp, isErrorCnpjLookUp, cnpjData, form])
    useEffect(() => {
        console.log(form.formState.errors)
    }, [form.formState.errors])
    const onSubmit = (data: FormValues) => {
        console.log("Form data:", data)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-5xl mx-auto p-6"
            >
                {isCnpjLoading && <LoaderOverlay message="Consultando CNPJ..." />}
                {isCepLoading && <LoaderOverlay message="Buscando CEP..." />}
                {/* Dados da Empresa */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField name="cnpj" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>CNPJ</FormLabel>
                                <FormControl>
                                    <MaskedInput mask="99.999.999/9999-99" {...field} onBlur={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, "")
                                        if (onlyNumbers.length === 14) {
                                            setCnpjToSearch(onlyNumbers)
                                        }
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="razaoSocial" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel>Razão Social</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="nomePouplar" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Nome Popular</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="inscricaoEstadual" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Inscrição Estadual</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="fone" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <MaskedInput mask="(99) 9999-9999" {...field} alwaysMasked />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </section>

                {/* Endereço */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Endereço</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField name="address.cep" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                    <MaskedInput
                                        mask="99999-999"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="address.logradouro" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Logradouro</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="address.numero" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="address.bairro" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="address.cidade" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="address.uf" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>UF</FormLabel>
                                <FormControl><Input {...field} maxLength={2} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>
                </section>

                {/* Tenant */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Dados do Tenant</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["name", "slug", "customDomain", "config"].map((field) => (
                            <FormField
                                key={field}
                                name={`tenant.${field}` as any}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{field.name}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </section>

                {/* User */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Usuário Responsável</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField name="user.firstname" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="user.lastname" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="user.email" control={form.control} render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="user.password" control={form.control} render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Senha</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </section>

                <Button type="submit" className="mt-6">Salvar</Button>
            </form>
        </Form>
    )
}

export default CompanyForm