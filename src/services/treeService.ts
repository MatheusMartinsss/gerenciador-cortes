import { ITree } from "@/domain/tree";
import api from "@/lib/api";

interface FindAllTreesFilter {
    page?: number;
    limit?: number;
    orderBy?: string; // Adicionado opcionalmente
    noPagination?: boolean;
    order?: 'ASC' | 'DESC';
    number?: number;
    commonName?: string;
    specie_id?: string;
    createdAt?: Date;
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
        let query: FindAllTreesFilter = {}
        if (filters.commonName) {
            query.commonName = filters.commonName
        }
        if (filters.page) {
            query.page = filters.page
        }
        if (filters.orderBy) {
            query.orderBy = filters.orderBy
        }
        if (filters.noPagination) {
            query.noPagination = filters.noPagination
        }
        if (filters.order) {
            query.order = filters.order
        }
        if (filters.number) {
            query.number = filters.number
        }
        if (filters.specie_id) {
            query.specie_id = filters.specie_id
        }
        if (filters.createdAt) {
            query.createdAt = filters.createdAt
        }
        const response = await api.get('/tree', {
            params: query
        });

        return response.data
    } catch (error) {
        // Adiciona um tratamento de erro mais informativo
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};