import { IBatch } from "@/domain/batch";
import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";

interface FindAllBatchFilter {
    page?: number;
    limit?: number;
    orderBy?: string; // Adicionado opcionalmente
    noPagination?: boolean;
    order?: 'ASC' | 'DESC' | '';
    number?: number;
    createdAt?: Date;
    filterBy?: string
    searchTerm?: string | number
}

export interface FindAllBatchResponse {
    data: IBatch[] | []
    totalItems: number;
    totalPages: number;
    currentPage: number;
    volume: number
}

export const findAllBatch = async (filters: FindAllBatchFilter): Promise<FindAllBatchResponse> => {
    try {
        const response = await api.get('/batch', {
            params: removeNulls(filters)
        });
        return response.data
    } catch (error) {
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};