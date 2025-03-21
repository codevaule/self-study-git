import OpenAI from "openai"

// OpenAI API 키 설정
const apiKey = process.env.OPENAI_API_KEY

// OpenAI 클라이언트 인스턴스 생성
export const openai = new OpenAI({
  apiKey: apiKey || "", // 키가 없으면 빈 문자열 사용
})

// API 키가 설정되었는지 확인하는 함수
export function isOpenAIConfigured(): boolean {
  return !!apiKey
}

