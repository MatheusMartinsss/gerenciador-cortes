import { ITree } from "@/domain/tree";
import { unparse } from "papaparse";
import { saveAs } from "file-saver";
import { ISection } from "@/domain/section";

export async function exportSectionsToCutCsv(sections: ISection[]) {
    const mapped = sections.map(section => ({
        "Nº Árvore": section.number,
        "Seccao": section.section,
        "Diâmetro 1 (m)": (section.d1 / 100),
        "Diâmetro 2 (m)": (section.d4 / 100),
        "Comprimento (m)": (section.meters / 100)
    }));
    const csv = unparse(mapped, {
        header: true,
        delimiter: ";",

    })

    const blob = new Blob([csv], { type: "text/csv;charset=ISO-8859-1;" });
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR").replace(/\//g, "-");
    const fileName = `Tracamento ${date}`;
    saveAs(blob, fileName);
}