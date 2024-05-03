"use client"
import { useModal } from "@/hooks/useModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { TreeForm } from "../tree/treeForm"



export const Modal = () => {
    const { isOpen, onClose, form } = useModal()
    console.log(form)
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Teste</DialogTitle>
                </DialogHeader>
                {form === 'treeForm' && (
                    <TreeForm />
                )}
            </DialogContent>
        </Dialog>
    )
}