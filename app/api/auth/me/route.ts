import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"

export async function GET(req: NextRequest) {
  try {
    // 토큰 추출
    const token = authService.getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 토큰 검증
    const payload = await authService.verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // 사용자 정보 반환
    return NextResponse.json(
      {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

