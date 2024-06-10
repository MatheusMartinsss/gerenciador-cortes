import { create } from 'zustand'

interface FormDataProps {
    form: any
    setForm: (data: any) => void
}

export const useFormData = create<FormDataProps>((set) => ({
    form: {},
    setForm: (form: any) => set({ form: form }),
}))