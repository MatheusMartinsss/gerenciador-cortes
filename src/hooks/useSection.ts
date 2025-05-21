
import { create } from 'zustand'
import { ISection } from '@/domain/section'
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useGetSections<TFormData = Record<string, any>>(formType: string) {
    return useQuery<TFormData | null>({
        queryKey: ['draft', formType],
        queryFn: async () => {
            const response = await api.get('/draft', {
                params: { formType },
            });
            return response.data.form_data ?? []; // acessa diretamente o conteúdo salvo
        },

    });
}

export function useGetSectionsByBatchId(batchId: string, isEnabled?: boolean) {
    return useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const response = await api.get(`/section/batches/${batchId}/sections`)
            return response.data
        },
        refetchOnWindowFocus: false,
        enabled: isEnabled !== undefined ? isEnabled : true,

    })
}