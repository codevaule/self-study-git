import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"

export async function POST(req: NextRequest) {
  try {
    // 응답 생성
    const response = NextResponse.json({ success: true }, { status: 200 })

    // 토큰 쿠키 삭제
    authService.clearTokenCookie(response)

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

