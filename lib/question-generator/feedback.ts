import type { GeneratedQuestion } from "./types"

// 피드백 타입 정의
export interface QuestionFeedback {
  questionId: string
  rating: number // 1-5 scale
  comment?: string
  userId?: string
  timestamp: number
}

// 피드백 저장소 인터페이스
export interface FeedbackRepository {
  saveFeedback(feedback: QuestionFeedback): Promise<void>
  getFeedbackForQuestion(questionId: string): Promise<QuestionFeedback[]>
  getAverageRatingForQuestion(questionId: string): Promise<number | null>
  getAllFeedback(): Promise<QuestionFeedback[]>
}

// 로컬 스토리지 기반 피드백 저장소 구현
export class LocalStorageFeedbackRepository implements FeedbackRepository {
  private readonly storageKey = "study_helper_question_feedback"

  private getFeedbackData(): QuestionFeedback[] {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(this.storageKey)
    if (!data) return []

    try {
      return JSON.parse(data) as QuestionFeedback[]
    } catch (error) {
      console.error("Error parsing feedback data:", error)
      return []
    }
  }

  private saveFeedbackData(data: QuestionFeedback[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving feedback data:", error)
      // 로컬 스토리지 할당량 초과 시 오래된 피드백 제거
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        const currentData = this.getFeedbackData()
        // 가장 오래된 20%의 피드백 제거
        const removeCount = Math.ceil(currentData.length * 0.2)
        const newData = currentData.sort((a, b) => a.timestamp - b.timestamp).slice(removeCount)

        localStorage.setItem(this.storageKey, JSON.stringify(newData))
      }
    }
  }

  async saveFeedback(feedback: QuestionFeedback): Promise<void> {
    const data = this.getFeedbackData()
    data.push(feedback)
    this.saveFeedbackData(data)
  }

  async getFeedbackForQuestion(questionId: string): Promise<QuestionFeedback[]> {
    const data = this.getFeedbackData()
    return data.filter((feedback) => feedback.questionId === questionId)
  }

  async getAverageRatingForQuestion(questionId: string): Promise<number | null> {
    const feedback = await this.getFeedbackForQuestion(questionId)

    if (feedback.length === 0) return null

    const sum = feedback.reduce((total, item) => total + item.rating, 0)
    return sum / feedback.length
  }

  async getAllFeedback(): Promise<QuestionFeedback[]> {
    return this.getFeedbackData()
  }
}

// 서버 API 기반 피드백 저장소 구현
export class APIFeedbackRepository implements FeedbackRepository {
  private readonly apiEndpoint = "/api/feedback"

  async saveFeedback(feedback: QuestionFeedback): Promise<void> {
    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    })

    if (!response.ok) {
      throw new Error(`Failed to save feedback: ${response.statusText}`)
    }
  }

  async getFeedbackForQuestion(questionId: string): Promise<QuestionFeedback[]> {
    const response = await fetch(`${this.apiEndpoint}?questionId=${questionId}`)

    if (!response.ok) {
      throw new Error(`Failed to get feedback: ${response.statusText}`)
    }

    return response.json()
  }

  async getAverageRatingForQuestion(questionId: string): Promise<number | null> {
    const response = await fetch(`${this.apiEndpoint}/average?questionId=${questionId}`)

    if (!response.ok) {
      throw new Error(`Failed to get average rating: ${response.statusText}`)
    }

    const data = await response.json()
    return data.averageRating
  }

  async getAllFeedback(): Promise<QuestionFeedback[]> {
    const response = await fetch(this.apiEndpoint)

    if (!response.ok) {
      throw new Error(`Failed to get all feedback: ${response.statusText}`)
    }

    return response.json()
  }
}

// 피드백 서비스
export class FeedbackService {
  private repository: FeedbackRepository

  constructor(repository: FeedbackRepository) {
    this.repository = repository
  }

  async submitFeedback(questionId: string, rating: number, comment?: string, userId?: string): Promise<void> {
    const feedback: QuestionFeedback = {
      questionId,
      rating,
      comment,
      userId,
      timestamp: Date.now(),
    }

    await this.repository.saveFeedback(feedback)
  }

  async getQuestionFeedback(questionId: string): Promise<QuestionFeedback[]> {
    return this.repository.getFeedbackForQuestion(questionId)
  }

  async getAverageRating(questionId: string): Promise<number | null> {
    return this.repository.getAverageRatingForQuestion(questionId)
  }

  async getAllFeedback(): Promise<QuestionFeedback[]> {
    return this.repository.getAllFeedback()
  }

  // 피드백 분석 - 가장 높은 평가를 받은 질문 유형
  async getHighestRatedQuestionTypes(questions: GeneratedQuestion[]): Promise<Record<string, number>> {
    const feedback = await this.repository.getAllFeedback()
    const questionMap = new Map(questions.map((q) => [q.id, q]))

    const typeRatings: Record<string, { sum: number; count: number }> = {}

    for (const fb of feedback) {
      const question = questionMap.get(fb.questionId)
      if (!question) continue

      const type = question.type
      if (!typeRatings[type]) {
        typeRatings[type] = { sum: 0, count: 0 }
      }

      typeRatings[type].sum += fb.rating
      typeRatings[type].count += 1
    }

    const averageRatings: Record<string, number> = {}
    for (const [type, data] of Object.entries(typeRatings)) {
      averageRatings[type] = data.sum / data.count
    }

    return averageRatings
  }
}

// 피드백 저장소 팩토리
export function createFeedbackRepository(): FeedbackRepository {
  // 서버 사이드에서는 API 저장소 사용, 클라이언트 사이드에서는 로컬 스토리지 사용
  if (typeof window === "undefined") {
    return new APIFeedbackRepository()
  } else {
    return new LocalStorageFeedbackRepository()
  }
}

// 피드백 서비스 인스턴스 생성
export function createFeedbackService(): FeedbackService {
  const repository = createFeedbackRepository()
  return new FeedbackService(repository)
}

