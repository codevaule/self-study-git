import { type NextRequest, NextResponse } from "next/server"
import { openai, isOpenAIConfigured } from "@/lib/openai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // OpenAI API 키 확인
    if (!isOpenAIConfigured()) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const { content, model = "gpt-4o", temperature = 0.3 } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert content analyzer. Analyze the given text and extract key concepts, themes, and important information.",
        },
        { role: "user", content },
      ],
      temperature,
    })

    return NextResponse.json({
      analysis: response.choices[0]?.message?.content || "",
    })
  } catch (error: any) {
    console.error("AI 분석 오류:", error)
    return NextResponse.json({ error: error.message || "Failed to analyze content" }, { status: 500 })
  }
}

