import type { Metadata } from "next"
import { PricingPlans } from "@/components/payment/pricing-plans"

export const metadata: Metadata = {
  title: "요금제 | Study Helper",
  description: "Study Helper의 다양한 요금제를 확인하고 선택하세요.",
}

export default function PaymentPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">요금제 선택</h1>
        <p className="text-muted-foreground">필요에 맞는 요금제를 선택하여 Study Helper의 모든 기능을 활용하세요.</p>
      </div>

      <PricingPlans />
    </div>
  )
}

