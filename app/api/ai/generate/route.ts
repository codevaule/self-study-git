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

    const { prompt, model = "gpt-4o", temperature = 0.7, max_tokens = 2000 } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens,
    })

    return NextResponse.json({
      text: response.choices[0]?.message?.content || "",
    })
  } catch (error: any) {
    console.error("AI 생성 오류:", error)
    return NextResponse.json({ error: error.message || "Failed to generate AI response" }, { status: 500 })
  }
}

