"use client"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { FileUp } from 'lucide-react';
import { ImportSectionsService } from "@/services/settingsService"


interface ISection {
    scientificName: string;
    commonName: string;
    number: number;
    section: string;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    meters: number;
    volumeM3: number;
    [key: string]: any; // Para cobrir campos extras
}


export const ImportBatchsModal = () => {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [grouped, setGrouped] = useState([])

    const handleDialog = () => {
        setOpen((state) => !state)
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            await ImportSectionsService(selectedFile)
        }
    };

    return (
        <>
            <div className="flex items-center space-x-2">
                <Button variant='default' onClick={handleDialog}>Importar Abates</Button>
                <Label> Importar Abates de uma planilha CSV</Label>
            </div>
            <Dialog open={open} onOpenChange={handleDialog}>
                <DialogContent className="max-w-[90%] 2xl:max-w-[70%] flex min-h-[450px] max-h-[90%]  overflow-y-auto flex-col">
                    <DialogTitle className="shadow-sm p-2">
                        Importar Abates
                    </DialogTitle>
                    <div className="flex">
                        <div className="w-full">
                            <Button
                                onClick={() => {
                                    if (inputFileRef.current) {
                                        inputFileRef.current.click();
                                    }

                                }}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Carregar Planilha
                            </Button>
                            <input
                                type="file"
                                className=""
                                accept=".xls,.xlsx,.csv"
                                ref={inputFileRef}
                                style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}