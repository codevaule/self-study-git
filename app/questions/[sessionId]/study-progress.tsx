"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, BookOpen, Clock } from "lucide-react"
import type { StudyPlan } from "@/lib/types"

interface StudyProgressProps {
  studyPlan: StudyPlan
  completedToday: number
}

export default function StudyProgress({ studyPlan, completedToday }: StudyProgressProps) {
  // 오늘의 목표 문제 수 (기본 + 이월)
  const todayGoal = studyPlan.questionsPerDay + studyPlan.carryOver

  // 오늘 진행률
  const todayProgress = Math.min(100, Math.round((completedToday / todayGoal) * 100))

  // 전체 진행률
  const totalProgress = Math.min(
    100,
    Math.round(
      (((studyPlan.currentDay - 1) * studyPlan.questionsPerDay + completedToday) /
        (studyPlan.totalDays * studyPlan.questionsPerDay)) *
        100,
    ),
  )

  // 시작일 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          학습 진행 상황
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">학습 일차</p>
            <p className="text-lg font-medium">
              {studyPlan.currentDay}/{studyPlan.totalDays}일
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">오늘 목표</p>
            <p className="text-lg font-medium">{todayGoal}문제</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">완료</p>
            <p className="text-lg font-medium">
              {completedToday}/{todayGoal}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              오늘 진행률
            </span>
            <span>{todayProgress}%</span>
          </div>
          <Progress value={todayProgress} className="h-2" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              전체 진행률
            </span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground">
          <p>시작일: {formatDate(studyPlan.startDate)}</p>
          {studyPlan.carryOver > 0 && <p className="text-amber-600">이월된 문제: {studyPlan.carryOver}문제</p>}
        </div>
      </CardContent>
    </Card>
  )
}

