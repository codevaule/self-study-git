import nodemailer from "nodemailer"

// 이메일 전송을 위한 트랜스포터 설정
const transporter = nodemailer.createTransport({
  // TODO: 실제 SMTP 설정으로 대체
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@studyhelper.com",
    pass: "password",
  },
})

// 계좌이체 알림 타입
interface BankTransferNotificationProps {
  adminEmail: string
  userEmail: string
  userName: string
  amount: string
  plan: string
  transferDate: string
  transferName: string
}

/**
 * 계좌이체 알림 전송
 */
export async function sendBankTransferNotification({
  adminEmail,
  userEmail,
  userName,
  amount,
  plan,
  transferDate,
  transferName,
}: BankTransferNotificationProps) {
  try {
    // 관리자에게 알림 전송
    await transporter.sendMail({
      from: '"Study Helper" <noreply@studyhelper.com>',
      to: adminEmail,
      subject: "새로운 계좌이체 신청이 접수되었습니다",
      html: `
        <h1>새로운 계좌이체 신청</h1>
        <p>새로운 계좌이체 신청이 접수되었습니다. 아래 정보를 확인해주세요.</p>
        <ul>
          <li><strong>이름:</strong> ${userName}</li>
          <li><strong>이메일:</strong> ${userEmail}</li>
          <li><strong>요금제:</strong> ${getPlanName(plan)}</li>
          <li><strong>금액:</strong> ${formatAmount(amount)}원</li>
          <li><strong>이체일:</strong> ${transferDate}</li>
          <li><strong>입금자명:</strong> ${transferName}</li>
        </ul>
        <p>관리자 페이지에서 자세한 정보를 확인하고 처리할 수 있습니다.</p>
      `,
    })

    // 사용자에게 알림 전송
    await transporter.sendMail({
      from: '"Study Helper" <noreply@studyhelper.com>',
      to: userEmail,
      subject: "계좌이체 신청이 접수되었습니다",
      html: `
        <h1>계좌이체 신청 접수 완료</h1>
        <p>${userName}님, 계좌이체 신청이 성공적으로 접수되었습니다.</p>
        <h2>신청 정보</h2>
        <ul>
          <li><strong>요금제:</strong> ${getPlanName(plan)}</li>
          <li><strong>금액:</strong> ${formatAmount(amount)}원</li>
          <li><strong>이체일:</strong> ${transferDate}</li>
          <li><strong>입금자명:</strong> ${transferName}</li>
        </ul>
        <p>입금 확인은 영업일 기준 1-2일 내에 처리됩니다. 확인되면 별도의 이메일로 안내드립니다.</p>
        <p>문의사항이 있으시면 support@studyhelper.com으로 연락주세요.</p>
      `,
    })

    console.log("Bank transfer notifications sent successfully")
    return true
  } catch (error) {
    console.error("Error sending bank transfer notifications:", error)
    throw error
  }
}

/**
 * 요금제 코드를 이름으로 변환
 */
function getPlanName(planCode: string): string {
  const plans: Record<string, string> = {
    basic: "기본 (10,000원/월)",
    pro: "프로 (20,000원/월)",
    team: "팀 (50,000원/월)",
    enterprise: "기업 (100,000원/월)",
  }

  return plans[planCode] || planCode
}

/**
 * 금액 포맷팅
 */
function formatAmount(amount: string): string {
  return Number.parseInt(amount).toLocaleString("ko-KR")
}

