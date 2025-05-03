import api from "@/lib/api";
import { removeNulls } from "@/lib/removeEmptyParams";

export const createAutex = async (body: any) => {
    try {
        const response = await api.post('/autex', body)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw ex
    }
}

export const findAllAutex = async (filters: any) => {
    try {
        const response = await api.get('/autex', {
            params: removeNulls(filters)
        });
        return response.data
    } catch (error) {
        console.error('Failed to fetch trees:', error);
        throw new Error('Failed to fetch trees');
    }
};