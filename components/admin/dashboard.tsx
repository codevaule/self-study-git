"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "./user-management"
import { SystemStats } from "./system-stats"
import { ContentManagement } from "./content-management"
import { PaymentHistory } from "./payment-history"
import { AdminSettings } from "./admin-settings"
import { useAuth, UserRole } from "@/hooks/use-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // 관리자 권한 확인
  const isAdmin = user?.role === UserRole.ADMIN

  // 탭 변경 처리
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>접근 권한 없음</AlertTitle>
          <AlertDescription>이 페이지는 관리자만 접근할 수 있습니다.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="content">콘텐츠 관리</TabsTrigger>
          <TabsTrigger value="payments">결제 내역</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SystemStats />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="content">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

