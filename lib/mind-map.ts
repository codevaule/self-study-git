import type { Node, Edge } from "reactflow"

/**
 * 마인드맵 노드 타입
 */
export interface MindMapNode {
  id: string
  text: string
  children: MindMapNode[]
  level: number
  keywords?: string[]
}

/**
 * 텍스트에서 키워드 추출
 * @param text 분석할 텍스트
 * @returns 추출된 키워드 배열
 */
export function extractKeywords(text: string): string[] {
  // 불용어 목록 (문제 생성에 적합하지 않은 일반적인 단어)
  const stopWords = new Set([
    "그",
    "이",
    "저",
    "것",
    "수",
    "등",
    "들",
    "및",
    "에서",
    "으로",
    "에게",
    "에게서",
    "또는",
    "그리고",
    "하지만",
    "때문에",
    "그래서",
    "따라서",
    "그러나",
    "그러므로",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "through",
    "over",
    "before",
    "between",
    "after",
    "since",
    "without",
    "이다",
    "있다",
    "하다",
    "되다",
    "않다",
  ])

  // 텍스트 전처리
  const cleanText = text
    .replace(/[^\w\s가-힣]/g, " ") // 특수문자 제거
    .replace(/\s+/g, " ") // 연속된 공백 제거
    .trim()

  // 단어 분리
  const words = cleanText.split(/\s+/)

  // 단어 빈도수 계산
  const wordFrequency: Record<string, number> = {}
  for (const word of words) {
    // 불용어, 짧은 단어 제외
    if (stopWords.has(word.toLowerCase()) || word.length < 2) continue
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  }

  // 빈도수 기준 정렬
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)

  // 상위 30개 키워드 반환
  return sortedWords.slice(0, 30)
}

/**
 * 텍스트에서 중요 문장 추출
 * @param text 분석할 텍스트
 * @returns 추출된 중요 문장 배열
 */
export function extractImportantSentences(text: string): string[] {
  // 문장 분리
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 10)

  // 문장 점수 계산
  const scoredSentences = sentences.map((sentence) => {
    let score = 0

    // 길이에 따른 점수
    if (sentence.length > 20 && sentence.length < 150) score += 2

    // 특정 패턴에 따른 점수
    if (/는\s|은\s|이란|란\s|정의|개념|의미|특징|종류|예시|예를들어|예를 들어/.test(sentence)) {
      score += 3 // 정의나 설명 문장
    }

    if (/중요|핵심|필수|반드시|꼭/.test(sentence)) {
      score += 2 // 중요성 강조 문장
    }

    if (/\d+/.test(sentence)) {
      score += 1 // 숫자 포함 문장
    }

    return { sentence, score }
  })

  // 점수 기준 정렬
  scoredSentences.sort((a, b) => b.score - a.score)

  // 상위 20개 문장 반환
  return scoredSentences.slice(0, 20).map((item) => item.sentence)
}

/**
 * 텍스트에서 마인드맵 구조 생성
 * @param text 분석할 텍스트
 * @param title 마인드맵 제목
 * @returns 마인드맵 루트 노드
 */
export function generateMindMap(text: string, title: string): MindMapNode {
  // 키워드 추출
  const keywords = extractKeywords(text)

  // 중요 문장 추출
  const importantSentences = extractImportantSentences(text)

  // 제목에서 주요 키워드 추출
  const titleKeywords = title
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1)

  // 마인드맵 루트 노드 생성
  const rootNode: MindMapNode = {
    id: "root",
    text: title,
    children: [],
    level: 0,
    keywords: titleKeywords,
  }

  // 주요 카테고리 생성 (최대 5개)
  const mainCategories = keywords.slice(0, 5)

  // 각 카테고리별 하위 노드 생성
  mainCategories.forEach((category, index) => {
    const categoryNode: MindMapNode = {
      id: `category-${index}`,
      text: category,
      children: [],
      level: 1,
      keywords: [category],
    }

    // 관련 키워드 찾기
    const relatedKeywords = keywords
      .filter(
        (keyword) =>
          keyword !== category &&
          importantSentences.some((sentence) => sentence.includes(category) && sentence.includes(keyword)),
      )
      .slice(0, 3)

    // 하위 노드 추가
    relatedKeywords.forEach((keyword, kidx) => {
      const childNode: MindMapNode = {
        id: `child-${index}-${kidx}`,
        text: keyword,
        children: [],
        level: 2,
        keywords: [keyword],
      }

      // 관련 문장 찾기
      const relatedSentence = importantSentences.find((sentence) => sentence.includes(keyword) && sentence.length < 100)

      if (relatedSentence) {
        childNode.children.push({
          id: `leaf-${index}-${kidx}`,
          text: relatedSentence,
          children: [],
          level: 3,
        })
      }

      categoryNode.children.push(childNode)
    })

    rootNode.children.push(categoryNode)
  })

  return rootNode
}

/**
 * 마인드맵 노드를 ReactFlow 노드로 변환
 * @param mindMap 마인드맵 노드
 * @returns ReactFlow 노드와 엣지 배열
 */
export function convertToReactFlow(mindMap: MindMapNode): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 노드 위치 계산을 위한 변수
  const levelGap = 200
  const siblingGap = 150

  // 노드 및 엣지 생성 함수
  const processNode = (node: MindMapNode, x: number, y: number, parentId?: string) => {
    // 노드 추가
    nodes.push({
      id: node.id,
      data: { label: node.text },
      position: { x, y },
      type: node.level === 0 ? "input" : node.level === 3 ? "output" : "default",
    })

    // 부모 노드와 연결하는 엣지 추가
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: "smoothstep",
      })
    }

    // 자식 노드 처리
    if (node.children.length > 0) {
      const childrenCount = node.children.length
      const totalWidth = (childrenCount - 1) * siblingGap
      const startX = x - totalWidth / 2

      node.children.forEach((child, index) => {
        const childX = startX + index * siblingGap
        const childY = y + levelGap
        processNode(child, childX, childY, node.id)
      })
    }
  }

  // 루트 노드부터 처리 시작
  processNode(mindMap, 0, 0)

  return { nodes, edges }
}

/**
 * 텍스트 요약 함수
 * @param text 요약할 텍스트
 * @param maxLength 최대 길이
 * @returns 요약된 텍스트
 */
export function summarizeText(text: string, maxLength = 500): string {
  // 중요 문장 추출
  const importantSentences = extractImportantSentences(text)

  // 요약 생성
  let summary = ""
  for (const sentence of importantSentences) {
    if (summary.length + sentence.length + 1 <= maxLength) {
      summary += sentence + " "
    } else {
      break
    }
  }

  return summary.trim()
}

