"use client"
import { useModal } from "@/hooks/useModal"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import { TreeForm } from "../tree/treeForm"
import { TreesForm } from "../forms/TreesForm/treesForm"
import { SpecieForm } from "../species/specieForm"
import { useForm, FormProvider } from "react-hook-form";

export const Modal = () => {
    const { isOpen, onClose, form } = useModal()
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}   >
            <DialogContent className="max-w-[80%]  2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto  " >
                <DialogHeader>
                </DialogHeader>
                {form === 'treeForm' && (
                    <TreeForm />
                )}
                {form === 'treesForm' && (
                    <TreesForm />
                )}
                {form === 'specieForm' && (
                    <SpecieForm />
                )}
            </DialogContent>
        </Dialog>
    )
}