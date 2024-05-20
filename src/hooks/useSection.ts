
import { create } from 'zustand'
import { ISection } from '@/domain/section'

type sortOrder = "asc" | 'desc'

interface TreeParams {
    page: number;
    sortOrder: sortOrder
    searchParam: string
    orderBy: string
}

interface SectionProps {
    section: ISection | null
    sections: ISection[]
    selectedSections: ISection[]
    params: TreeParams
    updateSections: (newState: ISection) => void
    setSection: (Section: ISection | null) => void
    setSections: (data: ISection[]) => void
    removeSection: (id: string) => void
    addSection: (data: ISection) => void
    addSelectedSection: (data: ISection) => void
    removeSelectedSection: (id: string) => void
    clearSelectedSections: () => void
    handleSort: () => void
    handlePage: (page: number) => void
    handleSearchParam: (param: string) => void
    handleOrderBy: (param: string) => void
}
export const useSection = create<SectionProps>((set) => ({
    section: null,
    selectedSections: [],
    params: { orderBy: '', page: 1, searchParam: '', sortOrder: 'asc' },
    sections: [],
    handleSort: () => set((state) => ({ params: { ...state.params, sortOrder: state.params.sortOrder === 'asc' ? 'desc' : 'asc' } })),
    handlePage: (page) => set((state) => ({ params: { ...state.params, page } })),
    handleSearchParam: (param) => set((state) => ({ params: { ...state.params, searchParam: param } })),
    handleOrderBy: (param: string) => set((state) => ({ params: { ...state.params, orderBy: param } })),
    updateSections: (newState) => set((state) => ({
        sections: state.sections.map((prevSection) => {
            if (prevSection.id == newState.id) {
                return newState
            }
            return prevSection
        })
    })),
    addSection: (section) => set((prevState) => ({ sections: [...prevState.sections, section] })),
    removeSection: (id) => set((prevState) => ({
        sections: prevState.sections.filter((newState) => newState.id !== id)
    })),
    setSection: (section) => set({ section }),
    setSections: (data) => set({ sections: data }),
    addSelectedSection: (data) => set((prevState) => ({
        selectedSections: [...prevState.selectedSections, data]
    })),
    removeSelectedSection: (id) => set((prevState) => ({
        selectedSections: prevState.selectedSections.filter((newState) => newState.id !== id)
    })),
    clearSelectedSections: () => set({ selectedSections: [] })
}))