"use client"
import { ImportBatchsModal } from "@/components/ImportBatchsModal/ImportBatchsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";


export default function Settings() {
    const handleVolume = async () => {
        try {
            const response = await api.get('/settings', {});
            console.log('Dados recebidos:', response.data);
        } catch (error) {
            console.error('Erro ao buscar o volume:', error);
        }
    };
    return (
        <div className="flex h-screen justify-center w-full">
            <Card className="w-full h-[60%]">
                <CardHeader className="bg-green-800 h-4 flex justify-center rounded">
                    <CardTitle className="text-white">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="pt-10 flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                        <Button onClick={handleVolume} variant='default'>Volume M3</Button>
                        <Label> Soma novamente o saldo de todas arvores e especies.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ImportBatchsModal />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}