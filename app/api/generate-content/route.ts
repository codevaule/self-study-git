import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // Edge 런타임 대신 Node.js 런타임 사용

// 지원되는 AI 모델 정의 (내보내지 않고 내부에서만 사용)
const AI_MODELS = {
  "gpt-3.5-turbo": { name: "GPT-3.5 Turbo", provider: "openai", isPaid: true },
  "gpt-4o": { name: "GPT-4o", provider: "openai", isPaid: true },
  "gemini-pro": { name: "Google Gemini Pro", provider: "google", isPaid: false },
  "claude-instant": { name: "Claude Instant", provider: "anthropic", isPaid: true },
  "llama-2": { name: "Llama 2", provider: "meta", isPaid: false },
  sample: { name: "샘플 컨텐츠", provider: "local", isPaid: false },
}

export async function POST(request: NextRequest) {
  try {
    const { title, model = "sample", apiKey = "" } = await request.json()

    if (!title) {
      return NextResponse.json({
        content: generateSampleContent("일반 학습 자료"),
        warning: "시험 제목이 제공되지 않아 일반 샘플 컨텐츠가 생성되었습니다.",
        success: true,
        isSample: true,
      })
    }

    // 샘플 모델이 선택된 경우 샘플 컨텐츠 반환
    if (model === "sample") {
      console.log("샘플 컨텐츠 생성 중:", title)
      return NextResponse.json({
        content: generateSampleContent(title),
        warning: "샘플 컨텐츠가 생성되었습니다. 실제 시험 준비에는 더 자세한 자료를 참고하세요.",
        success: true,
        isSample: true,
      })
    }

    // API 키 확인
    const useApiKey = apiKey || process.env.OPENAI_API_KEY || ""
    if (!useApiKey && AI_MODELS[model]?.isPaid) {
      console.log("API 키가 설정되지 않았습니다. 샘플 컨텐츠 생성 중:", title)
      return NextResponse.json({
        content: generateSampleContent(title),
        warning: "API 키가 설정되지 않아 샘플 컨텐츠가 생성되었습니다.",
        success: true,
        isSample: true,
      })
    }

    // 테스트 목적으로 소량의 데이터만 수집
    const maxTokens = 500 // 테스트를 위해 토큰 수 제한

    // 선택된 모델에 따라 API 호출
    if (AI_MODELS[model]?.provider === "openai" && useApiKey) {
      try {
        // OpenAI API 호출 (테스트용 소량 데이터)
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useApiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content:
                  "당신은 학습 자료를 생성하는 도우미입니다. 주어진 시험 제목에 맞는 간략한 학습 자료를 마크다운 형식으로 생성해주세요.",
              },
              {
                role: "user",
                content: `${title} 시험을 위한 간략한 학습 자료를 생성해주세요. 주요 개념과 학습 영역을 간단히 포함해주세요.`,
              },
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
          }),
        })

        if (!response.ok) {
          throw new Error(`OpenAI API 오류: ${response.statusText}`)
        }

        const data = await response.json()
        const generatedContent = data.choices[0].message.content

        return NextResponse.json({
          content: generatedContent,
          success: true,
          isSample: false,
        })
      } catch (apiError) {
        console.error("API 호출 오류:", apiError)
        return NextResponse.json({
          content: generateSampleContent(title),
          warning: "API 오류로 인해 샘플 컨텐츠가 생성되었습니다. 실제 시험 준비에는 더 자세한 자료를 참고하세요.",
          success: true,
          isSample: true,
        })
      }
    } else {
      // 다른 모델은 현재 구현되지 않음 - 샘플 컨텐츠 반환
      return NextResponse.json({
        content: generateSampleContent(title),
        warning: `${AI_MODELS[model]?.name || model} 모델은 현재 테스트 중입니다. 샘플 컨텐츠가 생성되었습니다.`,
        success: true,
        isSample: true,
      })
    }
  } catch (error) {
    console.error("요청 처리 오류:", error)
    return NextResponse.json({
      content: generateSampleContent("일반 학습 자료"),
      warning: "오류가 발생하여 샘플 컨텐츠가 생성되었습니다. 실제 시험 준비에는 더 자세한 자료를 참고하세요.",
      success: true,
      isSample: true,
    })
  }
}

// 시험 유형에 맞는 샘플 컨텐츠 생성
function generateSampleContent(examTitle: string): string {
  // 기존 샘플 컨텐츠 생성 함수 유지
  // 시험 유형별 맞춤 샘플 컨텐츠
  let content = `# ${examTitle} 학습 자료 (샘플)

`

  // 시험 유형별 맞춤 컨텐츠 추가
  if (examTitle.includes("정보처리기사") || examTitle.includes("정보처리산업기사")) {
    content += `
## 정보처리기사/산업기사 시험 개요

정보처리기사는 소프트웨어 개발 및 IT 시스템 관리에 필요한 전문 지식과 기술을 평가하는 국가기술자격증입니다.

### 시험 구성
- 필기시험: 5개 과목, 객관식 100문항
- 실기시험: 프로그래밍 언어 활용, 시스템 분석 설계, 데이터베이스 구축, 애플리케이션 구현

### 주요 학습 영역

#### 1. 소프트웨어 설계
- 요구사항 분석
- UML 다이어그램
- 소프트웨어 아키텍처

#### 2. 소프트웨어 개발
- 프로그래밍 언어(Java, C++)
- 자료구조와 알고리즘
- 데이터베이스 프로그래밍
`
  } else if (examTitle.includes("컴퓨터활용능력") || examTitle.includes("컴활")) {
    content += `
## 컴퓨터활용능력 시험 개요

컴퓨터활용능력은 사무자동화 프로그램의 활용 능력을 평가하는 국가기술자격증입니다.

### 시험 구성
- 필기시험: 컴퓨터 일반, 스프레드시트, 데이터베이스
- 실기시험: 스프레드시트(Excel), 데이터베이스(Access) 활용

### 주요 학습 영역

#### 1. 스프레드시트(Excel)
- 기본 함수 활용 (SUM, AVERAGE, COUNT 등)
- 고급 함수 (VLOOKUP, INDEX, MATCH, IF 등)
- 피벗 테이블 및 차트
- 매크로 및 VBA 기초
`
  } else {
    content += `
## ${examTitle} 학습 가이드

### 시험 개요
${examTitle}은(는) 전문 지식과 기술을 평가하는 중요한 시험입니다.

### 주요 학습 영역

#### 1. 기초 이론
- 핵심 개념 이해
- 기본 원리 학습
- 용어 및 정의 숙지

#### 2. 응용 기술
- 실무 적용 방법
- 문제 해결 기법
- 사례 분석
`
  }

  content += `

---

**참고**: 이 내용은 샘플이므로 실제 시험 준비에는 공식 교재와 함께 사용하는 것이 좋습니다.`

  return content
}

