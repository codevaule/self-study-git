import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { authService, UserRole } from "@/lib/auth/auth-service"
import { hashPassword } from "@/lib/auth/password-utils"

// 회원가입 요청 스키마
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
})

export async function POST(req: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await req.json()

    // 스키마 검증
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 })
    }

    const { email, password, name } = result.data

    // TODO: 실제 데이터베이스에서 이메일 중복 확인
    // 임시 사용자 데이터 (실제 구현에서는 데이터베이스에서 조회)
    const mockExistingUser = {
      email: "user@example.com",
    }

    // 이메일 중복 확인
    if (email === mockExistingUser.email) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password)

    // TODO: 실제 데이터베이스에 사용자 저장
    // 임시 사용자 생성 (실제 구현에서는 데이터베이스에 저장)
    const newUser = {
      id: "2",
      email,
      name,
      role: UserRole.USER,
      passwordHash,
    }

    // 토큰 생성
    const token = await authService.login({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })

    // 응답 생성
    const response = NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 },
    )

    // 토큰 쿠키 설정
    authService.setTokenCookie(response, token)

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" }, 
      { status: 500 }
    )
  }
}

