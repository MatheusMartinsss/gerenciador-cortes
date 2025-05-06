
import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";


export const findAllSpecie = async (filters: any) => {
    try {
        const response = await api.get('/specie', {
            params: removeNulls(filters)
        });
        return response.data
    } catch (error) {
        // Adiciona um tratamento de erro mais informativo
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};