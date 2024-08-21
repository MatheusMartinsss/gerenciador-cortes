export const dynamic = "force-dynamic";
import db from "@/lib/prisma"
import { sumVolumeM3 } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";


export async function GET(request: NextRequest) {
    enum TreeStatus {
        NONE = "NONE",
        PARTIAL = "PARTIAL",
        FULL = "FULL"
    }
    try {
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
            
        return NextResponse.json(true)
    } catch (error) {
        console.log(error)
        throw error
    }
}