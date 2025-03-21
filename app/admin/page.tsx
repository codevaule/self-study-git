"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, AlertCircle, FileText, RefreshCw } from "lucide-react"
import AdminDocumentEditor from "./document-editor"

/**
 * 관리자 페이지
 *
 * 이 페이지는 관리자만 접근할 수 있으며, 프로젝트 문서를 관리할 수 있는 기능을 제공합니다.
 *
 * @returns 관리자 페이지 컴포넌트
 */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("documentation")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // 인증 상태 확인
  useEffect(() => {
    const authStatus = localStorage.getItem("admin-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }

    // 마지막 업데이트 시간 가져오기
    const lastUpdate = localStorage.getItem("doc-last-updated")
    if (lastUpdate) {
      setLastUpdated(lastUpdate)
    }
  }, [])

  // 인증 처리
  const handleAuthentication = () => {
    // 실제 환경에서는 서버 측 인증을 사용해야 합니다.
    // 이 예제에서는 간단한 비밀번호 확인만 수행합니다.
    if (password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin-auth", "authenticated")
      setError(null)
    } else {
      setError("비밀번호가 올바르지 않습니다.")
    }
  }

  // 로그아웃 처리
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-auth")
  }

  // 문서 저장 처리
  const handleSaveDocument = (content: string) => {
    try {
      localStorage.setItem("project-documentation", content)
      const now = new Date().toLocaleString()
      localStorage.setItem("doc-last-updated", now)
      setLastUpdated(now)
      return true
    } catch (error) {
      console.error("문서 저장 오류:", error)
      return false
    }
  }

  // 문서 다운로드 처리
  const handleDownloadDocument = (content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "study-helper-documentation.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              관리자 인증
            </CardTitle>
            <CardDescription>관리자 페이지에 접근하려면 인증이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>인증 오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="관리자 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAuthentication}>
              인증
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 관리자 대시보드
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <Button variant="outline" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="documentation" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            프로젝트 문서
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 문서 관리</CardTitle>
              <CardDescription>
                프로젝트 문서를 편집하고 관리합니다.
                {lastUpdated && <span className="block text-xs mt-1">마지막 업데이트: {lastUpdated}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDocumentEditor onSave={handleSaveDocument} onDownload={handleDownloadDocument} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>관리자 설정</CardTitle>
              <CardDescription>관리자 계정 및 시스템 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                이 섹션은 아직 구현되지 않았습니다. 향후 업데이트에서 추가될 예정입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

