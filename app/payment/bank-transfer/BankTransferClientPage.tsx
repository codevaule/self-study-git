"use client"

import { BankTransferForm } from "@/components/payment/bank-transfer-form"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function BankTransferClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planType = searchParams.get("plan") || "monthly"
  const [bank, setBank] = useState("신한은행")
  const [copied, setCopied] = useState(false)
  const [virtualAccount, setVirtualAccount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 요금제 정보
  const plans = {
    monthly: {
      name: "월간 요금제",
      price: 10000,
      period: "월",
      description: "매월 결제, 언제든지 해지 가능",
    },
    yearly: {
      name: "연간 요금제",
      price: 84000,
      period: "년",
      monthlyPrice: 7000,
      description: "연간 결제 시 30% 할인",
    },
  }

  const selectedPlan = planType === "yearly" ? plans.yearly : plans.monthly

  // 계좌 정보
  const accountInfo = {
    bank: "신한은행",
    account: "123-456-789012",
    holder: "(주)스터디헬퍼",
  }

  // 가상계좌 발급
  const generateVirtualAccount = () => {
    setIsGenerating(true)
    setError(null)

    // 가상계좌 발급 시뮬레이션
    setTimeout(() => {
      try {
        // 가상 계좌번호 생성
        const randomNum = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")
        const virtualAccountNumber = `${bank === "신한은행" ? "110" : bank === "국민은행" ? "120" : "130"}-${randomNum}-${Math.floor(
          Math.random() * 10000,
        )
          .toString()
          .padStart(4, "0")}`

        setVirtualAccount(virtualAccountNumber)
        setIsGenerated(true)
        setIsGenerating(false)
      } catch (err) {
        setError("가상계좌 발급 중 오류가 발생했습니다. 다시 시도해주세요.")
        setIsGenerating(false)
      }
    }, 2000)
  }

  // 계좌번호 복사
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountInfo.account)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 가상계좌번호 복사
  const copyVirtualAccount = () => {
    navigator.clipboard.writeText(virtualAccount)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">계좌이체 결제</h1>
      <p className="text-muted-foreground mb-8">
        아래 계좌로 이체 후 양식을 작성하시면 확인 후 서비스 이용이 가능합니다.
      </p>

      <BankTransferForm />
    </div>
  )
}

