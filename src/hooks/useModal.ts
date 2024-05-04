import { create } from 'zustand'

interface ModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void;
    form: string
    setForm: (data: any) => void
}

export const useModal = create<ModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set(() => ({ isOpen: false, form: '' })),
    form: '',
    setForm: (form) => set({ form: form, isOpen: true }),
}))