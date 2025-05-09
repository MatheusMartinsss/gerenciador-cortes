import api from "@/lib/api";

interface ICreateDraftBody {
    formType: string;
    formData: Record<string, any>
    formHash: string;
    formVersion: number
}

export const createDraft = async ({ formType, formData, formHash, formVersion }: ICreateDraftBody) => {
    try {
        const response = await api.post('/draft', {
            formType,
            formData,
            formVersion,
            formHash
        })
        return response.data
    } catch (ex) {
        throw ex
    }
}

export const getDraft = async (formType: string) => {
    try {
        const response = await api.get('/draft', {
            params: {
                formType
            }
        })
        return response.data
    } catch (ex) {
        throw ex
    }
}

export const deleteDraft = async (formType: string) => {
    try {
        const response = await api.delete('/draft', {
            params: {
                formType
            }
        })
        return response.data
    } catch (ex) {
        throw ex
    }
}


