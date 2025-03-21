"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { CalendarDays, Calculator, BookOpen, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StudyPlanFormProps {
  onSubmit: (plan: {
    totalDays: number
    questionsPerDay: number
    totalQuestions: number
    useStudyPlan: boolean
  }) => void
  defaultTotalQuestions?: number
}

export default function StudyPlanForm({ onSubmit, defaultTotalQuestions = 10 }: StudyPlanFormProps) {
  const [useStudyPlan, setUseStudyPlan] = useState(false)
  const [totalDays, setTotalDays] = useState(10)
  const [questionsPerDay, setQuestionsPerDay] = useState(10)
  const [totalQuestions, setTotalQuestions] = useState(defaultTotalQuestions)
  const [customTotalQuestions, setCustomTotalQuestions] = useState(false)

  // 학습 계획 사용 시 총 문제 수 계산
  const calculatedTotalQuestions = totalDays * questionsPerDay

  // 학습 계획 제출
  const handleSubmit = () => {
    onSubmit({
      totalDays,
      questionsPerDay,
      totalQuestions: useStudyPlan ? calculatedTotalQuestions : totalQuestions,
      useStudyPlan,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">학습 계획 설정</CardTitle>
        <CardDescription>학습 일정과 문제 수를 설정하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="use-study-plan" checked={useStudyPlan} onCheckedChange={setUseStudyPlan} />
            <Label htmlFor="use-study-plan" className="font-medium">
              학습 계획 사용
            </Label>
          </div>
        </div>

        {useStudyPlan ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="total-days" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  학습 기간 (일)
                </Label>
                <span className="text-sm font-medium">{totalDays}일</span>
              </div>
              <Slider
                id="total-days"
                min={1}
                max={30}
                step={1}
                value={[totalDays]}
                onValueChange={(value) => setTotalDays(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">1일</span>
                <span className="text-xs text-muted-foreground">30일</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="questions-per-day" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  하루 문제 수
                </Label>
                <span className="text-sm font-medium">{questionsPerDay}문제</span>
              </div>
              <Slider
                id="questions-per-day"
                min={5}
                max={50}
                step={5}
                value={[questionsPerDay]}
                onValueChange={(value) => setQuestionsPerDay(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">5문제</span>
                <span className="text-xs text-muted-foreground">50문제</span>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Calculator className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-800">총 문제 수</AlertTitle>
              <AlertDescription className="text-blue-700">
                {totalDays}일 × {questionsPerDay}문제 = 총 {calculatedTotalQuestions}문제
              </AlertDescription>
            </Alert>

            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">학습 계획 안내</AlertTitle>
              <AlertDescription className="text-amber-700">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>하루에 목표한 문제 수를 풀지 못하면, 남은 문제는 다음 날로 이월됩니다.</li>
                  <li>학습 계획은 언제든지 조정할 수 있습니다.</li>
                  <li>매일 학습 진행 상황을 확인하고 관리할 수 있습니다.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="total-questions" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />총 문제 수
                </Label>
                <span className="text-sm font-medium">{totalQuestions}문제</span>
              </div>
              <Slider
                id="total-questions"
                min={5}
                max={100}
                step={5}
                value={[totalQuestions]}
                onValueChange={(value) => setTotalQuestions(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">5문제</span>
                <span className="text-xs text-muted-foreground">100문제</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="custom-total-questions"
                checked={customTotalQuestions}
                onCheckedChange={setCustomTotalQuestions}
              />
              <Label htmlFor="custom-total-questions">직접 입력</Label>
            </div>

            {customTotalQuestions && (
              <div className="space-y-2">
                <Label htmlFor="custom-questions">문제 수 직접 입력</Label>
                <Input
                  id="custom-questions"
                  type="number"
                  min={1}
                  max={500}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number.parseInt(e.target.value) || 10)}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          설정 완료
        </Button>
      </CardFooter>
    </Card>
  )
}

