"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { RiKakaoTalkFill } from "react-icons/ri"
import { SiNaver } from "react-icons/si"
import { useState } from "react"

export function LoginButtons() {
  const [isLoading, setIsLoading] = useState<{
    google: boolean
    kakao: boolean
    naver: boolean
  }>({
    google: false,
    kakao: false,
    naver: false,
  })

  const handleSignIn = async (provider: "google" | "kakao" | "naver") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    try {
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="flex flex-col space-y-3 w-full">
      <Button
        variant="outline"
        onClick={() => handleSignIn("google")}
        disabled={isLoading.google}
        className="flex items-center justify-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        {isLoading.google ? "로그인 중..." : "Google로 로그인"}
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSignIn("kakao")}
        disabled={isLoading.kakao}
        className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black"
      >
        <RiKakaoTalkFill className="h-5 w-5 text-black" />
        {isLoading.kakao ? "로그인 중..." : "카카오로 로그인"}
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSignIn("naver")}
        disabled={isLoading.naver}
        className="flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#03C75A]/90 text-white"
      >
        <SiNaver className="h-4 w-4 text-white" />
        {isLoading.naver ? "로그인 중..." : "네이버로 로그인"}
      </Button>
    </div>
  )
}

