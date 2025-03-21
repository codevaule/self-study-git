"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ListChecks, FileText, ArrowRight } from "lucide-react"
import { getStudySession, updateStudySession } from "@/lib/study-session"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudyPlanForm from "./study-plan-form"

export default function QuestionTypePage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [questionType, setQuestionType] = useState<string>("multiple-choice")
  const [studyMode, setStudyMode] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("question-type")
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [totalQuestions, setTotalQuestions] = useState(10)

  // 세션 로드 - useState를 useEffect로 수정
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getStudySession(params.sessionId)
        if (sessionData) {
          setSession(sessionData)

          // 기존 설정이 있으면 로드
          if (sessionData.questionType) {
            setQuestionType(sessionData.questionType)
          }
          if (sessionData.studyMode) {
            setStudyMode(sessionData.studyMode)
          }
          if (sessionData.totalQuestions) {
            setTotalQuestions(sessionData.totalQuestions)
          }
          if (sessionData.studyPlan) {
            setStudyPlan(sessionData.studyPlan)
          }
        }
      } catch (error) {
        console.error("세션 로드 오류:", error)
      }
    }

    loadSession()
  }, [params.sessionId])

  // 학습 계획 설정 처리
  const handleStudyPlanSubmit = (plan: any) => {
    setStudyPlan(
      plan.useStudyPlan
        ? {
            totalDays: plan.totalDays,
            questionsPerDay: plan.questionsPerDay,
            currentDay: 1,
            startDate: new Date().toISOString(),
            completedToday: 0,
            carryOver: 0,
          }
        : null,
    )

    setTotalQuestions(plan.totalQuestions)
    setActiveTab("question-type")
  }

  const handleContinue = async () => {
    setIsLoading(true)

    try {
      // Get the current session
      const session = await getStudySession(params.sessionId)

      if (!session) {
        throw new Error("Session not found")
      }

      // Update the session with question type, study mode, and study plan
      await updateStudySession(params.sessionId, {
        ...session,
        questionType,
        studyMode,
        studyPlan,
        totalQuestions,
      })

      // Redirect to the questions page
      router.push(`/questions/${params.sessionId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">학습 설정</CardTitle>
          <CardDescription>학습 방식과 문제 유형을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="question-type">문제 유형</TabsTrigger>
              <TabsTrigger value="study-plan">학습 계획</TabsTrigger>
            </TabsList>

            <TabsContent value="question-type" className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">문제 형식</h3>
                <RadioGroup
                  defaultValue="multiple-choice"
                  value={questionType}
                  onValueChange={setQuestionType}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                    <Label htmlFor="multiple-choice" className="flex items-center gap-2 cursor-pointer">
                      <ListChecks className="h-5 w-5" />
                      <div>
                        <p className="font-medium">객관식</p>
                        <p className="text-sm text-muted-foreground">문제당 5개 선택지</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="short-answer" id="short-answer" />
                    <Label htmlFor="short-answer" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">주관식</p>
                        <p className="text-sm text-muted-foreground">용어 중심 문제</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">학습 모드</h3>
                <RadioGroup defaultValue="all" value={studyMode} onValueChange={setStudyMode} className="grid gap-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="cursor-pointer">
                      <p className="font-medium">처음부터 시작</p>
                      <p className="text-sm text-muted-foreground">모든 문제를 처음부터 연습</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="continue" id="continue" />
                    <Label htmlFor="continue" className="cursor-pointer">
                      <p className="font-medium">마지막 세션에서 계속</p>
                      <p className="text-sm text-muted-foreground">중단한 지점에서 다시 시작</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="incorrect" id="incorrect" />
                    <Label htmlFor="incorrect" className="cursor-pointer">
                      <p className="font-medium">오답 문제만</p>
                      <p className="text-sm text-muted-foreground">틀린 문제에 집중</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="marked" id="marked" />
                    <Label htmlFor="marked" className="cursor-pointer">
                      <p className="font-medium">표시한 문제만</p>
                      <p className="text-sm text-muted-foreground">중요하다고 표시한 문제 연습</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">총 문제 수: {totalQuestions}문제</p>
                  {studyPlan && (
                    <p className="text-sm text-muted-foreground">
                      {studyPlan.totalDays}일 계획, 하루 {studyPlan.questionsPerDay}문제
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={() => setActiveTab("study-plan")}>
                  학습 계획 설정
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="study-plan">
              <StudyPlanForm onSubmit={handleStudyPlanSubmit} defaultTotalQuestions={totalQuestions} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full gap-2" disabled={isLoading}>
            문제로 계속하기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

