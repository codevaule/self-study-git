import { type NextRequest, NextResponse } from "next/server"

// 서버 측 피드백 저장소에서 가져오는 함수 (실제 구현에서는 데이터베이스 사용)
import { feedbackStore } from "../route"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const questionId = url.searchParams.get("questionId")

    if (!questionId) {
      return NextResponse.json({ error: "Missing required parameter: questionId" }, { status: 400 })
    }

    // 특정 질문에 대한 피드백 조회
    const questionFeedback = feedbackStore.filter((feedback) => feedback.questionId === questionId)

    // 평균 평점 계산
    if (questionFeedback.length === 0) {
      return NextResponse.json({ averageRating: null })
    }

    const sum = questionFeedback.reduce((total, item) => total + item.rating, 0)
    const average = sum / questionFeedback.length

    return NextResponse.json({
      averageRating: average,
      count: questionFeedback.length,
    })
  } catch (error) {
    console.error("Error calculating average rating:", error)
    return NextResponse.json(
      { error: "Failed to calculate average rating", details: (error as Error).message },
      { status: 500 },
    )
  }
}

