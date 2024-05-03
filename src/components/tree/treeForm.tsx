import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import api from '@/lib/api'
import { useTree } from '@/hooks/useTree'

const formSchema = z.object({
    id: z.string().nullable(),
    commonName: z.string().min(2),
    scientificName: z.string().min(2),
    number: z.coerce.number(),
    range: z.coerce.number(),
    dap: z.coerce.number(),
    meters: z.coerce.number(),
    volumeM3: z.coerce.number(),
})

export const TreeForm = () => {
    const { tree } = useTree()
    const editMode = tree !== null && typeof tree === 'object';
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: tree.id || '',
            number: tree?.number || 0,
            commonName: tree?.commonName || '',
            scientificName: tree?.scientificName || '',
            dap: tree.dap || 0,
            meters: tree.meters || 0,
            range: tree.range || 0,
            volumeM3: tree.volumeM3 || 0
        }
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (editMode) {
                const { data } = await api.put('/tree', values)
                console.log(data)
            } else {
                const { data } = await api.post('/tree', values)
                console.log(data)
            }
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

