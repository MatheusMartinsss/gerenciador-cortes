import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import api from '@/lib/api'

const formSchema = z.object({
    commonName: z.string().min(2),
    scientificName: z.string().min(2),
    number: z.coerce.number(),
    range: z.coerce.number(),
    dap: z.coerce.number(),
    meters: z.coerce.number(),
    volumeM3: z.coerce.number(),
})

export const TreeForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            number: 0,
            commonName: '',
            scientificName: '',
            dap: 0,
            meters: 0,
            range: 0,
            volumeM3: 0
        }
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { data } = await api.post('/tree', values)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='number'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>N° Arvore</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name='scientificName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Cientifico</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name='commonName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Popular</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name='dap'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DAP</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name='meters'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Altura</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name='volumeM3'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>M3</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <Button type='submit'>Salvar</Button>
                </form>
            </Form>
        </div>
    )
}

