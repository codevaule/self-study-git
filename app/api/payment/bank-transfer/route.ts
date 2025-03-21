import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendBankTransferNotification } from "@/lib/notifications"

// 요청 스키마 정의
const requestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  amount: z.string().min(1),
  plan: z.string(),
  transferDate: z.string().min(1),
  transferName: z.string().min(2),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json()

    // 스키마 검증
    const validatedData = requestSchema.parse(body)

    // TODO: 데이터베이스에 저장
    console.log("Bank transfer data:", validatedData)

    // 관리자 및 사용자에게 알림 전송
    await sendBankTransferNotification({
      adminEmail: "admin@studyhelper.com",
      userEmail: validatedData.email,
      userName: validatedData.name,
      amount: validatedData.amount,
      plan: validatedData.plan,
      transferDate: validatedData.transferDate,
      transferName: validatedData.transferName,
    })

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: "계좌이체 정보가 성공적으로 제출되었습니다.",
    })
  } catch (error) {
    console.error("Error processing bank transfer:", error)

    // 오류 응답
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 데이터입니다.", errors: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

