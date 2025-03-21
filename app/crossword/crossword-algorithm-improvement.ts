// 크로스워드 알고리즘 개선 계획

// 1. 개선된 키워드 추출 알고리즘
export function extractKeywordsImproved(text: string): string[] {
  // 1. TF-IDF 기반 키워드 추출
  // 2. 문맥 기반 중요도 계산
  // 3. 품사 태깅을 통한 명사/용어 우선 추출
  // 4. 최소 길이 필터링 (2글자 이상)

  // 임시 구현 (실제 구현은 NLP 라이브러리 활용 필요)
  const words = text.split(/\s+/)
  const filteredWords = words
    .filter((word) => word.length >= 2)
    .filter((word) => !commonWords.includes(word.toLowerCase()))

  return [...new Set(filteredWords)].slice(0, 20) // 중복 제거 및 상위 20개 추출
}

// 2. 문맥 기반 문제 생성 알고리즘
export function generateContextualClues(keyword: string, context: string): string {
  // 1. 키워드가 포함된 문장 추출
  // 2. 문장에서 키워드를 제외한 정보로 힌트 생성
  // 3. 필요시 GPT 활용하여 문맥에 맞는 힌트 생성

  // 임시 구현 (실제 구현은 더 정교한 로직 필요)
  const sentences = context.split(/[.!?]+/)
  const relevantSentences = sentences.filter((s) => s.includes(keyword))

  if (relevantSentences.length > 0) {
    const sentence = relevantSentences[0].trim()
    return sentence.replace(keyword, "______")
  }

  return `${keyword}에 대한 힌트를 찾을 수 없습니다.`
}

// 3. 크로스워드 퍼즐 검증 알고리즘
export function validateCrosswordPuzzle(keywords: string[], clues: string[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = []

  // 1. 키워드-힌트 쌍 검증
  // 2. 힌트의 명확성 검증
  // 3. 크로스워드 배치 가능성 검증

  // 임시 구현
  for (let i = 0; i < keywords.length; i++) {
    if (!clues[i] || clues[i].includes("찾을 수 없습니다")) {
      issues.push(`"${keywords[i]}" 키워드에 대한 적절한 힌트가 없습니다.`)
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}

// 공통 불용어 목록 (예시)
const commonWords = [
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "if",
  "then",
  "else",
  "when",
  "그",
  "이",
  "저",
  "것",
  "이것",
  "저것",
  "그것",
  "이런",
  "저런",
  "그런",
  "및",
  "또는",
  "그리고",
  "하지만",
  "때문에",
  "위해서",
]

