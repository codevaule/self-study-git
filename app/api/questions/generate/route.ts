import { type NextRequest, NextResponse } from "next/server"
import { EnhancedQuestionGenerator } from "@/lib/langchain/question-generator"
import { EnhancedDocumentProcessor } from "@/lib/langchain/document-processor"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    // 사용자 인증 확인
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 })
    }

    // 요청 본문 파싱
    const body = await req.json()
    const {
      documentId,
      count = 5,
      difficulty = "mixed",
      types = ["multiple-choice", "true-false", "short-answer"],
    } = body

    if (!documentId) {
      return NextResponse.json({ error: "문서 ID가 제공되지 않았습니다." }, { status: 400 })
    }

    // 데이터베이스에서 문서 정보 조회
    const document = await db.document.findUnique({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      include: {
        sections: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "문서를 찾을 수 없습니다." }, { status: 404 })
    }

    // 문서 내용 가져오기 (예: S3 또는 다른 스토리지에서)
    const documentContent = await fetchDocumentContent(documentId)

    // 문서 처리기 초기화
    const documentProcessor = new EnhancedDocumentProcessor()

    // 문서 내용을 LangChain Document 형식으로 변환
    const buffer = Buffer.from(documentContent)
    const docs = await documentProcessor.loadPDFDocument(buffer)
    const splitDocs = await documentProcessor.splitDocuments(docs)

    // 문제 생성기 초기화
    const questionGenerator = new EnhancedQuestionGenerator()

    // 문제 생성
    const questions = await questionGenerator.generateQuestions(
      splitDocs,
      count,
      difficulty as "easy" | "medium" | "hard" | "mixed",
      types,
    )

    // 생성된 문제 저장
    const savedQuestions = await saveGeneratedQuestions(questions, documentId, session.user.id)

    // 결과 반환
    return NextResponse.json({
      success: true,
      questions: savedQuestions,
    })
  } catch (error: any) {
    console.error("문제 생성 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "문제 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 문서 내용 가져오기 (구현 필요)
async function fetchDocumentContent(documentId: string): Promise<ArrayBuffer> {
  // 여기에 실제 문서 내용을 가져오는 로직 구현
  // 예: S3, Blob Storage 등에서 파일 가져오기
  try {
    // 예시 구현
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/documents/content/${documentId}`)
    if (!response.ok) {
      throw new Error("문서 내용을 가져오는 데 실패했습니다.")
    }
    return await response.arrayBuffer()
  } catch (error) {
    console.error("문서 내용 가져오기 오류:", error)
    throw new Error("문서 내용을 가져오는 데 실패했습니다.")
  }
}

// 생성된 문제 저장 (구현 필요)
async function saveGeneratedQuestions(questions: any[], documentId: string, userId: string) {
  // 여기에 실제 문제를 데이터베이스에 저장하는 로직 구현
  try {
    const savedQuestions = []

    for (const question of questions) {
      const saved = await db.question.create({
        data: {
          ...question,
          documentId,
          userId,
        },
      })
      savedQuestions.push(saved)
    }

    return savedQuestions
  } catch (error) {
    console.error("문제 저장 오류:", error)
    throw new Error("생성된 문제를 저장하는 데 실패했습니다.")
  }
}

