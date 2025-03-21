"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/charts"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, FileText, CreditCard, Brain } from "lucide-react"

// 시스템 통계 타입
interface SystemStatsData {
  userStats: {
    total: number
    active: number
    new: number
    premium: number
  }
  contentStats: {
    documents: number
    questions: number
    sessions: number
  }
  paymentStats: {
    total: number
    monthly: number
    conversion: number
  }
  usageStats: {
    apiCalls: number
    storage: number
    bandwidth: number
  }
  dailyActiveUsers: {
    date: string
    count: number
  }[]
  questionGeneration: {
    date: string
    count: number
  }[]
  contentDistribution: {
    name: string
    value: number
  }[]
  revenueByPlan: {
    name: string
    value: number
  }[]
}

export function SystemStats() {
  const [stats, setStats] = useState<SystemStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 통계 데이터 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)

        // TODO: 실제 API 호출로 대체
        // 임시 데이터
        const mockData: SystemStatsData = {
          userStats: {
            total: 1250,
            active: 876,
            new: 124,
            premium: 342,
          },
          contentStats: {
            documents: 3456,
            questions: 28750,
            sessions: 5432,
          },
          paymentStats: {
            total: 15680,
            monthly: 2450,
            conversion: 27.4,
          },
          usageStats: {
            apiCalls: 145670,
            storage: 256,
            bandwidth: 1250,
          },
          dailyActiveUsers: [
            { date: "2023-01", count: 400 },
            { date: "2023-02", count: 430 },
            { date: "2023-03", count: 448 },
            { date: "2023-04", count: 470 },
            { date: "2023-05", count: 540 },
            { date: "2023-06", count: 580 },
            { date: "2023-07", count: 690 },
            { date: "2023-08", count: 710 },
            { date: "2023-09", count: 790 },
            { date: "2023-10", count: 820 },
            { date: "2023-11", count: 870 },
            { date: "2023-12", count: 900 },
          ],
          questionGeneration: [
            { date: "2023-01", count: 2000 },
            { date: "2023-02", count: 2200 },
            { date: "2023-03", count: 2400 },
            { date: "2023-04", count: 2600 },
            { date: "2023-05", count: 3000 },
            { date: "2023-06", count: 3200 },
            { date: "2023-07", count: 3600 },
            { date: "2023-08", count: 3800 },
            { date: "2023-09", count: 4200 },
            { date: "2023-10", count: 4400 },
            { date: "2023-11", count: 4800 },
            { date: "2023-12", count: 5000 },
          ],
          contentDistribution: [
            { name: "문서", value: 35 },
            { name: "질문", value: 45 },
            { name: "마인드맵", value: 15 },
            { name: "기타", value: 5 },
          ],
          revenueByPlan: [
            { name: "기본", value: 15 },
            { name: "프로", value: 45 },
            { name: "팀", value: 30 },
            { name: "기업", value: 10 },
          ],
        }

        // 데이터 설정
        setStats(mockData)
      } catch (error) {
        console.error("Failed to fetch system stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading || !stats) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              활성 사용자: {stats.userStats.active.toLocaleString()} (
              {Math.round((stats.userStats.active / stats.userStats.total) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">콘텐츠</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentStats.documents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              생성된 질문: {stats.contentStats.questions.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">매출</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.paymentStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">월 매출: ${stats.paymentStats.monthly.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API 사용량</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usageStats.apiCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">저장소: {stats.usageStats.storage} GB</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>일일 활성 사용자</CardTitle>
            <CardDescription>월별 활성 사용자 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={stats.dailyActiveUsers} xField="date" yField="count" height={250} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>질문 생성 추이</CardTitle>
            <CardDescription>월별 생성된 질문 수</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={stats.questionGeneration} xField="date" yField="count" height={250} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 분포</CardTitle>
            <CardDescription>콘텐츠 유형별 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={stats.contentDistribution} nameField="name" valueField="value" height={250} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>요금제별 매출</CardTitle>
            <CardDescription>요금제별 매출 비중</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={stats.revenueByPlan} nameField="name" valueField="value" height={250} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

