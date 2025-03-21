"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SocialLoginButtons from "@/components/auth/social-login-buttons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다")
      setIsLoading(false)
      return
    }

    try {
      // 실제 구현에서는 API 호출
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("회원가입 오류:", data);
        throw new Error(data.error || data.details?.map((d: any) => d.message).join(', ') || "회원가입에 실패했습니다")
      }

      // 등록 성공 시 로그인 페이지로 이동
      router.push("/auth/login?registered=true")
    } catch (error) {
      setError((error as Error).message)
      console.error("회원가입 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">계정 만들기</CardTitle>
          <CardDescription className="text-center">원하는 회원가입 방법을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showEmailForm ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "계정 생성 중..." : "회원가입"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowEmailForm(false)}>
                가입 방법 선택으로 돌아가기
              </Button>
            </form>
          ) : (
            <>
              <SocialLoginButtons onEmailLogin={() => setShowEmailForm(true)} />
              <div className="text-center text-sm text-gray-500">
                가입 시 다음 사항에 동의하게 됩니다:{" "}
                <Button variant="link" className="p-0" onClick={() => router.push("/terms")}>
                  서비스 이용약관
                </Button>{" "}
                및{" "}
                <Button variant="link" className="p-0" onClick={() => router.push("/privacy")}>
                  개인정보 처리방침
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <Button variant="link" className="p-0" onClick={() => router.push("/auth/login")}>
              로그인
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

