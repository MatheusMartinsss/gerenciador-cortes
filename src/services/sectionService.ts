
import { ISection } from "@/domain/section";
import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";

interface FindAllSectionsFilter {
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

export interface FindAllSectionsResponse {
    data: ISection[] | []
    totalItems: number;
    totalPages: number;
    currentPage: number;
    volume: number
}

export const findAllSections = async (filters: FindAllSectionsFilter): Promise<FindAllSectionsResponse> => {
    try {
        const response = await api.get('/section', {
            params: removeNulls(filters)
        });
        return response.data
    } catch (error) {
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};