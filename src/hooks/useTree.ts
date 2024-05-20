
import { ITree } from '@/domain/tree'
import { create } from 'zustand'


type sortOrder = "asc" | 'desc'

interface TreeParams {
    page: number;
    sortOrder: sortOrder
    searchParam: string
    orderBy: string
}

interface TreeProps {
    tree: ITree | null
    trees: ITree[]
    selectedTrees: ITree[]
    params: TreeParams
    updateTrees: (newState: ITree) => void
    setTree: (tree: ITree | null) => void
    setTrees: (data: ITree[]) => void
    removeTree: (id: string) => void
    addTree: (data: ITree) => void
    addSelectedTree: (data: ITree) => void
    removeSelectedTree: (id: string) => void
    clearSelectedTrees: () => void
    handleSort: () => void
    handlePage: (page: number) => void
    handleSearchParam: (param: string) => void
    handleOrderBy: (param: string) => void
}
export const useTree = create<TreeProps>((set) => ({
    tree: null,
    params: { orderBy: '', page: 1, searchParam: '', sortOrder: 'asc' },
    selectedTrees: [],
    trees: [],
    handleSort: () => set((state) => ({ params: { ...state.params, sortOrder: state.params.sortOrder === 'asc' ? 'desc' : 'asc' } })),
    handlePage: (page) => set((state) => ({ params: { ...state.params, page } })),
    handleSearchParam: (param) => set((state) => ({ params: { ...state.params, searchParam: param } })),
    handleOrderBy: (param: string) => set((state) => ({ params: { ...state.params, orderBy: param } })),
    updateTrees: (newState) => set((state) => ({
        trees: state.trees.map((prevTree) => {
            if (prevTree.id == newState.id) {
                return newState
            }
            return prevTree
        })
    })),
    addTree: (tree) => set((prevState) => ({ trees: [...prevState.trees, tree] })),
    removeTree: (id) => set((prevState) => ({
        trees: prevState.trees.filter((newState) => newState.id !== id)
    })),
    setTree: (tree) => set({ tree }),
    setTrees: (data) => set({ trees: data }),
    addSelectedTree: (data) => set((prevState) => ({
        selectedTrees: [...prevState.selectedTrees, data]
    })),
    removeSelectedTree: (id) => set((prevState) => ({
        selectedTrees: prevState.selectedTrees.filter((newState) => newState.id !== id)
    })),
    clearSelectedTrees: () => set({ selectedTrees: [] })
}))