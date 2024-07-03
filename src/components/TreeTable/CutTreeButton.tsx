import { useState } from "react";
import { Button } from "../ui/button"
import { TreePine } from 'lucide-react';
import { CutTreeModal } from "../CutTreeModal/CutTreeModal";

export const CutTreeButton = () => {
    const [open, setOpen] = useState(false)

    const handleModal = () => {
        setOpen((state) => !state)
    }
    return (
        <>
            <Button
                variant='ghost'
                onClick={handleModal}>
                <TreePine className="mr-2 h-4 w-4" />
                Tracar
            </Button>
            <CutTreeModal handleModal={handleModal} open={open} />
        </>
    )
}