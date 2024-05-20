
import { create } from 'zustand'
import { ICreateSpecie, ISpecie } from '@/domain/specie';
type sortOrder = "asc" | 'desc'

interface SpecieParams {
    page: number;
    sortOrder: sortOrder
    searchParam: string
    orderBy: string
}

interface SpecieProps {
    specie: ISpecie | null
    species: ISpecie[]
    selectedSpecies: ISpecie[]
    params: SpecieParams
    updateSpecies: (newState: ISpecie) => void
    setSpecie: (specie: ISpecie | null) => void
    setSpecies: (data: ISpecie[]) => void
    removeSpecie: (id: string) => void
    addSpecie: (data: ISpecie) => void
    addSelectedSpecie: (data: ISpecie) => void
    removeSelectedSpecie: (id: string) => void
    clearSelectedSpecies: () => void
    handleSort: () => void
    handlePage: (page: number) => void
    handleSearchParam: (param: string) => void
    handleOrderBy: (param: string) => void
}
export const usespecie = create<SpecieProps>((set) => ({
    specie: null,
    selectedSpecies: [],
    params: { orderBy: '', page: 1, searchParam: '', sortOrder: 'asc' },
    species: [],
    handleSort: () => set((state) => ({ params: { ...state.params, sortOrder: state.params.sortOrder === 'asc' ? 'desc' : 'asc' } })),
    handlePage: (page) => set((state) => ({ params: { ...state.params, page } })),
    handleSearchParam: (param) => set((state) => ({ params: { ...state.params, searchParam: param } })),
    handleOrderBy: (param: string) => set((state) => ({ params: { ...state.params, orderBy: param } })),
    updateSpecies: (newState) => set((state) => ({
        species: state.species.map((prevSpecie) => {
            if (prevSpecie.id == newState.id) {
                return newState
            }
            return prevSpecie
        })
    })),
    addSpecie: (specie) => set((prevState) => ({ species: [...prevState.species, specie] })),
    removeSpecie: (id) => set((prevState) => ({
        species: prevState.species.filter((newState) => newState.id !== id)
    })),
    setSpecie: (specie) => set({ specie }),
    setSpecies: (data) => set({ species: data }),
    addSelectedSpecie: (data) => set((prevState) => ({
        selectedSpecies: [...prevState.selectedSpecies, data]
    })),
    removeSelectedSpecie: (id) => set((prevState) => ({
        selectedSpecies: prevState.selectedSpecies.filter((newState) => newState.id !== id)
    })),
    clearSelectedSpecies: () => set({ selectedSpecies: [] })
}))