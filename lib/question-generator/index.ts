import type { Document } from "@/types/document"
import type { GeneratedQuestion } from "@/types/question"
import { OpenAI } from "openai"
import { parseAIResponse } from "./parser"
import { generatePrompt } from "./prompt"
import { difficultyLevels } from "./difficulty"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * 문서 내용을 기반으로 질문을 생성합니다.
 */
export async function generateQuestions(
  document: Document,
  options: {
    count?: number
    difficulty?: number
    types?: string[]
    focusKeywords?: string[]
    focusSections?: string[]
  } = {},
): Promise<GeneratedQuestion[]> {
  try {
    // 기본 옵션 설정
    const {
      count = 5,
      difficulty = 0.5,
      types = ["multiple-choice", "true-false", "short-answer"],
      focusKeywords = [],
      focusSections = [],
    } = options

    // 난이도 레벨 결정
    const difficultyLevel = difficultyLevels.find((level) => level.value <= difficulty) || difficultyLevels[0]

    // 프롬프트 생성
    const prompt = generatePrompt({
      document,
      count,
      difficultyLevel,
      types,
      focusKeywords,
      focusSections,
    })

    // 개선된 로깅
    console.log("AI 질문 생성 시작:", {
      documentId: document.id,
      documentTitle: document.title,
      questionCount: count,
      difficulty: difficultyLevel.label,
      types,
      focusKeywords: focusKeywords.length > 0 ? focusKeywords : "없음",
      focusSections: focusSections.length > 0 ? focusSections : "전체",
    })

    // AI 모델 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "당신은 교육 콘텐츠 전문가로, 학습 자료를 기반으로 정확하고 교육적인 질문을 생성합니다. 질문은 학습자의 이해도를 평가하고 향상시키는 데 도움이 되어야 합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    // 응답 파싱
    const responseText = response.choices[0].message.content || ""
    const questions = parseAIResponse(responseText, document)

    // 개선된 로깅
    console.log("AI 질문 생성 완료:", {
      documentId: document.id,
      generatedCount: questions.length,
      requestedCount: count,
    })

    // 생성된 질문 반환
    return questions
  } catch (error) {
    console.error("질문 생성 오류:", error)
    throw new Error("질문을 생성하는 중 오류가 발생했습니다.")
  }
}

/**
 * 질문에 대한 피드백을 생성합니다.
 */
export async function generateQuestionFeedback(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  context = "",
): Promise<string> {
  try {
    const prompt = `
질문: ${question}

사용자 답변: ${userAnswer}

정답: ${correctAnswer}

${context ? `관련 내용: ${context}` : ""}

위 질문에 대한 사용자의 답변을 평가하고, 상세한 피드백을 제공해주세요. 
사용자가 틀렸다면 왜 틀렸는지, 어떤 개념을 잘못 이해했는지 설명해주세요.
사용자가 맞았다면 답변의 강점을 설명하고, 추가로 알면 좋을 내용이 있다면 언급해주세요.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "당신은 교육 전문가로, 학생들의 답변에 대해 건설적이고 도움이 되는 피드백을 제공합니다. 피드백은 정확하고, 명확하며, 학습자의 이해를 돕는 데 중점을 둡니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content || "피드백을 생성할 수 없습니다."
  } catch (error) {
    console.error("피드백 생성 오류:", error)
    return "피드백을 생성하는 중 오류가 발생했습니다."
  }
}

/**
 * 질문 생성 알고리즘 개선: 문서의 핵심 개념을 더 잘 파악하고 다양한 유형의 질문을 생성합니다.
 */
export async function analyzeDocumentConcepts(document: Document): Promise<string[]> {
  try {
    // 모든 섹션의 내용 결합
    const allContent = document.sections.map((s) => s.content).join("\n\n")

    // 내용이 너무 길면 잘라내기
    const maxLength = 4000
    const truncatedContent = allContent.length > maxLength ? allContent.substring(0, maxLength) + "..." : allContent

    const prompt = `
다음은 "${document.title}"에 관한 문서 내용입니다. 이 문서에서 가장 중요한 핵심 개념 10개를 추출해주세요.
각 개념은 한 줄로 간결하게 표현하고, 중요도 순으로 나열해주세요.

문서 내용:
${truncatedContent}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 교육 콘텐츠 분석 전문가로, 문서에서 핵심 개념을 정확하게 추출합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    const responseText = response.choices[0].message.content || ""

    // 응답에서 개념 추출 (번호가 붙은 리스트 형식 가정)
    const concepts = responseText
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        // 번호 제거 (예: "1. 개념" -> "개념")
        return line.replace(/^\d+\.\s*/, "").trim()
      })

    return concepts
  } catch (error) {
    console.error("문서 개념 분석 오류:", error)
    return []
  }
}

