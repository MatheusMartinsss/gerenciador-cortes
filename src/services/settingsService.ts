import api from "@/lib/api"


export const ImportSectionsService = async (file: File) => {

    const formData = new FormData();
    formData.append('file', file)
    try {
        const response = await api.post('/settings/import/sections', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {

    }

}