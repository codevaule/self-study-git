"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { SiNaver, SiKakao } from "react-icons/si"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SocialLogin() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(provider)
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error)
      toast({
        title: "로그인 오류",
        description: `${provider} 로그인 중 문제가 발생했습니다. 다시 시도해주세요.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={!!isLoading}
        className="flex items-center gap-2"
      >
        {isLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FcGoogle className="h-5 w-5" />}
        Google
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSocialLogin("kakao")}
        disabled={!!isLoading}
        className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100"
      >
        {isLoading === "kakao" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SiKakao className="h-5 w-5 text-yellow-500" />
        )}
        Kakao
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSocialLogin("naver")}
        disabled={!!isLoading}
        className="flex items-center gap-2 bg-green-50 hover:bg-green-100"
      >
        {isLoading === "naver" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SiNaver className="h-5 w-5 text-green-600" />
        )}
        Naver
      </Button>
    </div>
  )
}

