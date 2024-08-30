
import { ITree } from '@/domain/tree'
import { create } from 'zustand'


type sortOrder = "ASC" | 'DESC'

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
    addSelectedTrees: (data: ITree[]) => void
    removeSelectedTree: (id: string) => void
    removeSelectedTrees: (id: string[]) => void
    clearSelectedTrees: () => void
    handleSort: () => void
    handlePage: (page: number) => void
    handleSearchParam: (param: string) => void
    handleOrderBy: (param: string) => void
}
export const useTree = create<TreeProps>((set) => ({
    tree: null,
    params: { orderBy: '', page: 1, searchParam: '', sortOrder: 'ASC' },
    selectedTrees: [],
    trees: [],
    handleSort: () => set((state) => ({ params: { ...state.params, sortOrder: state.params.sortOrder === 'ASC' ? 'DESC' : 'ASC' } })),
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
    addSelectedTrees: (data) => set((prevState) => ({
        selectedTrees: [...prevState.selectedTrees, ...data]
    })),
    removeSelectedTrees: (ids) => set((prevState) => ({
        selectedTrees: prevState.selectedTrees.filter(tree => !ids.includes(tree.id))
    })),
    removeSelectedTree: (id) => set((prevState) => ({
        selectedTrees: prevState.selectedTrees.filter((newState) => newState.id !== id)
    })),
    clearSelectedTrees: () => set({ selectedTrees: [] })
}))