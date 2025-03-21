"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { CrosswordPuzzle } from "@/lib/crossword-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function CrosswordPage() {
  const params = useParams()
  const sessionId = params?.sessionId as string

  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [userAnswers, setUserAnswers] = useState<string[][]>([])
  const [activeDirection, setActiveDirection] = useState<"across" | "down">("across")
  const [activeClue, setActiveClue] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)

  // 퍼즐 데이터 가져오기
  useEffect(() => {
    async function fetchPuzzle() {
      try {
        setLoading(true)
        const response = await fetch(`/api/crossword/${sessionId}`)

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`)
        }

        const data = await response.json()

        // 데이터 유효성 검사
        if (!data.puzzle || !data.puzzle.grid || !data.puzzle.words) {
          throw new Error("유효하지 않은 퍼즐 데이터")
        }

        setPuzzle(data.puzzle)

        // 사용자 답변 초기화
        const emptyAnswers = Array(data.puzzle.size)
          .fill(null)
          .map(() => Array(data.puzzle.size).fill(""))
        setUserAnswers(emptyAnswers)
      } catch (err) {
        console.error("퍼즐 가져오기 오류:", err)
        setError(`퍼즐을 불러오는 중 오류가 발생했습니다: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchPuzzle()
    }
  }, [sessionId])

  // 셀 클릭 핸들러
  const handleCellClick = (row: number, col: number) => {
    if (!puzzle || !puzzle.grid) return

    // 빈 셀은 선택 불가
    if (puzzle.grid[row][col] === "") return

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      // 같은 셀 클릭 시 방향 전환
      setActiveDirection(activeDirection === "across" ? "down" : "across")
    } else {
      setSelectedCell({ row, col })

      // 현재 셀에 해당하는 단어 찾기
      const acrossWord = puzzle.words.find(
        (w) => w.direction === "across" && w.row === row && w.col <= col && w.col + w.word.length > col,
      )

      const downWord = puzzle.words.find(
        (w) => w.direction === "down" && w.col === col && w.row <= row && w.row + w.word.length > row,
      )

      // 방향 결정
      if (acrossWord && downWord) {
        // 두 방향 모두 가능한 경우 현재 활성 방향 유지
      } else if (acrossWord) {
        setActiveDirection("across")
      } else if (downWord) {
        setActiveDirection("down")
      }

      // 활성 단서 설정
      const activeWord = activeDirection === "across" ? acrossWord : downWord
      if (activeWord) {
        setActiveClue(puzzle.words.indexOf(activeWord))
      }
    }
  }

  // 키보드 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell || !puzzle) return

    const { row, col } = selectedCell
    const { size } = puzzle

    // 알파벳 입력
    if (/^[A-Za-z]$/.test(e.key)) {
      const letter = e.key.toUpperCase()

      // 사용자 답변 업데이트
      const newAnswers = [...userAnswers]
      newAnswers[row][col] = letter
      setUserAnswers(newAnswers)

      // 다음 셀로 이동
      moveToNextCell()
    }
    // 백스페이스
    else if (e.key === "Backspace") {
      // 현재 셀 지우기
      const newAnswers = [...userAnswers]
      newAnswers[row][col] = ""
      setUserAnswers(newAnswers)

      // 이전 셀로 이동
      moveToPrevCell()
    }
    // 화살표 키
    else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault()

      let newRow = row
      let newCol = col

      switch (e.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1)
          break
        case "ArrowDown":
          newRow = Math.min(size - 1, row + 1)
          break
        case "ArrowLeft":
          newCol = Math.max(0, col - 1)
          break
        case "ArrowRight":
          newCol = Math.min(size - 1, col + 1)
          break
      }

      // 빈 셀이 아닌 경우에만 이동
      if (puzzle.grid[newRow][newCol] !== "") {
        setSelectedCell({ row: newRow, col: newCol })
      }
    }
    // 탭 키
    else if (e.key === "Tab") {
      e.preventDefault()
      // 다음 단서로 이동
      moveToNextClue(e.shiftKey)
    }
  }

  // 다음 셀로 이동
  const moveToNextCell = () => {
    if (!selectedCell || !puzzle) return

    const { row, col } = selectedCell
    const { size } = puzzle

    if (activeDirection === "across") {
      // 가로 방향일 때 오른쪽으로 이동
      if (col < size - 1 && puzzle.grid[row][col + 1] !== "") {
        setSelectedCell({ row, col: col + 1 })
      }
    } else {
      // 세로 방향일 때 아래로 이동
      if (row < size - 1 && puzzle.grid[row + 1][col] !== "") {
        setSelectedCell({ row: row + 1, col })
      }
    }
  }

  // 이전 셀로 이동
  const moveToPrevCell = () => {
    if (!selectedCell || !puzzle) return

    const { row, col } = selectedCell

    if (activeDirection === "across") {
      // 가로 방향일 때 왼쪽으로 이동
      if (col > 0 && puzzle.grid[row][col - 1] !== "") {
        setSelectedCell({ row, col: col - 1 })
      }
    } else {
      // 세로 방향일 때 위로 이동
      if (row > 0 && puzzle.grid[row - 1][col] !== "") {
        setSelectedCell({ row: row - 1, col })
      }
    }
  }

  // 다음 단서로 이동
  const moveToNextClue = (reverse = false) => {
    if (!puzzle || activeClue === null) return

    const { words } = puzzle
    let nextIndex

    if (reverse) {
      // 이전 단서
      nextIndex = (activeClue - 1 + words.length) % words.length
    } else {
      // 다음 단서
      nextIndex = (activeClue + 1) % words.length
    }

    const nextWord = words[nextIndex]
    setActiveClue(nextIndex)
    setActiveDirection(nextWord.direction)
    setSelectedCell({ row: nextWord.row, col: nextWord.col })
  }

  // 단서 클릭 핸들러
  const handleClueClick = (index: number) => {
    if (!puzzle) return

    const word = puzzle.words[index]
    setActiveClue(index)
    setActiveDirection(word.direction)
    setSelectedCell({ row: word.row, col: word.col })
  }

  // 정답 확인
  const checkAnswers = () => {
    if (!puzzle) return

    const { grid, size } = puzzle
    let allCorrect = true

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== "" && userAnswers[r][c] !== grid[r][c]) {
          allCorrect = false
          break
        }
      }
      if (!allCorrect) break
    }

    setCompleted(allCorrect)

    if (allCorrect) {
      alert("축하합니다! 모든 답을 맞추셨습니다!")
    } else {
      alert("아직 모든 답을 맞추지 못했습니다. 다시 시도해보세요.")
    }
  }

  // 힌트 보기
  const showHint = () => {
    if (!selectedCell || !puzzle) return

    const { row, col } = selectedCell
    const correctLetter = puzzle.grid[row][col]

    if (correctLetter) {
      const newAnswers = [...userAnswers]
      newAnswers[row][col] = correctLetter
      setUserAnswers(newAnswers)
    }
  }

  // 퍼즐 리셋
  const resetPuzzle = () => {
    if (!puzzle) return

    const emptyAnswers = Array(puzzle.size)
      .fill(null)
      .map(() => Array(puzzle.size).fill(""))
    setUserAnswers(emptyAnswers)
    setCompleted(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">크로스워드 퍼즐을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>퍼즐 데이터를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-3xl font-bold mb-6 text-center">크로스워드 퍼즐</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 퍼즐 그리드 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>퍼즐</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div
                  className="grid gap-0 border border-gray-300"
                  style={{
                    gridTemplateColumns: `repeat(${puzzle.size}, minmax(30px, 1fr))`,
                    width: "100%",
                    maxWidth: "600px",
                  }}
                >
                  {Array.from({ length: puzzle.size }).map((_, rowIndex) =>
                    Array.from({ length: puzzle.size }).map((_, colIndex) => {
                      const isBlackCell = !puzzle.grid[rowIndex] || puzzle.grid[rowIndex][colIndex] === ""
                      const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex

                      // 단어 번호 찾기
                      const wordNumber =
                        puzzle.words.findIndex(
                          (word) =>
                            (word.row === rowIndex && word.col === colIndex) ||
                            (word.direction === "down" &&
                              word.col === colIndex &&
                              word.row === rowIndex &&
                              rowIndex === word.row),
                        ) + 1

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            relative flex items-center justify-center
                            border border-gray-300 aspect-square
                            ${isBlackCell ? "bg-gray-900" : "bg-white"}
                            ${isSelected ? "bg-blue-200" : ""}
                            ${completed ? "bg-green-100" : ""}
                          `}
                          onClick={() => !isBlackCell && handleCellClick(rowIndex, colIndex)}
                        >
                          {!isBlackCell && (
                            <>
                              {wordNumber > 0 && (
                                <span className="absolute top-0 left-0 text-xs p-0.5">{wordNumber}</span>
                              )}
                              <span className="text-xl font-bold">{userAnswers[rowIndex]?.[colIndex] || ""}</span>
                            </>
                          )}
                        </div>
                      )
                    }),
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={checkAnswers}>정답 확인</Button>
                <Button onClick={showHint} variant="outline">
                  힌트 보기
                </Button>
                <Button onClick={resetPuzzle} variant="outline">
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 단서 목록 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>단서</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="across">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="across">가로</TabsTrigger>
                  <TabsTrigger value="down">세로</TabsTrigger>
                </TabsList>

                <TabsContent value="across">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {puzzle.words
                      .filter((word) => word.direction === "across")
                      .map((word, index) => {
                        const wordIndex = puzzle.words.indexOf(word) + 1
                        const isActive = activeClue === puzzle.words.indexOf(word)

                        return (
                          <div
                            key={`across-${index}`}
                            className={`p-2 rounded cursor-pointer ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
                            onClick={() => handleClueClick(puzzle.words.indexOf(word))}
                          >
                            <span className="font-bold mr-2">{wordIndex}.</span>
                            {word.clue}
                          </div>
                        )
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="down">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {puzzle.words
                      .filter((word) => word.direction === "down")
                      .map((word, index) => {
                        const wordIndex = puzzle.words.indexOf(word) + 1
                        const isActive = activeClue === puzzle.words.indexOf(word)

                        return (
                          <div
                            key={`down-${index}`}
                            className={`p-2 rounded cursor-pointer ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
                            onClick={() => handleClueClick(puzzle.words.indexOf(word))}
                          >
                            <span className="font-bold mr-2">{wordIndex}.</span>
                            {word.clue}
                          </div>
                        )
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

