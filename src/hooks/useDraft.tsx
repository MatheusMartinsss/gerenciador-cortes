import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { createDraft } from '@/services/draftService';

interface UseSaveDraftOptions {
    formType: string;
    onSuccessCallback?: () => void;
    successMessage?: string;
    errorMessage?: string;
    formHash?: string;
    formVersion?: number
}

export function useSaveDraft<TFormData extends Record<string, any> = Record<string, any>>({
    formType,
    formHash = "",
    formVersion = 1,
    onSuccessCallback,
    successMessage = 'Rascunho salvo com sucesso!',
    errorMessage = 'Erro ao salvar rascunho',
}: UseSaveDraftOptions) {
    return useMutation({
        mutationFn: async (formData: TFormData) => await createDraft({formType: formType, formData, formHash, formVersion }),
        onSuccess: () => {
            toast({ description: successMessage });
            onSuccessCallback?.();
        },
        onError: (error) => {
            console.error('Erro ao salvar rascunho:', error);
            toast({ description: errorMessage, variant: 'destructive' });
        },
    });
}

export function useGetDraft<TFormData = Record<string, any>>(formType: string) {
    return useQuery<TFormData | null>({
        queryKey: ['draft', formType],
        queryFn: async () => {
            const response = await api.get('/draft', {
                params: { formType },
            });
            return response.data.form_data ?? {}; // acessa diretamente o conteúdo salvo
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
