import db from "@/lib/prisma"
import { Prisma, PrismaClient } from "@prisma/client"
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

                        // await prisma.section.createMany({ data: item.section })

                        await prisma.batch.create({
                            data: {
                                volumeM3: item.section.reduce((acc: any, obj: any) => {
                                    return acc + obj.volumeM3
                                }, 0),
                                sections: {
                                    create: item.section.map((x: any) => ({
                                        section: {
                                            create: x
                                        }
                                    }))
                                }
                            },
                            include: {
                                sections: {
                                    include: {
                                        section: true
                                    }
                                }
                            }
                        })
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

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    const page = Number(request.nextUrl.searchParams.get('page')) || 1
    const orderBy = request.nextUrl.searchParams.get('orderBy') || 'number'
    const sortOrderParam = request.nextUrl.searchParams.get('sortOrder');
    const searchParam = request.nextUrl.searchParams.get('searchParam') || ""
    const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc') ? sortOrderParam : 'asc';
    const limit = 10
    const offSet = (page - 1) * limit
    try {
        if (id) {
            const response = await db.batch.findUnique({
                where: {
                    id: id
                }
            })
            if (!response) {
                return NextResponse.json({ message: `Abate ${id} não encontrada!` }, { status: 404 })
            }
            return NextResponse.json(response)
        }
        let where = {}
        if (searchParam) {
            where = {
              
            }
        }
        let query = {
            take: limit,
            skip: offSet,
            orderBy: { [orderBy]: sortOrder },
            where

        }
        const response = await db.batch.findMany(query)
        const count = await db.batch.count({ where })
        const maxPages = Math.ceil(count / limit)
        return NextResponse.json({ data: response, pages: maxPages })
    } catch (error) {
        console.log(error)
        throw error
    }
}