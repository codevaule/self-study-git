export interface Document {
  id: string
  title: string
  content: string
  sections: DocumentSection[]
}

export interface DocumentSection {
  id: string
  title: string
  content: string
  level: number // 1 for main heading, 2 for subheading, etc.
  paragraphs: string[]
  keywords: Keyword[]
}

export interface Keyword {
  word: string
  importance: number // 0-1 score
  frequency: number
  context: string[] // sentences containing this keyword
}

export interface GeneratedQuestion {
  id: string
  type: QuestionType
  question: string
  answer: string
  options?: string[] // For multiple choice questions
  difficulty: number // 0-1 score
  explanation?: string
  relatedKeywords: string[]
  sourceSection: string // ID of the section this question is from
  context: string // The surrounding context for this question
}

export type QuestionType = "multiple-choice" | "fill-in-blank" | "true-false" | "short-answer"

export interface QuestionGenerationOptions {
  questionTypes: QuestionType[]
  difficultyRange: [number, number] // min and max difficulty, between 0-1
  count: number
  preferredSections?: string[] // IDs of sections to focus on
  excludedKeywords?: string[] // Keywords to avoid using
}

