import api from "@/lib/api"

export const authService = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const token = response.data.token
        localStorage.setItem('token', token)
        return response.data;
    } catch (error: any) {
        console.log(error)
        const errorMessage = error.response?.data?.message || 'Erro desconhecido ao tentar fazer login';
        throw new Error(errorMessage);
    }
};

export const logout = async () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
}