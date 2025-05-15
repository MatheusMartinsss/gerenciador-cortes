import { BatchSchema } from "@/components/forms/SectionsForm";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseSaveBatchOptions {
    onSuccessCallback?: (data: any) => void;

}

export function useSaveBatch({ onSuccessCallback }: UseSaveBatchOptions) {
    return useMutation({
        mutationFn: async (body: BatchSchema) => {
            const response = await api.post('/batch', body)
            return response.data
        },
        onSuccess: (data) => {
            toast({ description: 'Corte salvo com sucesso!' });
            onSuccessCallback?.(data)
        },
        onError: (error) => {
            console.error('Erro ao salvar rascunho:', error);
            toast({ description: 'erro', variant: 'destructive' });
        },
    });
}
export function useSaveBatchAsDraft({ onSuccessCallback }: UseSaveBatchOptions) {
    return useMutation({
        mutationFn: async (body: BatchSchema) => {
            const response = await api.post('/batch/draft', body)
            console.log(response)
            return response.data
        },
        onSuccess: (data) => {
            toast({ description: 'Rascunho salvo com sucesso!' });
            onSuccessCallback?.(data)
        },
        onError: (error) => {
            console.error('Erro ao salvar rascunho:', error);
            toast({ description: 'erro', variant: 'destructive' });
        },
    });
}

export function useGetBatch(batchId: string) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/batch/${batchId}`)
            return response.data
        }
    })
}


export function useGetBatchWithSections(batchId: string) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/batch/${batchId}/sections`)
            return response.data
        }
    })
}