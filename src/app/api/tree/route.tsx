import db from "@/lib/prisma"
import { NextResponse } from "next/server"

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

export async function GET(request: Request) {
    try {
        const response = await db.tree.findMany()
        return NextResponse.json(response)
    } catch (error) {
        console.log(error)
        throw error
    }
}