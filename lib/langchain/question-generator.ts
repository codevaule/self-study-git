import type { Document } from "langchain/document"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { RunnableSequence } from "langchain/schema/runnable"
import { StringOutputParser } from "langchain/schema/output_parser"
import type { GeneratedQuestion } from "@/types/question"

export class EnhancedQuestionGenerator {
  private model: ChatOpenAI

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
      temperature: 0.7,
    })
  }

  // 문서 기반 다양한 유형의 문제 생성
  async generateQuestions(
    docs: Document[],
    count = 5,
    difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
    types: string[] = ["multiple-choice", "true-false", "short-answer"],
  ): Promise<GeneratedQuestion[]> {
    try {
      // 문서 내용 결합
      const combinedText = docs.map((doc) => doc.pageContent).join("\n\n")

      // 난이도 설정
      let difficultyPrompt = ""
      if (difficulty === "easy") {
        difficultyPrompt = "쉬운 난이도(기본 개념 이해 수준)"
      } else if (difficulty === "medium") {
        difficultyPrompt = "중간 난이도(개념 적용 수준)"
      } else if (difficulty === "hard") {
        difficultyPrompt = "어려운 난이도(심화 개념 및 응용 수준)"
      } else {
        difficultyPrompt = "다양한 난이도(쉬움, 중간, 어려움 혼합)"
      }

      // 문제 유형 설정
      const typesList = types.join(", ")

      // 프롬프트 템플릿 생성
      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 문서 내용을 기반으로 ${count}개의 학습 문제를 생성해주세요.
        
        문서 내용:
        {text}
        
        요구사항:
        1. 문제 유형: ${typesList}
        2. 난이도: ${difficultyPrompt}
        3. 각 문제는 다음 정보를 포함해야 합니다:
           - 문제 유형(type): 'multiple-choice', 'true-false', 'short-answer' 중 하나
           - 문제 내용(question): 명확하고 이해하기 쉬운 질문
           - 정답(answer): 객관식의 경우 정답 옵션, 주관식의 경우 모범 답안
           - 객관식 옵션(options): 객관식인 경우 4개의 선택지 (배열 형태)
           - 난이도(difficulty): 0.0(매우 쉬움)부터 1.0(매우 어려움)까지의 숫자
           - 설명(explanation): 정답에 대한 상세 설명
           - 관련 컨텍스트(context): 문제와 관련된 문서의 일부분
        
        4. 결과는 다음 JSON 형식으로 반환해주세요:
        {
          "questions": [
            {
              "type": "문제 유형",
              "question": "문제 내용",
              "answer": "정답",
              "options": ["선택지1", "선택지2", "선택지3", "선택지4"], // 객관식인 경우
              "difficulty": 난이도 숫자,
              "explanation": "정답 설명",
              "context": "관련 컨텍스트"
            },
            // 추가 문제들...
          ]
        }
        
        JSON 형식만 반환해주세요.`,
      )

      // 체인 생성 및 실행
      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const result = await chain.invoke({ text: combinedText })
      console.log("문제 생성 완료")

      // JSON 파싱 및 GeneratedQuestion 형식으로 변환
      return this.parseQuestionsResponse(result)
    } catch (error) {
      console.error("문제 생성 중 오류 발생:", error)
      throw new Error("문제 생성 중 오류가 발생했습니다.")
    }
  }

  // 특정 주제에 대한 심화 문제 생성
  async generateAdvancedQuestions(topic: string, context: string, count = 3): Promise<GeneratedQuestion[]> {
    try {
      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 주제와 컨텍스트를 기반으로 ${count}개의 심화 학습 문제를 생성해주세요.
        
        주제: ${topic}
        
        컨텍스트:
        {context}
        
        요구사항:
        1. 문제는 심화 수준으로, 비판적 사고와 개념 응용을 요구해야 합니다.
        2. 각 문제는 다음 정보를 포함해야 합니다:
           - 문제 유형(type): 'multiple-choice', 'true-false', 'short-answer' 중 하나
           - 문제 내용(question): 명확하고 도전적인 질문
           - 정답(answer): 객관식의 경우 정답 옵션, 주관식의 경우 모범 답안
           - 객관식 옵션(options): 객관식인 경우 4개의 선택지 (배열 형태)
           - 난이도(difficulty): 0.7부터 1.0까지의 숫자 (심화 수준)
           - 설명(explanation): 정답에 대한 상세 설명
           - 관련 컨텍스트(context): 문제와 관련된 컨텍스트의 일부분
        
        3. 결과는 다음 JSON 형식으로 반환해주세요:
        {
          "questions": [
            {
              "type": "문제 유형",
              "question": "문제 내용",
              "answer": "정답",
              "options": ["선택지1", "선택지2", "선택지3", "선택지4"], // 객관식인 경우
              "difficulty": 난이도 숫자,
              "explanation": "정답 설명",
              "context": "관련 컨텍스트"
            },
            // 추가 문제들...
          ]
        }
        
        JSON 형식만 반환해주세요.`,
      )

      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const result = await chain.invoke({ context })
      console.log("심화 문제 생성 완료")

      return this.parseQuestionsResponse(result)
    } catch (error) {
      console.error("심화 문제 생성 중 오류 발생:", error)
      throw new Error("심화 문제 생성 중 오류가 발생했습니다.")
    }
  }

  // 피드백 기반 문제 개선
  async improveQuestionBasedOnFeedback(question: GeneratedQuestion, feedback: string): Promise<GeneratedQuestion> {
    try {
      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 학습 문제를 사용자 피드백을 기반으로 개선해주세요.
        
        원본 문제:
        {questionJson}
        
        사용자 피드백:
        {feedback}
        
        개선된 문제를 다음 JSON 형식으로 반환해주세요:
        {
          "type": "문제 유형",
          "question": "문제 내용",
          "answer": "정답",
          "options": ["선택지1", "선택지2", "선택지3", "선택지4"], // 객관식인 경우
          "difficulty": 난이도 숫자,
          "explanation": "정답 설명",
          "context": "관련 컨텍스트"
        }
        
        JSON 형식만 반환해주세요.`,
      )

      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const questionJson = JSON.stringify(question)
      const result = await chain.invoke({ questionJson, feedback })
      console.log("문제 개선 완료")

      // JSON 파싱 및 GeneratedQuestion 형식으로 변환
      try {
        const parsedResult = JSON.parse(result)
        return this.convertToGeneratedQuestion(parsedResult, question.id)
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError)
        throw new Error("개선된 문제를 파싱할 수 없습니다.")
      }
    } catch (error) {
      console.error("문제 개선 중 오류 발생:", error)
      throw new Error("문제 개선 중 오류가 발생했습니다.")
    }
  }

  // 응답 파싱 및 GeneratedQuestion 형식으로 변환
  private parseQuestionsResponse(responseText: string): GeneratedQuestion[] {
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

        return this.convertToGeneratedQuestion(q, id)
      })
    } catch (error) {
      console.error("AI 응답 파싱 오류:", error)
      console.error("응답 텍스트:", responseText)

      // 파싱 오류 시 빈 배열 반환
      return []
    }
  }

  // 객체를 GeneratedQuestion 형식으로 변환
  private convertToGeneratedQuestion(q: any, id: string): GeneratedQuestion {
    // 공통 필드
    const baseQuestion: Partial<GeneratedQuestion> = {
      id,
      type: q.type,
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty || 0.5,
      explanation: q.explanation || "",
      sourceSection: q.sourceSection || "",
      relatedKeywords: q.relatedKeywords || [],
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
  }
}

