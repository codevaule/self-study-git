import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "계좌이체 신청 완료 | Study Helper",
  description: "계좌이체 신청이 완료되었습니다.",
}

export default function BankTransferSuccessPage() {
  return (
    <div className="container max-w-md py-10">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">계좌이체 신청 완료</CardTitle>
          <CardDescription>계좌이체 정보가 성공적으로 제출되었습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">입금 확인 후 서비스 이용이 가능합니다. 확인 메일을 보내드렸으니 확인해주세요.</p>
          <p className="text-sm text-muted-foreground">
            영업일 기준 1-2일 내에 처리됩니다. 문의사항은 support@studyhelper.com으로 연락주세요.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">홈으로</Link>
          </Button>
          <Button asChild>
            <Link href="/support">고객센터</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

