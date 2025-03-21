import { EnhancedDocumentProcessor } from "../langchain/document-processor"
import { EnhancedQuestionGenerator } from "../langchain/question-generator"

// AI 기능을 위한 통합 인터페이스
export const AI = {
  // 문서 처리 관련 기능
  document: {
    // 문서 처리 및 분석
    async processDocument(file: File) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const processor = new EnhancedDocumentProcessor()
        const docs = await processor.loadPDFDocument(buffer)
        const splitDocs = await processor.splitDocuments(docs)

        // 문서 분석 결과
        const summary = await processor.generateSummary(splitDocs)
        const keywords = await processor.extractKeywords(splitDocs)
        const structure = await processor.structureDocument(splitDocs)

        return {
          docs,
          splitDocs,
          summary,
          keywords,
          structure,
        }
      } catch (error) {
        console.error("문서 처리 오류:", error)
        throw new Error("문서 처리 중 오류가 발생했습니다.")
      }
    },

    // 문서 요약 생성
    async generateSummary(content: string) {
      try {
        // 문서 내용을 기반으로 요약 생성
        const processor = new EnhancedDocumentProcessor()
        const docs = [{ pageContent: content, metadata: {} }]
        return await processor.generateSummary(docs)
      } catch (error) {
        console.error("요약 생성 오류:", error)
        throw new Error("요약 생성 중 오류가 발생했습니다.")
      }
    },
  },

  // 문제 생성 관련 기능
  questions: {
    // 문서 기반 문제 생성
    async generateQuestions(content: string, options: any = {}) {
      try {
        const { count = 5, difficulty = "mixed", types = ["multiple-choice", "true-false", "short-answer"] } = options

        const generator = new EnhancedQuestionGenerator()
        const docs = [{ pageContent: content, metadata: {} }]

        return await generator.generateQuestions(docs, count, difficulty, types)
      } catch (error) {
        console.error("문제 생성 오류:", error)
        throw new Error("문제 생성 중 오류가 발생했습니다.")
      }
    },

    // 피드백 기반 문제 개선
    async improveQuestion(question: any, feedback: string) {
      try {
        const generator = new EnhancedQuestionGenerator()
        return await generator.improveQuestionBasedOnFeedback(question, feedback)
      } catch (error) {
        console.error("문제 개선 오류:", error)
        throw new Error("문제 개선 중 오류가 발생했습니다.")
      }
    },
  },
}

export default AI

