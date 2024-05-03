import { create } from 'zustand'

interface TreeProps {
    tree: any
    setTree: (tree: any) => void
}
export const useTree = create<TreeProps>((set) => ({
    tree: {},
    setTree: (tree: any) => set({ tree })

}))