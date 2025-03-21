import { type NextRequest, NextResponse } from "next/server"
import { getStudySession } from "@/lib/study-session"
import { generateCrosswordPuzzle } from "@/lib/crossword-generator"

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const sessionId = params.sessionId

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // 세션 데이터 가져오기
    const session = await getStudySession(sessionId)

    if (!session || !session.questions || session.questions.length === 0) {
      return NextResponse.json({ error: "Session not found or no questions available" }, { status: 404 })
    }

    // 크로스워드 퍼즐 생성
    const puzzle = await generateCrosswordPuzzle(session.questions)

    return NextResponse.json({ puzzle })
  } catch (error) {
    console.error("크로스워드 퍼즐 생성 오류:", error)
    return NextResponse.json({ error: `크로스워드 퍼즐 생성 오류: ${error.message}` }, { status: 500 })
  }
}

