import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

interface AlertDialogWrapperProps {
    alert: {
        title: string;
        description?: string;
        type?: "default" | "destructive";
        onConfirm?: () => void;
        onCancel?: () => void;
    } | null;
    hideAlert: () => void;
}

export function AlertDialogWrapper({ alert, hideAlert }: AlertDialogWrapperProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(!!alert);
    }, [alert]);

    const handleCancel = () => {
        alert?.onCancel?.();
        setOpen(false);
        hideAlert();
    };

    const handleConfirm = () => {
        alert?.onConfirm?.();
        setOpen(false);
        hideAlert();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
                    {alert?.description && (
                        <AlertDialogDescription>{alert.description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={alert?.type === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
