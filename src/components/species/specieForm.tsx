import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import api from '@/lib/api'
import { useToast } from '../ui/use-toast'
import { useModal } from '@/hooks/useModal'
import { usespecie } from '@/hooks/useSpecie'

const formSchema = z.object({
    id: z.string().nullable(),
    commonName: z.string().min(2),
    scientificName: z.string().min(2),
})

export const SpecieForm = () => {
    const { specie, updateSpecies, setSpecie, addSpecie } = usespecie()
    console.log(specie)
    const { onClose } = useModal()
    const { toast } = useToast()
    const editMode = !!specie;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: specie?.id || null,
            commonName: specie?.commonName || '',
            scientificName: specie?.scientificName || '',
          
        }
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (editMode) {
                const { data } = await api.put('/specie', values)
                if (data) {
                    updateSpecies(data)
                    toast({
                        description: `Arvore n° ${data.number} atualizada com sucesso!`,
                        variant: 'default'
                    })
                    setSpecie(null)
                    onClose()
                }
            } else {
                const { data } = await api.post('/specie', values)
                toast({
                    description: `Arvore n° ${data.number} criada com sucesso!`,
                    variant: 'default'
                })
                console.log(data)
                addSpecie(data)
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-[600px]'>
    
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
    
                    <Button type='submit'>Salvar</Button>
                </form>
            </Form>
        </div>
    )
}

