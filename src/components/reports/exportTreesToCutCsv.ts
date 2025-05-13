import { ITree } from "@/domain/tree";
import { unparse } from "papaparse";
import { saveAs } from "file-saver";

export function exportTreesToCutCsv(trees: ITree[]) {
    const mapped = trees.map(tree => ({
        "Número da árvore": tree.number,
    }));
    const csv = unparse(mapped, {
        header: true,
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR").replace(/\//g, "-");
    const fileName = `Corte ${date}`;
    saveAs(blob, fileName);
}