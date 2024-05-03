import db from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    try {
        const response = await db.tree.create({ data: body })
        return NextResponse.json(response)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
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
        const response = await db.tree.findMany()
        return NextResponse.json(response)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function PUT(request: Request, res: Response) {

    const body = await request.json()
    try {
        const tree = await db.tree.findUnique({ where: { id: body.id } })
        if (!tree) {
            return NextResponse.json({ message: `Arvore ${body.id} não encontrada!` }, { status: 404 })
        }

        Object.assign(tree, body)

        const treeUpdated = await db.tree.update({
            where: { id: tree.id }, data: tree
        })
        return NextResponse.json({ treeUpdated })
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function DELETE(request: NextRequest, res: Response) {
    const id = request.nextUrl.searchParams.get('id')
    return new Response(id)

}

