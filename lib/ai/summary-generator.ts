import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSummary(content: string, title: string): Promise<string> {
  try {
    // 컨텐츠가 너무 길면 잘라내기
    const maxLength = 4000
    const truncatedContent = content.length > maxLength ? content.substring(0, maxLength) + "..." : content

    const prompt = `
다음은 "${title}"에 관한 내용입니다. 이 내용을 요약하고 핵심 포인트를 추출해주세요.
요약은 다음 형식으로 제공해주세요:

1. 핵심 요약 (3-5문장)
2. 주요 개념 (불릿 포인트)
3. 중요 용어 설명 (용어: 설명)

내용:
${truncatedContent}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "당신은 교육 콘텐츠를 명확하고 간결하게 요약하는 전문가입니다. 학습자가 핵심 개념을 쉽게 이해할 수 있도록 도와주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    })

    return response.choices[0].message.content || "요약을 생성할 수 없습니다."
  } catch (error) {
    console.error("요약 생성 오류:", error)
    return "요약을 생성하는 중 오류가 발생했습니다."
  }
}

