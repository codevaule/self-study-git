// app/api/documents/route.ts

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const document = await db.document.create({
      data: {
        userId,
        title,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.log("[DOCUMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

