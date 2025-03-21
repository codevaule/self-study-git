import type { Question } from "@/types/study"

// 크로스워드 퍼즐 타입 정의
export type CrosswordPuzzle = {
  grid: string[][]
  size: number
  words: {
    word: string
    clue: string
    row: number
    col: number
    direction: "across" | "down"
  }[]
}

// 크로스워드 퍼즐 생성 함수
export async function generateCrosswordPuzzle(questions: Question[]): Promise<CrosswordPuzzle> {
  try {
    // 질문에서 단어와 힌트 추출
    const wordsAndClues = extractWordsAndClues(questions)

    // 최소 5개, 최대 15개의 단어 선택
    const selectedWords = selectWords(wordsAndClues, Math.min(wordsAndClues.length, 15))

    // 그리드 크기 결정 (최소 10x10, 최대 20x20)
    const gridSize = determineGridSize(selectedWords)

    // 빈 그리드 생성
    const grid = createEmptyGrid(gridSize)

    // 단어 배치
    const placedWords = placeWordsOnGrid(grid, selectedWords, gridSize)

    return {
      grid,
      size: gridSize,
      words: placedWords,
    }
  } catch (error) {
    console.error("크로스워드 퍼즐 생성 중 오류:", error)
    // 오류 발생 시 기본 퍼즐 반환
    return createDefaultPuzzle()
  }
}

// 질문에서 단어와 힌트 추출
function extractWordsAndClues(questions: Question[]): { word: string; clue: string }[] {
  if (!questions || !Array.isArray(questions)) {
    return []
  }

  return questions
    .filter((q) => q && q.answer && q.question) // null 체크
    .map((q) => {
      // 답변에서 공백 제거 및 대문자 변환
      const word = q.answer.replace(/\s+/g, "").toUpperCase()
      return {
        word,
        clue: q.question,
      }
    })
    .filter((item) => item.word.length >= 3 && item.word.length <= 12) // 적절한 길이의 단어만 선택
}

// 단어 선택
function selectWords(wordsAndClues: { word: string; clue: string }[], count: number): { word: string; clue: string }[] {
  if (!wordsAndClues || wordsAndClues.length === 0) {
    return []
  }

  // 단어 길이에 따라 정렬 (긴 단어부터)
  const sorted = [...wordsAndClues].sort((a, b) => b.word.length - a.word.length)

  // 최대 count개 선택
  return sorted.slice(0, count)
}

// 그리드 크기 결정
function determineGridSize(words: { word: string; clue: string }[]): number {
  if (!words || words.length === 0) {
    return 10 // 기본 크기
  }

  // 가장 긴 단어 길이 찾기
  const longestWordLength = Math.max(...words.map((w) => w.word.length))

  // 단어 수와 길이에 따라 크기 결정
  const baseSize = Math.max(10, longestWordLength + 2)
  const sizeByWordCount = Math.min(20, Math.max(10, Math.ceil(words.length * 1.5)))

  return Math.max(baseSize, sizeByWordCount)
}

// 빈 그리드 생성
function createEmptyGrid(size: number): string[][] {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(""))
}

// 단어 배치
function placeWordsOnGrid(grid: string[][], words: { word: string; clue: string }[], gridSize: number): any[] {
  if (!grid || !words || !Array.isArray(words) || words.length === 0) {
    return []
  }

  const placedWords = []
  const size = grid.length

  // 첫 번째 단어는 중앙에 가로로 배치
  if (words.length > 0) {
    const firstWord = words[0].word
    const row = Math.floor(size / 2)
    const col = Math.floor((size - firstWord.length) / 2)

    // 첫 단어 배치
    for (let i = 0; i < firstWord.length; i++) {
      if (col + i < size) {
        // 배열 범위 체크
        grid[row][col + i] = firstWord[i]
      }
    }

    placedWords.push({
      word: firstWord,
      clue: words[0].clue,
      row,
      col,
      direction: "across",
    })
  }

  // 나머지 단어 배치 시도
  for (let i = 1; i < words.length; i++) {
    const { word, clue } = words[i]
    let placed = false

    // 이미 배치된 단어와 교차점 찾기
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      // 랜덤 방향 선택 (가로 또는 세로)
      const direction = Math.random() > 0.5 ? "across" : "down"

      // 모든 그리드 위치 시도
      for (let r = 0; r < size && !placed; r++) {
        for (let c = 0; c < size && !placed; c++) {
          // 현재 위치에서 단어 배치 시도
          if (canPlaceWord(grid, word, r, c, direction, size)) {
            placeWord(grid, word, r, c, direction)
            placedWords.push({
              word,
              clue,
              row: r,
              col: c,
              direction,
            })
            placed = true
            break
          }
        }
      }
    }

    // 배치 실패 시 다음 단어로 넘어감
    if (!placed) {
      console.log(`단어 "${word}" 배치 실패`)
    }
  }

  return placedWords
}

