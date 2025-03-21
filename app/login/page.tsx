import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "로그인 | Study Helper",
  description: "Study Helper 서비스 로그인 페이지입니다.",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center py-12">
      <LoginForm />
    </div>
  )
}

