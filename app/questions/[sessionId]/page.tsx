"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  FileText,
  Calendar,
  BrainCircuit,
} from "lucide-react"
import {
  getStudySession,
  updateStudySession,
  updateStudyPlanProgress,
  getTodayQuestionCount,
} from "@/lib/study-session"
import { generateQuestions } from "@/lib/question-generator"
import type { Question } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import StudyProgress from "./study-progress"

export default function QuestionsPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [shortAnswer, setShortAnswer] = useState<string>("")
  const [isMarked, setIsMarked] = useState(false)
  const [feedback, setFeedback] = useState<{ status: "correct" | "incorrect" | ""; message: string }>({
    status: "",
    message: "",
  })
  const [attempts, setAttempts] = useState(0)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingSample, setIsGeneratingSample] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedToday, setCompletedToday] = useState(0)
  const [todayQuestionInfo, setTodayQuestionInfo] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)

  // 정답률 계산 로직 수정 (기존 코드의 일부만 수정)
  const calculatePercentage = (correct: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((correct / total) * 100)
  }

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getStudySession(params.sessionId)
        if (!sessionData) {
          router.push("/")
          return
        }

        setSession(sessionData)

        // 학습 계획이 있는 경우 오늘의 문제 정보 로드
        if (sessionData.studyPlan) {
          const todayInfo = await getTodayQuestionCount(params.sessionId)
          setTodayQuestionInfo(todayInfo)
          setCompletedToday(todayInfo?.completed || 0)
        }

        try {
          // 문제 수 설정 (학습 계획 또는 사용자 지정)
          const questionCount = sessionData.totalQuestions || 10

          // Generate questions based on the content
          let generatedQuestions
          try {
            generatedQuestions = await generateQuestions({
              content: sessionData.content,
              title: sessionData.title,
              type: sessionData.questionType || "multiple-choice",
              count: questionCount,
              fileName: sessionData.fileName || "업로드된 문서",
            })
          } catch (genError: any) {
            console.warn("문제 생성 중 오류 발생, 샘플 문제로 대체합니다:", genError)

            // 할당량 초과 오류 메시지 표시
            if (genError.message && genError.message.includes("QUOTA_EXCEEDED")) {
              setError("API 할당량이 초과되었습니다. 샘플 문제가 대신 생성됩니다.")
              setIsGeneratingSample(true)
            } else {
              setError("문제 생성 중 오류가 발생했습니다. 샘플 문제가 대신 생성됩니다.")
              setIsGeneratingSample(true)
            }

            // 오류 발생 시 샘플 문제 생성
            generatedQuestions = await generateQuestions({
              content: sessionData.content,
              title: sessionData.title,
              type: sessionData.questionType || "multiple-choice",
              count: questionCount,
              fileName: sessionData.fileName || "업로드된 문서",
            })
          }

          if (!generatedQuestions || generatedQuestions.length === 0) {
            throw new Error("문제를 생성할 수 없습니다.")
          }

          setQuestions(generatedQuestions)

          // 샘플 문제 생성 여부 확인
          if (
            generatedQuestions.length > 0 &&
            generatedQuestions[0].id === "q-1" &&
            generatedQuestions[0].source?.reference?.includes("자동 생성된 샘플 문제")
          ) {
            setIsGeneratingSample(true)
          }

          // If continuing from last session, set the current index
          if (sessionData.studyMode === "continue" && sessionData.lastQuestionIndex) {
            setCurrentIndex(sessionData.lastQuestionIndex)
          }

          // If only showing incorrect or marked questions, filter the questions
          if (sessionData.studyMode === "incorrect" && sessionData.questionHistory) {
            const incorrectQuestions = generatedQuestions.filter(
              (q) => sessionData.questionHistory[q.id]?.isCorrect === false,
            )
            // If no incorrect questions found, show all questions
            setQuestions(incorrectQuestions.length > 0 ? incorrectQuestions : generatedQuestions)
          } else if (sessionData.studyMode === "marked" && sessionData.questionHistory) {
            const markedQuestions = generatedQuestions.filter(
              (q) => sessionData.questionHistory[q.id]?.isMarked === true,
            )
            // If no marked questions found, show all questions
            setQuestions(markedQuestions.length > 0 ? markedQuestions : generatedQuestions)
          }

          // Set initial stats
          if (sessionData.questionHistory) {
            const correct = Object.values(sessionData.questionHistory).filter((q: any) => q.isCorrect).length
            setStats({ correct, total: generatedQuestions.length })
          }
        } catch (questionError: any) {
          console.error("문제 생성 오류:", questionError)

          // 오류 메시지 설정 - 할당량 초과 오류 특별 처리
          if (questionError.message && questionError.message.includes("QUOTA_EXCEEDED")) {
            setError("API 할당량이 초과되었습니다. 샘플 문제가 생성됩니다.")
          } else {
            setError("문제를 생성하는 중 오류가 발생했습니다. 샘플 문제가 생성됩니다.")
          }

          setIsGeneratingSample(true)

          // 샘플 문제 생성
          try {
            const sampleQuestions = await generateQuestions({
              content: sessionData.content,
              title: sessionData.title,
              type: sessionData.questionType || "multiple-choice",
              count: sessionData.totalQuestions || 10,
              fileName: sessionData.fileName || "업로드된 문서",
            })

            if (sampleQuestions && sampleQuestions.length > 0) {
              setQuestions(sampleQuestions)
              // 오류 메시지는 유지하여 사용자에게 샘플 문제임을 알림
            } else {
              throw new Error("샘플 문제를 생성할 수 없습니다.")
            }
          } catch (sampleError) {
            console.error("샘플 문제 생성 오류:", sampleError)
            setError("문제를 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.")
          }
        }
      } catch (error: any) {
        console.error("세션 로드 오류:", error)

        // 할당량 초과 오류 특별 처리
        if (error.message && error.message.includes("QUOTA_EXCEEDED")) {
          setError("API 할당량이 초과되었습니다. 샘플 문제가 생성됩니다.")
        } else {
          setError("세션을 로드하는 중 오류가 발생했습니다.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [params.sessionId, router, retryCount])

  useEffect(() => {
    // Reset state when moving to a new question
    if (questions.length > 0) {
      setSelectedAnswer("")
      setShortAnswer("")
      setFeedback({ status: "", message: "" })
      setAttempts(0)
      setShowHint(false)

      // Check if the current question is marked
      const currentQuestion = questions[currentIndex]
      if (session?.questionHistory?.[currentQuestion.id]?.isMarked) {
        setIsMarked(true)
      } else {
        setIsMarked(false)
      }
    }
  }, [currentIndex, questions, session])

  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentIndex]

    if (!currentQuestion) return

    let isCorrect = false

    if (currentQuestion.type === "multiple-choice") {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer
    } else {
      // 주관식 답변 처리 개선
      const userAnswer = shortAnswer.trim().toLowerCase()
      const correctAnswer = currentQuestion.correctAnswer.toLowerCase()

      // 키워드 기반 유사도 검사 (더 정확한 방식으로 개선)
      const userKeywords = userAnswer.split(/\s+/).filter((word) => word.length > 1)
      const correctKeywords = correctAnswer.split(/\s+/).filter((word) => word.length > 1)

      // 핵심 키워드 일치 여부 확인
      const matchedKeywords = userKeywords.filter((word) =>
        correctKeywords.some((correctWord) => correctWord.includes(word) || word.includes(correctWord)),
      )

      // 핵심 키워드의 50% 이상 일치하면 정답으로 인정
      isCorrect = matchedKeywords.length >= Math.max(1, Math.floor(correctKeywords.length * 0.5))
    }

    if (isCorrect) {
      setFeedback({
        status: "correct",
        message: "정답입니다! 다음 문제로 이동합니다...",
      })

      // Update stats
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }))

      // 학습 계획이 있는 경우 완료 문제 수 업데이트
      if (session?.studyPlan) {
        setCompletedToday((prev) => prev + 1)
        updateStudyPlanProgress(params.sessionId, 1)
      }

      // Save progress
      saveProgress(currentQuestion.id, true)

      // Move to next question after a delay
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          // Show completion screen
          showCompletionScreen()
        }
      }, 1500)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        setFeedback({
          status: "incorrect",
          message: `정답은: ${currentQuestion.correctAnswer} 입니다`,
        })

        // Save progress
        saveProgress(currentQuestion.id, false)

        // Move to next question after a delay
        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
          } else {
            // Show completion screen
            showCompletionScreen()
          }
        }, 3000)
      } else {
        setFeedback({
          status: "incorrect",
          message: "틀렸습니다. 다시 시도해보세요.",
        })
      }
    }
  }

  const handleSkip = () => {
    const currentQuestion = questions[currentIndex]

    setFeedback({
      status: "incorrect",
      message: `정답은: ${currentQuestion.correctAnswer} 입니다`,
    })

    // Save progress
    saveProgress(currentQuestion.id, false)

    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Show completion screen
        showCompletionScreen()
      }
    }, 2000)
  }

  const toggleMark = () => {
    const currentQuestion = questions[currentIndex]
    const newMarkedState = !isMarked
    setIsMarked(newMarkedState)

    // Update the question history
    const updatedHistory = {
      ...(session.questionHistory || {}),
      [currentQuestion.id]: {
        ...(session.questionHistory?.[currentQuestion.id] || {}),
        isMarked: newMarkedState,
      },
    }

    // Update the session
    updateStudySession(params.sessionId, {
      ...session,
      questionHistory: updatedHistory,
    })
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  const saveProgress = async (questionId: string, isCorrect: boolean) => {
    // Update the question history
    const updatedHistory = {
      ...(session.questionHistory || {}),
      [questionId]: {
        ...(session.questionHistory?.[questionId] || {}),
        isCorrect,
        isMarked,
        timestamp: new Date().toISOString(),
      },
    }

    // Update the session
    await updateStudySession(params.sessionId, {
      ...session,
      lastQuestionIndex: currentIndex + 1,
      questionHistory: updatedHistory,
    })
  }

  const showCompletionScreen = () => {
    router.push(`/completion/${params.sessionId}`)
  }

  const handleStopStudying = async () => {
    // Save the current progress
    await updateStudySession(params.sessionId, {
      ...session,
      lastQuestionIndex: currentIndex,
    })

    // Redirect to the sessions page
    router.push("/sessions")
  }

  const handleRetryGeneration = () => {
    setIsLoading(true)
    setError(null)
    setRetryCount((prev) => prev + 1) // 이 값을 변경하면 useEffect가 다시 실행됨
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">문제 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>문제 생성 실패</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 space-y-4">
              <p className="text-sm">다음 중 하나의 방법을 시도해 보세요:</p>
              <div className="grid gap-3">
                <Button onClick={handleRetryGeneration} className="w-full gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  샘플 문제로 다시 시도
                </Button>
                <Button onClick={() => router.push("/upload")} variant="outline" className="w-full">
                  새 콘텐츠 업로드
                </Button>
                <Button onClick={() => router.push("/sessions")} variant="ghost" className="w-full">
                  학습 세션 목록으로 돌아가기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>사용 가능한 문제 없음</CardTitle>
          </CardHeader>
          <CardContent>
            <p>이 학습 모드에 사용할 수 있는 문제가 없습니다. 다른 모드를 시도하거나 새 콘텐츠를 업로드하세요.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/upload")} className="w-full">
              새 콘텐츠 업로드
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{session?.title}</h2>
            <p className="text-sm text-muted-foreground">
              {currentQuestion?.type === "multiple-choice" ? "객관식" : "주관식"} 문제
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {questions.length}
            </span>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="w-24" />
          </div>
        </div>

        {isGeneratingSample && (
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertTitle>샘플 문제 모드</AlertTitle>
            <AlertDescription>
              OpenAI API 키가 설정되지 않았거나 할당량이 초과되어 샘플 문제가 생성되었습니다. 실제 콘텐츠 기반 문제를
              생성하려면 OpenAI API 키를 설정하세요.
            </AlertDescription>
          </Alert>
        )}

        {session?.studyPlan && <StudyProgress studyPlan={session.studyPlan} completedToday={completedToday} />}

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">문제 {currentIndex + 1}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleHint}
                  className="text-muted-foreground hover:text-primary"
                  title="힌트 보기"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">힌트 보기</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMark}
                  className="text-muted-foreground hover:text-primary"
                  title={isMarked ? "문제 표시 해제" : "문제 표시"}
                >
                  {isMarked ? <BookmarkCheck className="h-5 w-5 fill-primary" /> : <Bookmark className="h-5 w-5" />}
                  <span className="sr-only">{isMarked ? "문제 표시 해제" : "문제 표시"}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion?.question}</div>

            {showHint && currentQuestion?.hint && (
              <Alert className="bg-blue-50 border-blue-200">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle>힌트</AlertTitle>
                <AlertDescription>{currentQuestion.hint}</AlertDescription>
              </Alert>
            )}

            {currentQuestion?.type === "multiple-choice" ? (
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
                disabled={feedback.status !== ""}
              >
                {currentQuestion?.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors ${
                      feedback.status === "correct" && option === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : feedback.status === "incorrect" && option === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : feedback.status === "incorrect" && option === selectedAnswer
                            ? "border-red-500 bg-red-50"
                            : ""
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {feedback.status === "correct" && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {feedback.status === "incorrect" && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {feedback.status === "incorrect" &&
                      option === selectedAnswer &&
                      option !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="답변을 입력하세요..."
                  value={shortAnswer}
                  onChange={(e) => setShortAnswer(e.target.value)}
                  disabled={feedback.status !== ""}
                  className={`p-4 text-lg ${
                    feedback.status === "correct"
                      ? "border-green-500"
                      : feedback.status === "incorrect"
                        ? "border-red-500"
                        : ""
                  }`}
                />
                {feedback.status !== "" && (
                  <div className="text-sm font-medium">정답: {currentQuestion.correctAnswer}</div>
                )}
              </div>
            )}

            {feedback.status && (
              <div
                className={`flex items-center gap-2 p-4 rounded-md ${
                  feedback.status === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {feedback.status === "correct" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p>{feedback.message}</p>
              </div>
            )}

            {/* 출처 및 시험 정보 표시 (정답 확인 후) */}
            {feedback.status !== "" && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="source">
                  <AccordionTrigger className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>출처 및 참고 자료</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-muted rounded-md text-sm space-y-2">
                      {currentQuestion.source && (
                        <>
                          <p className="font-medium">관련 내용:</p>
                          <p className="text-muted-foreground">{currentQuestion.source.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{currentQuestion.source.reference}</p>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {currentQuestion.examInfo && (
                  <AccordionItem value="exam-info">
                    <AccordionTrigger className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>시험 출제 정보</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <p>{currentQuestion.examInfo}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button variant="outline" className="sm:w-auto w-full" onClick={handleStopStudying}>
              학습 중단
            </Button>

            <div className="flex gap-3 sm:w-auto w-full">
              {feedback.status === "" && (
                <>
                  <Button variant="outline" className="flex-1" onClick={handleSkip}>
                    건너뛰기
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCheckAnswer}
                    disabled={currentQuestion?.type === "multiple-choice" ? !selectedAnswer : !shortAnswer.trim()}
                  >
                    정답 확인
                  </Button>
                </>
              )}

              {feedback.status !== "" && currentIndex < questions.length - 1 && (
                <Button className="flex-1 gap-2" onClick={() => setCurrentIndex(currentIndex + 1)}>
                  다음 문제
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {feedback.status !== "" && currentIndex === questions.length - 1 && (
                <Button className="flex-1" onClick={showCompletionScreen}>
                  결과 보기
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* 통계 표시 부분 (기존 코드의 일부만 수정) */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            정답: {stats.correct} / {stats.total} ({calculatePercentage(stats.correct, stats.total)}%)
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentIndex < questions.length - 1 && setCurrentIndex(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1 || feedback.status === ""}
              className="gap-1"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

