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

