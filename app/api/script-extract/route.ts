import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateSummary } from "@/lib/ai/summary-generator"

export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    // 요청 본문 파싱
    const body = await req.json()
    const { documentId, sectionId } = body

    if (!documentId) {
      return NextResponse.json({ error: "문서 ID가 필요합니다." }, { status: 400 })
    }

    // 문서 조회
    const document = await db.document.findUnique({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      include: {
        sections: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "문서를 찾을 수 없습니다." }, { status: 404 })
    }

    // 특정 섹션 또는 전체 문서에 대한 스크립트 추출
    let content = ""
    let title = ""

    if (sectionId) {
      // 특정 섹션에 대한 스크립트 추출
      const section = document.sections.find((s) => s.id === sectionId)
      if (!section) {
        return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 404 })
      }
      content = section.content
      title = section.title
    } else {
      // 전체 문서에 대한 스크립트 추출
      content = document.sections.map((s) => s.content).join("\n\n")
      title = document.title
    }

    // AI를 사용하여 스크립트 요약 생성
    const summary = await generateSummary(content, title)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("스크립트 추출 오류:", error)
    return NextResponse.json({ error: "스크립트 추출 중 오류가 발생했습니다." }, { status: 500 })
  }
}

