"use client"
import { useModal } from "@/hooks/useModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { TreeForm } from "../tree/treeForm"
import { TreesForm } from "../tree/treesForm"
import { SectionsForm } from "../section/sectionsForm"

export const Modal = () => {
    const { isOpen, onClose, form } = useModal()
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen} >
            <DialogContent className="sm:max-w-fit" >
                <DialogHeader>
                    <DialogTitle>Teste</DialogTitle>
                </DialogHeader>
                {form === 'treeForm' && (
                    <TreeForm />
                )}
                {form === 'treesForm' && (
                    <TreesForm />
                )}
                {form === 'sectionsForm' && (
                    <SectionsForm />
                )}
            </DialogContent>
        </Dialog>
    )
}