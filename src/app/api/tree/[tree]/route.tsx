import db from "@/lib/prisma"
import { Prisma, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server"

interface Params {
  tree: string
}

export async function GET(req: Request, context: { params: Params }) {
  const { params: { tree } } = context
  try {
    const response = await db.tree.findUnique({
      where: {
        id: tree
      },
      include: {
        sections: true,
        species: true
      }
    })
    return NextResponse.json(response)
  } catch (error) {

  }
}