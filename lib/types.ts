export interface Question {
  id: string
  type: "multiple-choice" | "short-answer"
  question: string
  options?: string[]
  correctAnswer: string
  source?: {
    text: string
    reference: string
  }
  examInfo?: string
  hint?: string
}

export interface Answer {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  timestamp: string
}

export interface StudyPlan {
  totalDays: number // 총 학습 일수
  questionsPerDay: number // 하루 목표 문제 수
  currentDay: number // 현재 학습 일차
  startDate: string // 학습 시작 일자
  completedToday: number // 오늘 완료한 문제 수
  carryOver: number // 이전 날짜에서 이월된 문제 수
}

export interface StudySession {
  id: string
  title: string
  content: string
  timestamp: string
  fileName?: string
  questionType?: "multiple-choice" | "short-answer"
  studyMode?: "all" | "continue" | "incorrect" | "marked"
  lastQuestionIndex?: number
  questionHistory?: Record<
    string,
    {
      isCorrect: boolean
      isMarked: boolean
      timestamp: string
    }
  >
  studyPlan?: StudyPlan // 학습 계획 정보 추가
  totalQuestions?: number // 총 생성할 문제 수
}

