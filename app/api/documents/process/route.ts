import { type NextRequest, NextResponse } from "next/server"
import { EnhancedDocumentProcessor } from "@/lib/langchain/document-processor"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // 사용자 인증 확인
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 })
    }

    // 요청 본문 파싱
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다." }, { status: 400 })
    }

    // 파일 유형 확인
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF 파일만 지원됩니다." }, { status: 400 })
    }

    // 파일 크기 제한 확인 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "파일 크기는 10MB를 초과할 수 없습니다." }, { status: 400 })
    }

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // LangChain 문서 프로세서 초기화
    const documentProcessor = new EnhancedDocumentProcessor()

    // PDF 문서 로드
    const docs = await documentProcessor.loadPDFDocument(buffer)

    // 문서 분할
    const splitDocs = await documentProcessor.splitDocuments(docs)

    // 벡터 저장소 생성
    const vectorStore = await documentProcessor.createVectorStore(splitDocs)

    // 문서 요약 생성
    const summary = await documentProcessor.generateSummary(splitDocs)

    // 키워드 추출
    const keywords = await documentProcessor.extractKeywords(splitDocs)

    // 문서 구조화
    const structure = await documentProcessor.structureDocument(splitDocs)

    // 결과 반환
    return NextResponse.json({
      success: true,
      documentInfo: {
        title: file.name,
        summary,
        keywords,
        structure,
        pageCount: docs.length,
        chunkCount: splitDocs.length,
      },
    })
  } catch (error: any) {
    console.error("문서 처리 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "문서 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

