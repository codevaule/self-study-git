"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Receipt, Calendar, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const planType = searchParams.get("plan") || "monthly"
  const [orderNumber, setOrderNumber] = useState("")

  // 주문 번호 생성
  useEffect(() => {
    const generateOrderNumber = () => {
      const date = new Date()
      const year = date.getFullYear().toString().slice(2)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")

      return `ORD-${year}${month}${day}-${random}`
    }

    setOrderNumber(generateOrderNumber())
  }, [])

  // 요금제 정보
  const plans = {
    monthly: {
      name: "월간 요금제",
      price: 10000,
      period: "월",
      nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    yearly: {
      name: "연간 요금제",
      price: 84000,
      period: "년",
      nextBillingDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  }

  const selectedPlan = planType === "yearly" ? plans.yearly : plans.monthly

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="premium-shadow animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">결제가 완료되었습니다</CardTitle>
            <CardDescription>Study Helper {selectedPlan.name} 구독이 성공적으로 활성화되었습니다.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">주문 번호</span>
                <span className="text-sm">{orderNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">결제 일시</span>
                <span className="text-sm">{formatDate(new Date())}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">결제 금액</span>
                <span className="text-sm font-bold">{selectedPlan.price.toLocaleString()}원</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">구독 기간</span>
                <span className="text-sm">1{selectedPlan.period}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">다음 결제일</span>
                <span className="text-sm">{formatDate(selectedPlan.nextBillingDate)}</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">구독 정보</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    구독은 자동으로 갱신되며, 다음 결제일 24시간 전까지 언제든지 취소할 수 있습니다. 구독 관리는 '계정
                    설정 &gt; 구독 관리'에서 할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/receipt">
                  <Receipt className="h-4 w-4" />
                  영수증 보기
                </Link>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              결제 관련 문의사항은{" "}
              <a href="mailto:support@studyhelper.co.kr" className="text-primary hover:underline">
                support@studyhelper.co.kr
              </a>
              로 문의해주세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button variant="outline" className="flex-1 gap-2" asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  홈으로
                </Link>
              </Button>

              <Button className="flex-1 gap-2 group" asChild>
                <Link href="/upload">
                  시작하기
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

