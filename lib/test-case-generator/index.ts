export interface TestCase {
  id: string
  question: string
  options?: string[]
  answer: string
  explanation?: string
  type: 'multiple-choice' | 'short-answer' | 'true-false'
}

// 간단한 테스트 케이스 생성 함수
export function generateTestCases(content: string, count: number = 5): TestCase[] {
  // 실제 AI 기반 테스트 케이스 생성 로직이 필요하지만, 
  // 현재는 더미 데이터를 반환
  return Array.from({ length: count }).map((_, index) => ({
    id: `test-${index + 1}`,
    question: `${content.substring(0, 50)}...에 관한 질문 ${index + 1}?`,
    options: [
      '보기 1',
      '보기 2',
      '보기 3',
      '보기 4',
    ],
    answer: `보기 ${(index % 4) + 1}`,
    explanation: `이 문제의 답은 보기 ${(index % 4) + 1}입니다. 왜냐하면...`,
    type: 'multiple-choice' as const,
  }))
}

// 진위형 문제 생성
export function generateTrueFalseQuestions(content: string, count: number = 3): TestCase[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `tf-${index + 1}`,
    question: `${content.substring(0, 30)}...는 사실이다.`,
    options: ['참', '거짓'],
    answer: index % 2 === 0 ? '참' : '거짓',
    explanation: `이 문제의 답은 ${index % 2 === 0 ? '참' : '거짓'}입니다. 왜냐하면...`,
    type: 'true-false' as const,
  }))
}

// 주관식 문제 생성
export function generateShortAnswerQuestions(content: string, count: number = 2): TestCase[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `sa-${index + 1}`,
    question: `${content.substring(0, 40)}...에서 가장 중요한 개념은 무엇인가?`,
    answer: `핵심 개념 ${index + 1}`,
    explanation: `핵심 개념 ${index + 1}이 중요한 이유는...`,
    type: 'short-answer' as const,
  }))
} 