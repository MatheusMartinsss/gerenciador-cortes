import { ITree } from "@/domain/tree";
import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";

interface FindAllTreesFilter {
    page?: number;
    limit?: number;
    orderBy?: string; // Adicionado opcionalmente
    noPagination?: boolean;
    order?: 'ASC' | 'DESC' | '';
    number?: number;
    commonName?: string;
    specie_id?: string;
    createdAt?: Date;
    filterBy?: string
    searchTerm?: string | number | null
}

export interface FindAllTreesResponse {
    data: ITree[] | []
    totalItems: number;
    totalPages: number;
    currentPage: number;
    volume: number
}

export const findAllTrees = async (filters: FindAllTreesFilter): Promise<FindAllTreesResponse> => {
    try {
        const response = await api.get('/tree', {
            params: removeNulls(filters)
        });
        return response.data
    } catch (error) {
        // Adiciona um tratamento de erro mais informativo
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};