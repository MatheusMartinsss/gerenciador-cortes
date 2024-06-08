"use client"
import { useModal } from "@/hooks/useModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { TreeForm } from "../tree/treeForm"
import { TreesForm } from "../tree/TreesForm/treesForm"
import { SectionsForm } from "../section/sectionsForm"
import { SpecieForm } from "../species/specieForm"

export const Modal = () => {
    const { isOpen, onClose, form } = useModal()
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}   >
            <DialogContent  className="max-w-[80%]  2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto  " >
                <DialogHeader>
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
                {form === 'specieForm' && (
                    <SpecieForm />
                )}
            </DialogContent>
        </Dialog>
    )
}