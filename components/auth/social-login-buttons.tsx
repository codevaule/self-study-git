"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

// 소셜 로그인 버튼 속성 인터페이스
interface SocialLoginButtonsProps {
  onEmailLogin?: () => void
}

// 소셜 로그인 버튼 컴포넌트
export default function SocialLoginButtons({ onEmailLogin }: SocialLoginButtonsProps) {
  // 각 버튼의 로딩 상태 관리
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingKakao, setIsLoadingKakao] = useState(false)
  const [isLoadingNaver, setIsLoadingNaver] = useState(false)

  // 소셜 로그인 처리 함수
  const handleSocialLogin = async (provider: string) => {
    switch (provider) {
      case "google":
        setIsLoadingGoogle(true)
        await signIn("google", { callbackUrl: "/" })
        break
      case "kakao":
        setIsLoadingKakao(true)
        await signIn("kakao", { callbackUrl: "/" })
        break
      case "naver":
        setIsLoadingNaver(true)
        await signIn("naver", { callbackUrl: "/" })
        break
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 구글 로그인 버튼 */}
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoadingGoogle}
        className="flex items-center justify-center gap-2 p-6 border border-gray-300 rounded-lg hover:bg-gray-100"
      >
        {isLoadingGoogle ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span className="ml-2 text-base font-medium">Google로 계속하기</span>
      </Button>

      {/* 카카오 로그인 버튼 */}
      <Button
        variant="outline" 
        onClick={() => handleSocialLogin("kakao")}
        disabled={isLoadingKakao}
        className="flex items-center justify-center gap-2 p-6 bg-[#FEE500] text-[#000000] border-none rounded-lg hover:bg-[#F4DC00]"
      >
        {isLoadingKakao ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 3C7.02944 3 3 6.14751 3 10.0425C3 12.4943 4.60289 14.6441 7.06907 15.7957L6.2918 19.2763C6.2918 19.2763 6.24261 19.5847 6.42528 19.7318C6.60795 19.879 6.87371 19.7687 6.87371 19.7687C7.33077 19.588 10.7097 17.3488 12.0635 16.4348C12.0635 16.4348 12.4907 16.4712 12.5399 16.4712C17.5105 16.4712 21 13.3237 21 10.0425C21 6.14751 16.9706 3 12 3Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span className="ml-2 text-base font-medium">카카오로 계속하기</span>
      </Button>

      {/* 네이버 로그인 버튼 */}
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("naver")}
        disabled={isLoadingNaver}
        className="flex items-center justify-center gap-2 p-6 bg-[#03C75A] text-white border-none rounded-lg hover:bg-[#00a248]"
      >
        {isLoadingNaver ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M16.273 12.845L7.376 0H0V24H7.727V11.155L16.624 24H24V0H16.273V12.845Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span className="ml-2 text-base font-medium">네이버로 계속하기</span>
      </Button>

      {/* 이메일 로그인 버튼 */}
      {onEmailLogin && (
        <Button
          variant="outline"
          onClick={onEmailLogin}
          className="flex items-center justify-center gap-2 p-6 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
              fill="currentColor"
            />
          </svg>
          <span className="ml-2 text-base font-medium">이메일로 계속하기</span>
        </Button>
      )}
    </div>
  )
}

