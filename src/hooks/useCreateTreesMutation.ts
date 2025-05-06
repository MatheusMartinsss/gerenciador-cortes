import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api' // ou onde estiver sua instância do axios
import { toast } from '@/components/ui/use-toast'
import { FormFieldValues } from '@/components/forms/TreesForm/FormFieldValues'
export function useCreateTrees(onSuccessCallback?: () => void) {
    return useMutation({
        mutationFn: async (data: FormFieldValues) => {
            const response = await api.post('/tree/bulk', data)
            return response.data
        },
        onSuccess: (data) => {
            toast({
                description: 'Árvores cadastradas com sucesso!',
            })
            if (onSuccessCallback) onSuccessCallback()
        },
        onError: (error: any) => {
            toast({
                description: 'Erro ao cadastrar árvores',
                variant: 'destructive',
            })
        },
    })
}