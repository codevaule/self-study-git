import type { Question } from "./types"

// Generate sample study session data
export function generateSampleStudySession(id: string, title: string) {
  return {
    id,
    title,
    content: generateSampleContent(title),
    timestamp: new Date().toISOString(),
    fileName: "sample-data.txt",
    questionType: Math.random() > 0.5 ? "multiple-choice" : "short-answer",
    lastQuestionIndex: 0,
    questionHistory: {},
    totalQuestions: 10,
  }
}

// Generate sample content based on title
export function generateSampleContent(title: string): string {
  // Basic content for any title
  let content = `# ${title}\n\n`

  // Add specific content based on title keywords
  if (title.includes("정보처리") || title.includes("기사")) {
    content += `
## 데이터베이스
데이터베이스는 구조화된 데이터의 집합입니다. RDBMS, NoSQL 등 다양한 유형이 있습니다.

## 알고리즘
알고리즘은 문제 해결을 위한 단계별 절차입니다. 정렬, 검색, 그래프 알고리즘 등이 있습니다.

## 네트워크
네트워크는 컴퓨터 간의 연결 시스템입니다. TCP/IP, HTTP, DNS 등의 프로토콜이 사용됩니다.

## 보안
정보 보안은 데이터 보호를 위한 기술과 정책입니다. 암호화, 인증, 권한 관리 등이 포함됩니다.

## 소프트웨어 공학
소프트웨어 공학은 체계적인 소프트웨어 개발 방법론입니다. 요구사항 분석, 설계, 구현, 테스트, 유지보수 단계가 있습니다.
`
  } else if (title.includes("컴퓨터활용") || title.includes("컴활")) {
    content += `
## 스프레드시트
스프레드시트는 데이터를 행과 열로 구성하여 계산 및 분석하는 도구입니다.

### 주요 함수
- SUM: 합계 계산
- AVERAGE: 평균 계산
- COUNT: 개수 세기
- IF: 조건부 계산
- VLOOKUP: 수직 검색

## 데이터베이스
데이터베이스는 구조화된 데이터 관리 시스템입니다.

### 주요 기능
- 테이블 생성 및 관리
- 쿼리 작성
- 폼 디자인
- 보고서 생성
`
  } else if (title.includes("TOEIC") || title.includes("토익")) {
    content += `
## Listening Comprehension
The listening section tests your ability to understand spoken English in various contexts.

### Part 1: Photographs
- Look at the details in the image
- Listen carefully to all options
- Choose the statement that best describes the photograph

### Part 2: Question-Response
- Listen to the question
- Understand the context
- Select the most appropriate response

## Reading Comprehension
The reading section tests your ability to understand written English.

### Part 5: Incomplete Sentences
- Focus on grammar and vocabulary
- Look for subject-verb agreement
- Pay attention to prepositions and articles

### Part 7: Reading Comprehension
- Skim the passage first
- Look for main ideas
- Pay attention to details and supporting evidence
`
  } else {
    // Generic content for any other title
    content += `
## 주요 개념
- 개념 1: 첫 번째 중요 개념에 대한 설명입니다.
- 개념 2: 두 번째 중요 개념에 대한 설명입니다.
- 개념 3: 세 번째 중요 개념에 대한 설명입니다.

## 핵심 용어
- 용어 1: 첫 번째 핵심 용어에 대한 정의입니다.
- 용어 2: 두 번째 핵심 용어에 대한 정의입니다.
- 용어 3: 세 번째 핵심 용어에 대한 정의입니다.

## 중요 이론
이 분야의 중요한 이론에 대한 설명입니다. 이론의 배경, 주요 원칙, 적용 사례 등을 포함합니다.

## 실제 적용
실제 상황에서 이 지식을 어떻게 적용할 수 있는지에 대한 설명입니다.
`
  }

  return content
}

// Generate sample questions
export function generateSampleQuestions(type: string, count: number, title: string): Question[] {
  const questions: Question[] = []

  for (let i = 0; i < count; i++) {
    if (type === "multiple-choice") {
      questions.push(generateMultipleChoiceQuestion(i, title))
    } else {
      questions.push(generateShortAnswerQuestion(i, title))
    }
  }

  return questions
}

// Generate a sample multiple-choice question
function generateMultipleChoiceQuestion(index: number, title: string): Question {
  const topics = [
    "데이터베이스",
    "알고리즘",
    "네트워크",
    "보안",
    "소프트웨어 공학",
    "운영체제",
    "자료구조",
    "프로그래밍",
    "인공지능",
    "클라우드",
  ]

  const topic = topics[index % topics.length]

  return {
    id: `q-${index + 1}`,
    type: "multiple-choice",
    question: `${topic}의 주요 특징은 무엇인가?`,
    options: [
      `${topic}는 데이터 처리 속도를 향상시킨다`,
      `${topic}는 시스템 보안을 강화한다`,
      `${topic}는 사용자 경험을 개선한다`,
      `${topic}는 비용 효율성을 증가시킨다`,
      `${topic}는 확장성을 제공한다`,
    ],
    correctAnswer: `${topic}는 데이터 처리 속도를 향상시킨다`,
    source: {
      text: `${topic}는 효율적인 데이터 처리를 위한 핵심 기술입니다.`,
      reference: `${title} 학습 자료`,
    },
    examInfo: `${title} 2023년 예상 문제`,
    hint: `${topic}의 주요 목적을 생각해보세요.`,
  }
}

// Generate a sample short-answer question
function generateShortAnswerQuestion(index: number, title: string): Question {
  const terms = [
    "데이터베이스",
    "알고리즘",
    "네트워크",
    "보안",
    "소프트웨어 공학",
    "운영체제",
    "자료구조",
    "프로그래밍",
    "인공지능",
    "클라우드",
  ]

  const term = terms[index % terms.length]

  return {
    id: `q-${index + 1}`,
    type: "short-answer",
    question: `${title}에서 ${term}의 정의는 무엇인가?`,
    correctAnswer: term,
    source: {
      text: `${term}는 ${title}의 핵심 개념 중 하나입니다.`,
      reference: `${title} 학습 자료`,
    },
    examInfo: `${title} 2023년 예상 문제`,
    hint: `이 용어는 ${term.charAt(0)}로 시작합니다.`,
  }
}

