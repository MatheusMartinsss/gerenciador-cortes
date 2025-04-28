import { IBatch } from "@/domain/batch";
import { ICompany } from "@/domain/company";
import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";

interface FindAllCompanyFilter {
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

export interface FindAllCompanyResponse {
    data: ICompany[] | []
    totalItems: number;
    totalPages: number;
    currentPage: number;
    volume: number
}

export const findAllCompanys = async (filters: FindAllCompanyFilter): Promise<FindAllCompanyResponse> => {
    try {
        const response = await api.get('/company', {
            params: removeNulls(filters)
        });
        console.log(response)
        return response.data
    } catch (error) {
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};