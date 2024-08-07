import { ISpecie } from "@/domain/specie"
import { ICreateTree, ITree } from "@/domain/tree"
import db from "@/lib/prisma"
import { formatSearchParam } from "@/lib/searchParam"
import { PrismaClient, Prisma } from "@prisma/client"
import { NextResponse, NextRequest } from "next/server"



export async function POST(request: Request) {
    const body = await request.json()
    try {
        let treesCreated: ITree[] = []
        await db.$transaction(async (prisma) => {
            await Promise.all(
                body.specie.map(async (specie: ISpecie) => {
                    const result = await prisma.species.findFirst({
                        where: {
                            scientificName: {
                                contains: specie.scientificName,
                                mode: 'insensitive'
                            },
                        }
                    })
                    if (result) {
                        specie.id = result.id
                        specie.volumeM3 = result.volumeM3,
                            specie.trees = specie.trees.map((tree) => {
                                return {
                                    ...tree,
                                    specie_id: result.id,
                                    sectionsVolumeM3: 0
                                }
                            })
                    } else {
                        const newSpecie = await prisma.species.create({
                            data: {
                                commonName: specie.commonName,
                                scientificName: specie.scientificName,
                                volumeM3: 0,
                                sectionsVolumeM3: 0
                            }
                        })
                        specie.id = newSpecie.id
                        specie.volumeM3 = 0
                        specie.trees = specie.trees.map((tree) => {
                            return {
                                ...tree,
                                specie_id: newSpecie.id,
                                sectionsVolumeM3: 0
                            }
                        })
                    }

                    specie.trees.map(async (tree) => {
                        const result = await prisma.tree.create({ data: tree })
                        treesCreated.push(result)
                    })

                    // await prisma.tree.createMany({ data: specie.trees })

                    specie.volumeM3 += specie.trees.reduce((acc, obj) => {
                        return acc + obj.volumeM3
                    }, 0)

                    await prisma.species.update({
                        data: {
                            volumeM3: specie.volumeM3
                        },
                        where: {
                            id: specie.id
                        }
                    })

                })
            )
        })
        /*  await db.tree.createMany({ data: body })
          const updatedList = await db.tree.findMany() */
        return NextResponse.json(treesCreated, { status: 201 })
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    const number = Number(request.nextUrl.searchParams.get('number'))
    const page = Number(request.nextUrl.searchParams.get('page')) || 1
    const orderBy = request.nextUrl.searchParams.get('orderBy') || 'number'
    const sortOrderParam = request.nextUrl.searchParams.get('sortOrder');
    const searchParam = request.nextUrl.searchParams.get('searchParam') || ""
    const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc') ? sortOrderParam : 'asc';
    const limit = 10
    const offSet = (page - 1) * limit
    console.log(number)
    try {
        if (id) {
            const response = await db.tree.findUnique({
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
            const response = await db.tree.findFirst({
                where: {
                    number: number
                }
            })
            if (!response) {
                return NextResponse.json({ message: `Arvore N° ${number} não encontrada!` }, { status: 404 })
            }
            return NextResponse.json(response)
        }

        let where = {}
        if (searchParam) {
            const formatedSearchParam = formatSearchParam(searchParam)
            if (formatedSearchParam?.type == 'numeric') {
                where = {
                    number: {
                        equals: formatedSearchParam.value
                    }
                }
            } else if (formatedSearchParam?.type == 'string') {
                where = {
                    OR: [{
                        commonName: {
                            contains: searchParam,
                            mode: 'insensitive'
                        },
                    }, {
                        scientificName: {
                            contains: searchParam,
                            mode: 'insensitive'
                        },
                    },]
                }
            } else if (formatedSearchParam?.type == 'numberArray') {
                where = {
                    number: {
                        in: formatedSearchParam.value
                    }
                }
            }

        }
        let query = {
            take: limit,
            skip: offSet,
            orderBy: { [orderBy]: sortOrder },
            where

        }
        const response = await db.tree.findMany(query)
        const count = await db.tree.count({ where })
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
        const tree = await db.tree.findUnique({
            where: {
                id: body.id

            },
        })
        if (!tree) {
            return NextResponse.json({ message: `Arvore ${body.id} não encontrada!` }, { status: 404 })
        }

        Object.assign(tree, body)

        const treeUpdated = await db.tree.update({
            where: { id: tree.id }, data: tree
        })
        return NextResponse.json(treeUpdated)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function DELETE(request: NextRequest, res: Response) {
    const id = request.nextUrl.searchParams.get('id')
    try {
        if (id) {
            const tree = await db.tree.findUnique({
                where: {
                    id: id
                },
                include: {
                    sections: true,
                    species: true
                }
            })
            if (!tree)
                return NextResponse.json({ message: `Arvore ${id} não encontrada` }, { status: 404 })

            if (tree.sections.length > 0) {
                return NextResponse.json({ message: `Arvore ${id} não pode ser deletada pois tem secções!` })
            }
            await db.species.update({
                where: {
                    id: tree.specie_id,
                },
                data: {
                    volumeM3: tree.species.volumeM3 - tree.volumeM3
                }
            })

            await db.tree.delete({
                where: {
                    id
                }
            })
            return NextResponse.json(true)
        }
    } catch (error) {
        return NextResponse.json(error)
    }

}

