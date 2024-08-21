import db from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

function sumVolumeM3({ d1, d2, d3, d4, meters }: { d1: number, d2: number, d3: number, d4: number, meters: number }) {
    const pi = Math.PI;
    const averageD1D2 = (((d1 / 100) + (d2 / 100)) / 2)
    const averageD3D4 = (((d3 / 100) + (d4 / 100)) / 2)
    const volumeM3 = ((((Math.pow(averageD1D2, 2) * (pi / 4)) + (Math.pow(averageD3D4, 2) * (pi / 4))) / 2) * (meters / 100))
    return Math.ceil((volumeM3 * 1000))
}


export async function GET(request: Request) {
    try {
        enum TreeStatus {
            NONE = "NONE",
            PARTIAL = "PARTIAL",
            FULL = "FULL"
        }
        const trees = await db.tree.findMany({
            where: {
                sections: {
                    some: {},
                },
            },
            include: {
                sections: true,
            },
        });

        for (const tree of trees) {
            let totalVolumeM3 = 0;
            let status: TreeStatus = TreeStatus.NONE;

            tree.sections.forEach((section) => {
                if (section.tree_id === tree.id) {
                    const { d1, d2, d3, d4, meters } = section;
                    const volumeM3 = sumVolumeM3({ d1, d2, d3, d4, meters });
                    totalVolumeM3 += volumeM3; // Acumula o volume total
                }
            });
            if (totalVolumeM3 < tree.volumeM3 && totalVolumeM3 > 0) {
                status = TreeStatus.PARTIAL
            } else if (totalVolumeM3 >= tree.volumeM3) {
                status = TreeStatus.FULL
            }

            await db.tree.update({
                where: { id: tree.id },
                data: { sectionsVolumeM3: totalVolumeM3, status: status },
            });
        }
        const species = await db.species.findMany({
            where: {
                trees: {
                    some: {
                    },
                },
            },
            include: {
                trees: true,
            },
        });
        for (const specie of species) {
            let totalVolumeM3 = 0;

            specie.trees.forEach((tree) => {
                totalVolumeM3 += tree.sectionsVolumeM3; // Acumula o volume total
            });

            specie.sectionsVolumeM3 = totalVolumeM3
            await db.species.update({
                where: { id: specie.id },
                data: { sectionsVolumeM3: totalVolumeM3 },
            });
        }



        return NextResponse.json({ status: 201 })
    } catch (error) {
        console.log(error)
        throw error
    }
}