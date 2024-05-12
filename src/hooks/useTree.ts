
import { ITree } from '@/domain/tree'
import { create } from 'zustand'

interface TreeProps {
    tree: ITree | null
    trees: ITree[]
    selectedTrees: ITree[]
    updateTrees: (newState: ITree) => void
    setTree: (tree: ITree | null) => void
    setTrees: (data: ITree[]) => void
    removeTree: (id: string) => void
    addTree: (data: ITree) => void
    addSelectedTree: (data: ITree) => void
    removeSelectedTree: (id: string) => void
}
export const useTree = create<TreeProps>((set) => ({
    tree: null,
    selectedTrees: [],
    trees: [],
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
    }))
}))