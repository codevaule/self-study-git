import { type NextRequest, NextResponse } from "next/server"
import { handleSocialLoginCallback } from "@/lib/auth/social-login"

export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const provider = params.provider
    const url = new URL(request.url)
    const code = url.searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL(`/auth/login?error=No authorization code provided`, request.url))
    }

    // 소셜 로그인 콜백 처리
    const result = await handleSocialLoginCallback(provider as any, code)

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(result.error || "Authentication failed")}`, request.url),
      )
    }

    // 로그인 성공 시 쿠키 설정 및 리디렉션
    const response = NextResponse.redirect(new URL("/dashboard", request.url))

    // JWT 토큰을 쿠키에 저장
    response.cookies.set({
      name: "auth_token",
      value: result.token || "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Social login callback error:", error)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent((error as Error).message)}`, request.url),
    )
  }
}

