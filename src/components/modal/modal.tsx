"use client"
import { useModal } from "@/hooks/useModal"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import { TreeForm } from "../tree/treeForm"
import { TreesForm } from "../forms/TreesForm/treesForm"
import { SectionsForm } from "../section/sectionsForm"
import { SpecieForm } from "../species/specieForm"
import { useForm, FormProvider } from "react-hook-form";
import { FormFieldValues } from "../section/FormFieldValues"

export const Modal = () => {
    const { isOpen, onClose, form } = useModal()
    const methods = useForm<FormFieldValues>({

    });
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
                <FormProvider  {...methods}>
                    {form === 'sectionsForm' && (
                        <SectionsForm />
                    )}
                </FormProvider>
                {form === 'specieForm' && (
                    <SpecieForm />
                )}
            </DialogContent>
        </Dialog>
    )
}