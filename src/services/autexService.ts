import api from "@/lib/api";

export const createAutex = async (body: any) => {
    try {
        const response = await api.post('/autex', body)
        return response.data
    } catch (ex) {
        console.log(ex)
        throw ex
    }
}