import api from "@/lib/api"



export const authService = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erro desconhecido ao tentar fazer login';
        throw new Error(errorMessage);
    }
};