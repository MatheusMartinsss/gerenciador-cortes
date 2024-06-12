import db from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    const number = request.nextUrl.searchParams.get('number')
    const page = Number(request.nextUrl.searchParams.get('page')) || 1
    const orderBy = request.nextUrl.searchParams.get('orderBy') || 'number'
    const sortOrderParam = request.nextUrl.searchParams.get('sortOrder');
    const searchParam = request.nextUrl.searchParams.get('searchParam') || ""
    const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc') ? sortOrderParam : 'asc';
    const limit = 10
    const offSet = (page - 1) * limit
    let query: Prisma.sectionFindManyArgs = {}
    try {
        if (id) {
            const response = await db.section.findUnique({
                where: {
                    id: id
                }
            })
            if (!response) {
                return NextResponse.json({ message: `Arvore ${id} não encontrada!` }, { status: 404 })
            }
            return NextResponse.json(response)
        }
        if (number) {
            const response = await db.section.findFirst({
                where: {
                    number: {
                        contains: number,
                        mode: 'insensitive'
                    }
                }
            })
            if (!response) {
                return NextResponse.json({ message: `Arvore N° ${number} não encontrada!` }, { status: 404 })
            }
            return NextResponse.json(response)
        }

        let where: Prisma.sectionWhereInput = {}
        if (searchParam) {
            where = {
                OR: [{
                    tree: {
                        OR: [{
                            commonName: {
                                contains: searchParam.toLowerCase(),
                                mode: 'insensitive'
                            },
                        }, {
                            scientificName: {
                                contains: searchParam.toLowerCase(),
                                mode: 'insensitive'
                            },
                        }, ]
                    }
                }, {
                    number: {
                        contains: searchParam,
                        mode: 'insensitive'
                    }
                }]
            }
        }
        if (limit) {
            query.take = limit
            query.skip = offSet
        }

        if (orderBy) {
            if (orderBy === 'tree.number') {
                query.orderBy = {
                    tree: {
                        number: sortOrder
                    }
                }
            } else if (orderBy === 'tree.commonName') {
                query.orderBy = {
                    tree: {
                        commonName: sortOrder
                    }
                }

            } else if (orderBy === 'tree.scientificName') {
                query.orderBy = {
                    tree: {
                        scientificName: sortOrder
                    }
                }
            } else {
                query.orderBy = {
                    [orderBy]: sortOrder
                }
            }
        }
        query.include = {
            tree: {
                select: {
                    commonName: true,
                    scientificName: true,
                    number: true

                }
            }
        }
        if (where) {
            query.where = where
        }

        const response = await db.section.findMany(query)
        const count = await db.section.count({ where })
        const maxPages = Math.ceil(count / limit)
        return NextResponse.json({ data: response, pages: maxPages })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function PUT(request: Request, res: Response) {

    const body = await request.json()
    try {
        const section = await db.section.findUnique({ where: { id: body.id } })
        if (!section) {
            return NextResponse.json({ message: `Arvore ${body.id} não encontrada!` }, { status: 404 })
        }

        Object.assign(section, body)

        const sectionUpdated = await db.section.update({
            where: { id: section.id }, data: section
        })
        return NextResponse.json(sectionUpdated)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function DELETE(request: NextRequest, res: Response) {
    const id = request.nextUrl.searchParams.get('id')
    try {
        if (id) {
            const section = await db.section.findUnique({
                where: {
                    id: id
                },

            })
            if (!section)
                return NextResponse.json({ message: `Arvore ${id} não encontrada` }, { status: 404 })

            await db.$transaction(async (prisma: Prisma.TransactionClient) => {
                const tree = await prisma.tree.findUnique({
                    where: {
                        id: section.tree_id
                    },
                    include: {
                        species: true
                    }
                })
                if (tree) {
                    await prisma.tree.update({
                        where: {
                            id: tree.id
                        },
                        data: {
                            sectionsVolumeM3: tree.sectionsVolumeM3 - section.volumeM3,
                            species: {
                                update: {
                                    sectionsVolumeM3: tree.species?.sectionsVolumeM3 - section.volumeM3
                                }
                            }
                        },
                    })
                }
                await prisma.section.delete({
                    where: {
                        id
                    }
                })

            })
            return NextResponse.json(true)
        }
    } catch (error) {
        return NextResponse.json(error)
    }

}