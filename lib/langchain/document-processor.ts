import type { Document } from "langchain/document"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { RunnableSequence, RunnablePassthrough } from "langchain/schema/runnable"
import { PromptTemplate } from "langchain/prompts"
import { StringOutputParser } from "langchain/schema/output_parser"
import { formatDocumentsAsString } from "langchain/util/document"
import { BufferMemory } from "langchain/memory"

// 문서 로더 클래스 - 다양한 형식의 문서를 처리
export class EnhancedDocumentProcessor {
  private embeddings: OpenAIEmbeddings
  private model: ChatOpenAI
  private memory: BufferMemory

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    })

    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
      temperature: 0.2,
    })

    this.memory = new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    })
  }

  // PDF 문서 로드 및 처리
  async loadPDFDocument(buffer: Buffer): Promise<Document[]> {
    try {
      const loader = new PDFLoader(buffer)
      const docs = await loader.load()
      console.log(`PDF 문서 로드 완료: ${docs.length} 페이지`)
      return docs
    } catch (error) {
      console.error("PDF 문서 로드 중 오류 발생:", error)
      throw new Error("PDF 문서 처리 중 오류가 발생했습니다.")
    }
  }

  // 문서 분할 - 최적의 청크 크기로 분할
  async splitDocuments(docs: Document[]): Promise<Document[]> {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })

      const splitDocs = await textSplitter.splitDocuments(docs)
      console.log(`문서 분할 완료: ${splitDocs.length} 청크`)
      return splitDocs
    } catch (error) {
      console.error("문서 분할 중 오류 발생:", error)
      throw new Error("문서 분할 중 오류가 발생했습니다.")
    }
  }

  // 벡터 저장소 생성 - 의미 검색을 위한 임베딩
  async createVectorStore(docs: Document[]): Promise<MemoryVectorStore> {
    try {
      const vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings)
      console.log("벡터 저장소 생성 완료")
      return vectorStore
    } catch (error) {
      console.error("벡터 저장소 생성 중 오류 발생:", error)
      throw new Error("벡터 저장소 생성 중 오류가 발생했습니다.")
    }
  }

  // 문서 요약 생성 - 전체 문서 또는 섹션별 요약
  async generateSummary(docs: Document[]): Promise<string> {
    try {
      const combinedText = docs.map((doc) => doc.pageContent).join("\n\n")

      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 문서의 내용을 명확하고 간결하게 요약해주세요. 핵심 개념과 중요 포인트를 포함해야 합니다.
        
        문서:
        {text}
        
        요약:`,
      )

      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const summary = await chain.invoke({ text: combinedText })
      console.log("문서 요약 생성 완료")
      return summary
    } catch (error) {
      console.error("요약 생성 중 오류 발생:", error)
      throw new Error("요약 생성 중 오류가 발생했습니다.")
    }
  }

  // 질문에 대한 답변 생성 - RAG(Retrieval Augmented Generation) 구현
  async answerQuestion(vectorStore: MemoryVectorStore, question: string): Promise<string> {
    try {
      const retriever = vectorStore.asRetriever({
        k: 5, // 상위 5개 관련 문서 검색
      })

      const questionAnsweringPrompt = PromptTemplate.fromTemplate(
        `다음은 문서에서 검색된 관련 정보입니다:
        {context}
        
        이 정보를 바탕으로 다음 질문에 답변해주세요: {question}
        
        답변:`,
      )

      const ragChain = RunnableSequence.from([
        {
          context: retriever.pipe(formatDocumentsAsString),
          question: new RunnablePassthrough(),
        },
        questionAnsweringPrompt,
        this.model,
        new StringOutputParser(),
      ])

      const answer = await ragChain.invoke(question)
      console.log("질문 답변 생성 완료")
      return answer
    } catch (error) {
      console.error("질문 답변 생성 중 오류 발생:", error)
      throw new Error("질문 답변 생성 중 오류가 발생했습니다.")
    }
  }

  // 키워드 추출 - 문서의 주요 키워드 식별
  async extractKeywords(docs: Document[]): Promise<string[]> {
    try {
      const combinedText = docs.map((doc) => doc.pageContent).join("\n\n")

      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 문서에서 가장 중요한 키워드 10개를 추출해주세요. 각 키워드는 쉼표로 구분하여 나열해주세요.
        
        문서:
        {text}
        
        키워드:`,
      )

      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const keywordsText = await chain.invoke({ text: combinedText })
      const keywords = keywordsText.split(",").map((k) => k.trim())
      console.log("키워드 추출 완료:", keywords)
      return keywords
    } catch (error) {
      console.error("키워드 추출 중 오류 발생:", error)
      throw new Error("키워드 추출 중 오류가 발생했습니다.")
    }
  }

  // 문서 구조화 - 섹션 및 하위 섹션 식별
  async structureDocument(docs: Document[]): Promise<any> {
    try {
      const combinedText = docs.map((doc) => doc.pageContent).join("\n\n")

      const promptTemplate = PromptTemplate.fromTemplate(
        `다음 문서를 분석하여 구조화된 형식으로 변환해주세요. 주요 섹션과 하위 섹션을 식별하고, 각 섹션의 요약을 제공해주세요.
        결과는 JSON 형식으로 반환해주세요.
        
        문서:
        {text}
        
        구조화된 결과(JSON):`,
      )

      const chain = RunnableSequence.from([promptTemplate, this.model, new StringOutputParser()])

      const structuredResult = await chain.invoke({ text: combinedText })
      console.log("문서 구조화 완료")

      // JSON 문자열을 객체로 변환
      try {
        return JSON.parse(structuredResult)
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError)
        return { error: "구조화된 결과를 파싱할 수 없습니다.", rawResult: structuredResult }
      }
    } catch (error) {
      console.error("문서 구조화 중 오류 발생:", error)
      throw new Error("문서 구조화 중 오류가 발생했습니다.")
    }
  }
}