// 단어 배치 가능 여부 확인
function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: string,
  gridSize: number,
): boolean {
  if (!grid || !word) return false

  const size = gridSize
  let intersections = 0

  // 가로 방향
  if (direction === "across") {
    // 단어가 그리드를 벗어나는지 확인
    if (col + word.length > size) return false

    // 단어 앞뒤에 다른 글자가 있는지 확인
    if (col > 0 && grid[row][col - 1] !== "") return false
    if (col + word.length < size && grid[row][col + word.length] !== "") return false

    // 각 글자 위치 확인
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[row][col + i]

      // 빈 칸이거나 같은 글자인 경우만 허용
      if (currentCell !== "" && currentCell !== word[i]) return false

      // 위아래에 다른 글자가 있는지 확인 (교차점이 아닌 경우)
      if (currentCell === "") {
        if (row > 0 && grid[row - 1][col + i] !== "") return false
        if (row < size - 1 && grid[row + 1][col + i] !== "") return false
      } else {
        // 교차점 발견
        intersections++
      }
    }
  }
  // 세로 방향
  else if (direction === "down") {
    // 단어가 그리드를 벗어나는지 확인
    if (row + word.length > size) return false

    // 단어 앞뒤에 다른 글자가 있는지 확인
    if (row > 0 && grid[row - 1][col] !== "") return false
    if (row + word.length < size && grid[row + word.length][col] !== "") return false

    // 각 글자 위치 확인
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[row + i][col]

      // 빈 칸이거나 같은 글자인 경우만 허용
      if (currentCell !== "" && currentCell !== word[i]) return false

      // 좌우에 다른 글자가 있는지 확인 (교차점이 아닌 경우)
      if (currentCell === "") {
        if (col > 0 && grid[row + i][col - 1] !== "") return false
        if (col < size - 1 && grid[row + i][col + 1] !== "") return false
      } else {
        // 교차점 발견
        intersections++
      }
    }
  }

  // 첫 번째 단어가 아니라면 최소 1개 이상의 교차점이 필요
  return intersections > 0 || placedWords.length === 0
}

// 단어 배치
function placeWord(grid: string[][], word: string, row: number, col: number, direction: string): void {
  if (!grid || !word) return

  if (direction === "across") {
    for (let i = 0; i < word.length; i++) {
      if (row < grid.length && col + i < grid[row].length) {
        // 배열 범위 체크
        grid[row][col + i] = word[i]
      }
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      if (row + i < grid.length && col < grid[row + i].length) {
        // 배열 범위 체크
        grid[row + i][col] = word[i]
      }
    }
  }
}

// 기본 퍼즐 생성 (오류 발생 시 대체용)
function createDefaultPuzzle(): CrosswordPuzzle {
  const size = 5
  const grid = createEmptyGrid(size)

  // 간단한 기본 퍼즐 설정
  const words = [
    { word: "STUDY", clue: "학습하는 행위", row: 0, col: 0, direction: "across" as const },
    { word: "SMART", clue: "똑똑한", row: 0, col: 0, direction: "down" as const },
  ]

  // 단어 배치
  grid[0][0] = "S"
  grid[0][1] = "T"
  grid[0][2] = "U"
  grid[0][3] = "D"
  grid[0][4] = "Y"

  grid[1][0] = "M"
  grid[2][0] = "A"
  grid[3][0] = "R"
  grid[4][0] = "T"

  return {
    grid,
    size,
    words,
  }
}

// 전역 변수 선언
const placedWords: any[] = []

