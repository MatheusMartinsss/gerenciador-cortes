import { useState } from "react";
import { TreeModal } from "../TreeModal";
import { Button } from "../ui/button"
import { Eye } from 'lucide-react';

export const ViewTreeButton = ({ treeId }: { treeId: string }) => {
    const [open, setOpen] = useState(false)
    const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null)

    const handleModal = () => {

        if (open) {
            setSelectedTreeId(null)
        }

        setOpen((state) => !state)
    }


    const selectTree = (id: string) => {
        setSelectedTreeId(id)
        handleModal()
    }
    return (
        <>
            <Button
                variant='outline'
                onClick={() => selectTree(treeId)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
            </Button>
            <TreeModal treeId={selectedTreeId} handleModalState={handleModal} open={open} />
        </>
    )
}