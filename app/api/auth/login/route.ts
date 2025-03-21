import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { authService, UserRole } from "@/lib/auth/auth-service"
import { hashPassword, verifyPassword } from "@/lib/auth/password-utils"

// 로그인 요청 스키마
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await req.json()

    // 스키마 검증
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 })
    }

    const { email, password } = result.data

    // TODO: 실제 데이터베이스에서 사용자 조회
    // 임시 사용자 데이터 (실제 구현에서는 데이터베이스에서 조회)
    const mockUser = {
      id: "1",
      email: "user@example.com",
      name: "Test User",
      role: UserRole.USER,
      passwordHash: await hashPassword("password123"),
    }

    // 이메일 확인
    if (email !== mockUser.email) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 비밀번호 확인
    const isPasswordValid = await verifyPassword(password, mockUser.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 토큰 생성
    const token = await authService.login({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    })

    // 응답 생성
    const response = NextResponse.json(
      {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      },
      { status: 200 },
    )

    // 토큰 쿠키 설정
    authService.setTokenCookie(response, token)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

