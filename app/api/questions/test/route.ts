import { type NextRequest, NextResponse } from "next/server"
import { sampleDocument, processDocument, generateQuestions, sampleQuestionOptions } from "@/lib/question-generator"

export async function GET(request: NextRequest) {
  try {
    // Process the sample document
    const document = processDocument(sampleDocument.title, sampleDocument.content)

    // Generate questions using the sample options
    const questions = generateQuestions(document, sampleQuestionOptions)

    return NextResponse.json({
      success: true,
      document,
      questions,
    })
  } catch (error) {
    console.error("Error generating test questions:", error)
    return NextResponse.json(
      { error: "Failed to generate test questions", details: (error as Error).message },
      { status: 500 },
    )
  }
}

