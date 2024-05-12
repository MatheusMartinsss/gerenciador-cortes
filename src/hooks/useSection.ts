
import { create } from 'zustand'
import { ISection } from '@/domain/section'
interface SectionProps {
    section: ISection | null
    sections: ISection[]
    selectedSections: ISection[]
    updateSections: (newState: ISection) => void
    setSection: (Section: ISection | null) => void
    setSections: (data: ISection[]) => void
    removeSection: (id: string) => void
    addSection: (data: ISection) => void
    addSelectedSection: (data: ISection) => void
    removeSelectedSection: (id: string) => void
    clearSelectedSections: () => void
}
export const useSection = create<SectionProps>((set) => ({
    section: null,
    selectedSections: [],
    sections: [],
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