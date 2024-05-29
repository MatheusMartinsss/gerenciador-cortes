import db from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    try {
        let cuts: any = []
        await db?.$transaction(async (prisma: Prisma.TransactionClient) => {
            await Promise.all(
                body.tree.map(async (item: any) => {
                    const tree = await prisma.tree.findUnique({
                        where: {
                            id: item.id
                        },
                        include: {
                            species: true
                        }
                    })
                    if (tree) {
                        await prisma.tree.update({
                            where: {
                                id: item.id
                            },
                            data: {
                                sectionsVolumeM3: tree.sectionsVolumeM3 + item.sectionsVolumeM3,
                                species: {
                                    update: {
                                        sectionsVolumeM3: tree.species?.sectionsVolumeM3 + item.sectionsVolumeM3
                                    }
                                }
                            }
                        })
                
                        await prisma.section.createMany({ data: item.section })
                    }
                })
            )
        },)
        return NextResponse.json(cuts, { status: 201 })
    } catch (error) {
        console.log(error)
        throw error
    }
}