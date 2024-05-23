import db from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { Prisma } from "@prisma/client"

export async function POST(request: Request) {
    const body = await request.json()
    try {
        const response = await db.species.create({
            data: {
                commonName: body.commonName,
                scientificName: body.scientificName,
            }
        })
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    const page = Number(request.nextUrl.searchParams.get('page')) || 1
    const orderBy = request.nextUrl.searchParams.get('orderBy') || null
    const sortOrderParam = request.nextUrl.searchParams.get('sortOrder');
    const searchParam = request.nextUrl.searchParams.get('searchParam') || null
    const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc') ? sortOrderParam : 'asc';
    const limit = 10
    const offSet = (page - 1) * limit
    let query: Prisma.speciesFindManyArgs = {}
    try {
        if (id) {
            const response = await db.species.findUnique({
                where: {
                    id: id
                }
            })
            if (!response) {
                return NextResponse.json({ message: `Arvore ${id} não encontrada!` }, { status: 404 })
            }
            return NextResponse.json(response)
        }


        let where: Prisma.speciesWhereInput = {}
        if (searchParam) {
            where = {
                OR: [{

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
                    },]

                },]
            }
        }
        if (limit && offSet) {
            query.take = limit
            query.skip = offSet
        }

        if (orderBy) {
            query.orderBy = {
                [orderBy]: sortOrder
            }

        }

        if (where) {
            query.where = where
        }

        const response = await db.species.findMany(query)
        const count = await db.species.count({ where })
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
        const species = await db.species.findUnique({ where: { id: body.id } })
        if (!species) {
            return NextResponse.json({ message: `Arvore ${body.id} não encontrada!` }, { status: 404 })
        }

        Object.assign(species, body)

        const speciesUpdated = await db.species.update({
            where: { id: species.id }, data: species
        })
        return NextResponse.json(speciesUpdated)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function DELETE(request: NextRequest, res: Response) {
    const id = request.nextUrl.searchParams.get('id')
    try {
        if (id) {
            const species = await db.species.findUnique({
                where: {
                    id: id
                }
            })
            if (!species)
                return NextResponse.json({ message: `Arvore ${id} não encontrada` }, { status: 404 })

            await db.species.delete({
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