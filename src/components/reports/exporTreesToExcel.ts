import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ITree } from "@/domain/tree";
import { maskToMeters } from "@/lib/masks";

export async function exportTreesToExcel(trees: ITree[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Árvores");

    // Cabeçalhos
    worksheet.columns = [
        { header: "Número", key: "number", width: 15 },
        { header: "Nome Cientifico", key: "scientificName", width: 15 },
        { header: "Nome Popular", key: "commonName", width: 15 },
        { header: "DAP", key: "dap", width: 10 },
        { header: "Altura", key: "meters", width: 10 },
        { header: "Volume", key: "volumeM3", width: 12 },
        { header: "Volume Explorado", key: "sVolumeM3", width: 12 },
        { header: 'Autex', key: 'numero_autorizacao', width: 15}
    ];

    trees.forEach(tree => {
        worksheet.addRow({
            number: tree.number,
            scientificName: tree.scientificName,
            commonName: tree.commonName,
            dap: maskToMeters(tree.dap),
            meters: maskToMeters(tree.meters),
            volumeM3: tree.volumeM3,
            sVolumeM3: tree.sVolumeM3,
            numero_autorizacao: tree.autex.numero_autorizacao
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "arvores.xlsx");
}