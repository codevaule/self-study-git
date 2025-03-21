"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, BookmarkCheck, Home, RotateCcw, CalendarDays } from "lucide-react"
import { getStudySession, updateStudyPlanProgress } from "@/lib/study-session"

export default function CompletionPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    marked: 0,
    total: 0,
    percentage: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getStudySession(params.sessionId)
        if (!sessionData) {
          router.push("/")
          return
        }

        setSession(sessionData)

        // Calculate stats
        if (sessionData.questionHistory) {
          const history = Object.values(sessionData.questionHistory) as any[]
          const correct = history.filter((q) => q.isCorrect).length
          const incorrect = history.filter((q) => q.isCorrect === false).length
          const marked = history.filter((q) => q.isMarked).length
          const total = history.length
          const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

          setStats({
            correct,
            incorrect,
            marked,
            total,
            percentage,
          })

          // 학습 계획이 있는 경우 진행 상황 업데이트
          if (sessionData.studyPlan) {
            // 완료한 문제 수 업데이트
            await updateStudyPlanProgress(params.sessionId, 0) // 이미 카운트된 문제이므로 0 전달
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [params.sessionId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">결과 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">학습 세션 완료</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">{stats.percentage}%</h2>
              <p className="text-muted-foreground">정답률</p>
            </div>

            <Progress value={stats.percentage} className="h-3" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">정답</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.incorrect}</div>
                <div className="text-sm text-muted-foreground">오답</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.marked}</div>
                <div className="text-sm text-muted-foreground">표시됨</div>
              </div>
            </div>

            {session?.studyPlan && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium flex items-center gap-2 text-blue-800 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  학습 계획 진행 상황
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-blue-700">학습 일차</p>
                    <p className="text-xl font-bold text-blue-900">
                      {session.studyPlan.currentDay}/{session.studyPlan.totalDays}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">완료한 문제</p>
                    <p className="text-xl font-bold text-blue-900">
                      {session.studyPlan.completedToday}/
                      {session.studyPlan.questionsPerDay + session.studyPlan.carryOver}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-700">
                  {session.studyPlan.carryOver > 0 ? (
                    <p>다음 날로 이월된 문제: {session.studyPlan.carryOver}문제</p>
                  ) : (
                    <p>오늘의 목표를 모두 달성했습니다! 👏</p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-lg font-medium">{session?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()} • {stats.total}개 문제
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="sm:flex-1 w-full gap-2" onClick={() => router.push("/")}>
              <Home className="h-4 w-4" />
              홈으로
            </Button>
            <Button
              className="sm:flex-1 w-full gap-2"
              onClick={() => router.push(`/question-type/${params.sessionId}`)}
            >
              <RotateCcw className="h-4 w-4" />
              다시 학습하기
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">모든 문제</TabsTrigger>
            <TabsTrigger value="incorrect">오답</TabsTrigger>
            <TabsTrigger value="marked">표시됨</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {session?.questionHistory &&
              Object.entries(session.questionHistory).map(([id, data]: [string, any]) => (
                <Card key={id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {data.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                      )}
                      <div className="space-y-1 flex-1">
                        <div className="font-medium">문제 {id.split("-")[1]}</div>
                        <div className="text-sm text-muted-foreground">
                          {data.isMarked && (
                            <span className="flex items-center gap-1 text-primary">
                              <BookmarkCheck className="h-4 w-4" /> 표시됨
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        {new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="incorrect" className="space-y-4">
            {session?.questionHistory &&
              Object.entries(session.questionHistory)
                .filter(([_, data]: [string, any]) => !data.isCorrect)
                .map(([id, data]: [string, any]) => (
                  <Card key={id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                        <div className="space-y-1 flex-1">
                          <div className="font-medium">문제 {id.split("-")[1]}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.isMarked && (
                              <span className="flex items-center gap-1 text-primary">
                                <BookmarkCheck className="h-4 w-4" /> 표시됨
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm">
                          {new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            {session?.questionHistory &&
              !Object.entries(session.questionHistory).some(([_, data]: [string, any]) => !data.isCorrect) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>오답이 없습니다. 잘 하셨습니다!</p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="marked" className="space-y-4">
            {session?.questionHistory &&
              Object.entries(session.questionHistory)
                .filter(([_, data]: [string, any]) => data.isMarked)
                .map(([id, data]: [string, any]) => (
                  <Card key={id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {data.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                        )}
                        <div className="space-y-1 flex-1">
                          <div className="font-medium">문제 {id.split("-")[1]}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 text-primary">
                              <BookmarkCheck className="h-4 w-4" /> 표시됨
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          {new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            {session?.questionHistory &&
              !Object.entries(session.questionHistory).some(([_, data]: [string, any]) => data.isMarked) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>표시된 문제가 없습니다.</p>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

