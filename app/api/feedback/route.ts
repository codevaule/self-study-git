import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 피드백 저장소 (실제 구현에서는 데이터베이스 사용)
export const feedbackStore = {
  items: [] as any[],
  add(feedback: any) {
    this.items.push({
      ...feedback,
      id: `feedback_${Date.now()}`,
      createdAt: new Date(),
    })
    return this.items[this.items.length - 1]
  },
  getAll() {
    return this.items
  },
  getById(id: string) {
    return this.items.find((item) => item.id === id)
  },
}

export async function POST(request: NextRequest) {
  try {
    // 세션 확인 (인증된 사용자만 피드백 제출 가능)
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 })
    }

    // 요청 본문 파싱
    const body = await request.json()

    // 필수 필드 검증
    if (!body.content || !body.type) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 })
    }

    // 피드백 데이터 구성
    const feedbackData = {
      userId: session.user.id,
      userName: session.user.name || "익명",
      type: body.type,
      content: body.content,
      rating: body.rating || 0,
      documentId: body.documentId || null,
      sessionId: body.sessionId || null,
      questionId: body.questionId || null,
      metadata: body.metadata || {},
      status: "pending",
    }

    // 피드백 저장 (실제 구현에서는 데이터베이스에 저장)
    // const feedback = await db.feedback.create({
    //   data: feedbackData
    // })

    // 임시 저장소 사용
    const feedback = feedbackStore.add(feedbackData)

    return NextResponse.json({ success: true, feedback }, { status: 201 })
  } catch (error) {
    console.error("피드백 제출 오류:", error)
    return NextResponse.json({ error: "피드백 제출 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인 (실제 구현에서는 관리자 권한 검증 필요)
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 })
    }

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    // 피드백 조회 (실제 구현에서는 데이터베이스에서 조회)
    // let query = {}
    // if (type) query = { ...query, type }
    // if (status) query = { ...query, status }

    // const feedbacks = await db.feedback.findMany({
    //   where: query,
    //   orderBy: { createdAt: 'desc' }
    // })

    // 임시 저장소 사용
    let feedbacks = feedbackStore.getAll()

    // 필터링
    if (type) {
      feedbacks = feedbacks.filter((f) => f.type === type)
    }
    if (status) {
      feedbacks = feedbacks.filter((f) => f.status === status)
    }

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error("피드백 조회 오류:", error)
    return NextResponse.json({ error: "피드백 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

