import type { Document, GeneratedQuestion, QuestionGenerationOptions } from "./types"

// OpenAI API 통합을 위한 인터페이스
interface OpenAICompletionRequest {
  model: string
  messages: Array<{
    role: "system" | "user" | "assistant"
    content: string
  }>
  temperature: number
  max_tokens: number
}

interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

/**
 * OpenAI API를 사용하여 문제를 생성합니다.
 */
export async function generateAIQuestions(
  document: Document,
  options: QuestionGenerationOptions,
): Promise<GeneratedQuestion[]> {
  try {
    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn("OpenAI API key not found, falling back to rule-based generation")
      // 규칙 기반 생성기로 폴백
      return import("./question-generator").then((module) => module.generateQuestions(document, options))
    }

    // 문서 내용 준비
    const documentContent = prepareDocumentForAI(document)

    // 질문 유형 및 난이도 설정
    const { questionTypes, difficultyRange, count } = options
    const [minDifficulty, maxDifficulty] = difficultyRange

    // 프롬프트 생성
    const prompt = createPromptForQuestionGeneration(
      documentContent,
      questionTypes,
      minDifficulty,
      maxDifficulty,
      count,
    )

    // OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 또는 gpt-3.5-turbo
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator specialized in creating high-quality assessment questions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      } as OpenAICompletionRequest),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = (await response.json()) as OpenAICompletionResponse
    const questionsText = data.choices[0].message.content

    // 응답 파싱
    const questions = parseAIResponse(questionsText, document, options)

    return questions
  } catch (error) {
    console.error("Error generating AI questions:", error)

    // 오류 발생 시 규칙 기반 생성기로 폴백
    return import("./question-generator").then((module) => module.generateQuestions(document, options))
  }
}

/**
 * AI 프롬프트용 문서 내용을 준비합니다.
 */
function prepareDocumentForAI(document: Document): string {
  let content = `Title: ${document.title}\n\n`

  document.sections.forEach((section) => {
    content += `## ${section.title}\n\n${section.content}\n\n`
  })

  return content
}

/**
 * 질문 생성을 위한 프롬프트를 생성합니다.
 */
function createPromptForQuestionGeneration(
  documentContent: string,
  questionTypes: string[],
  minDifficulty: number,
  maxDifficulty: number,
  count: number,
): string {
  return `
Please create ${count} educational assessment questions based on the following document content.

DOCUMENT CONTENT:
${documentContent}

REQUIREMENTS:
1. Create questions of the following types: ${questionTypes.join(", ")}
2. Distribute questions evenly across the different types
3. Questions should range in difficulty from ${minDifficulty * 100}% to ${maxDifficulty * 100}%
4. Each question must be directly related to the content provided
5. For multiple-choice questions, provide 4 options with only one correct answer
6. For true/false questions, provide a clear statement that is either true or false
7. For fill-in-blank questions, use underscores to indicate the blank
8. For short-answer questions, provide a clear question with a specific expected answer

FORMAT YOUR RESPONSE AS JSON:
{
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option here",
      "difficulty": 0.5,
      "explanation": "Optional explanation here"
    },
    {
      "type": "fill-in-blank",
      "question": "Sentence with _____ for the blank",
      "answer": "word that goes in the blank",
      "difficulty": 0.7
    },
    // more questions...
  ]
}
`
}

/**
 * AI 응답을 파싱하여 GeneratedQuestion 객체 배열로 변환합니다.
 */
function parseAIResponse(
  responseText: string,
  document: Document,
  options: QuestionGenerationOptions,
): GeneratedQuestion[] {
  try {
    // JSON 부분 추출
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/)

    let jsonText = ""
    if (jsonMatch) {
      jsonText = jsonMatch[0].replace(/```json\n|```/g, "")
    } else {
      jsonText = responseText
    }

    // JSON 파싱
    const parsed = JSON.parse(jsonText)

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response format: questions array not found")
    }

    // GeneratedQuestion 객체로 변환
    return parsed.questions.map((q: any, index: number) => {
      // 기본 ID 생성
      const id = `ai_q_${index}_${Date.now()}`

      // 문서 섹션 할당 (간단한 방법으로)
      const sectionIndex = index % document.sections.length
      const sourceSection = document.sections[sectionIndex].id

      // 관련 키워드 추출 (간단한 방법으로)
      const relatedKeywords = extractKeywordsFromQuestion(q.question, document)

      // 공통 필드
      const baseQuestion: Partial<GeneratedQuestion> = {
        id,
        type: q.type,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty || 0.5,
        explanation: q.explanation || "",
        sourceSection,
        relatedKeywords,
        context: q.context || "",
      }

      // 타입별 추가 필드
      switch (q.type) {
        case "multiple-choice":
          return {
            ...baseQuestion,
            options: q.options || [],
          } as GeneratedQuestion

        case "true-false":
          return {
            ...baseQuestion,
            answer: q.answer === true ? "True" : q.answer === false ? "False" : q.answer,
          } as GeneratedQuestion

        default:
          return baseQuestion as GeneratedQuestion
      }
    })
  } catch (error) {
    console.error("Error parsing AI response:", error)
    console.error("Response text:", responseText)

    // 파싱 오류 시 빈 배열 반환
    return []
  }
}

/**
 * 질문에서 관련 키워드를 추출합니다.
 */
function extractKeywordsFromQuestion(question: string, document: Document): string[] {
  const keywords: string[] = []

  // 모든 섹션의 키워드 수집
  const allKeywords = document.sections.flatMap((section) => section.keywords.map((k) => k.word))

  // 질문에 포함된 키워드 찾기
  allKeywords.forEach((keyword) => {
    if (question.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword)
    }
  })

  // 최대 3개 키워드 반환
  return keywords.slice(0, 3)
}

