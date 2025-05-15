import { AlertDialogWrapper } from "@/components/ui/alertDialogWrapper";
import { createContext, useContext, useState, ReactNode } from "react";

type AlertType = "default" | "destructive";

interface AlertData {
    title: string;
    description?: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface AlertContextProps {
    showAlert: (data: AlertData) => void;
    hideAlert: () => void;
    alert: AlertData | null;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alert, setAlert] = useState<AlertData | null>(null);

    const showAlert = (data: AlertData) => setAlert(data);
    const hideAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
            <AlertDialogWrapper alert={alert} hideAlert={hideAlert} />
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}
