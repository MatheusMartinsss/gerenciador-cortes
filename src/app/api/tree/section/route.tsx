import db from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    try {
        let cuts: any = []
        await db?.$transaction(async (prisma: any) => {
            await Promise.all(
                body.tree.map(async (item: any) => {
                    const tree = await prisma.tree.findUnique({
                        where: {
                            id: item.id
                        }
                    })
                    await prisma.tree.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            sectionsVolumeM3: tree.sectionsVolumeM3 + item.sectionsVolumeM3
                        }
                    })
                    await prisma.section.createMany({ data: item.section })
                })
            )
        },)
        return NextResponse.json(cuts, { status: 201 })
    } catch (error) {
        console.log(error)
        throw error
    }
}