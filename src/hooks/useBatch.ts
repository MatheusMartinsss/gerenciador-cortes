import { BatchSchema } from "@/components/forms/SectionsForm";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
export function useDeleteBatch({ onSuccessCallback, batchId }: {
    onSuccessCallback?: (data: any) => void,
    batchId: string
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/batch/${batchId}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast({ description: 'Corte deletado com sucesso!' });
            queryClient.invalidateQueries({ queryKey: ['batchs'] });
            onSuccessCallback?.(data)
        },
        onError: (error: any) => {
            toast({ description: error?.data?.message ?? 'erro ao deleetar', variant: 'destructive' });
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

export function useGetBatch(batchId: string, isEnabled?: boolean) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/batch/${batchId}`)
            return response.data
        },
        enabled: isEnabled !== undefined ? isEnabled : true,
    })
}


export function useGetBatchWithSections(batchId: string, isEnabled?: boolean) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/batch/${batchId}/sections`)
            return response.data
        },
        refetchOnWindowFocus: false,
        enabled: isEnabled !== undefined ? isEnabled : true,

    })
}

export function useGetBatchWithSectionsGroupedByTree(batchId: string, isEnabled?: boolean) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/batch/${batchId}/sections-by-tree`)
            return response.data
        },
        refetchOnWindowFocus: false,
        enabled: isEnabled !== undefined ? isEnabled : true,

    })
}