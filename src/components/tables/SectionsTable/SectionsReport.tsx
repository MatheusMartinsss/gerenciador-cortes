import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ISection } from "@/domain/section"
import api from "@/lib/api"
import { maskToM3, maskToMeters } from "@/lib/masks"


export const SectionsReports = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<ISection[]>([])

    const handleModal = () => {
        setOpen((state) => !state)

    }


    const fetchData = async () => {
        const { data } = await api.get('/section', {
            params: {
                withoutPagination: true
            }
        })
        return data
    }

    const generateReport = async () => {
        const { data, count } = await fetchData()

        const itemsHeader = ['N° da Arvore', 'Seccção', 'Nome Popular', 'Nome Cientifico', 'D1', 'D2', 'Comprimento', 'Volume']

        const itemsRows = data.map((section: ISection) => [
            section.number,
            section.section,
            section.tree?.commonName,
            section.tree?.scientificName,
            maskToMeters(section.d1),
            maskToMeters(section.d4),
            maskToMeters(section.meters),
            maskToM3(section.volumeM3)
        ])

        const volumeTotal = data.reduce((acc:any, obj: ISection) => {
            return acc + obj.volumeM3
        }, 0)

        const itemsFooter = ['', '', '', '', '', '',`Qtd: ${count}`, `${maskToM3(volumeTotal)} M3`]

        const doc = new jsPDF()


        autoTable(doc, {
            head: [itemsHeader],
            body: itemsRows,
            foot: [itemsFooter],
            showFoot: true
        })



        doc.save('report.pdf')
    }

    return (
        <div>
            <Button size='sm' onClick={generateReport}>Relatorio</Button>
            <Dialog open={open} onOpenChange={handleModal}>
                <DialogContent className="max-w-[50%]  2xl:max-w-[20%] flex min-h-[450px] max-h-[90%]  overflow-y-auto" >
                    <div className="flex w-full flex-col p-4 space-y-4">
                        <div>
                            <Input></Input>
                        </div>
                        <div className="w-full flex">
                            <Button className="w-full" onClick={generateReport}>Gerar Relatorio</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}