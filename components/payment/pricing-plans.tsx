"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { PaymentOptions } from "./payment-options"

// 요금제 타입
interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
}

// 요금제 데이터
const plans: Plan[] = [
  {
    id: "basic",
    name: "기본",
    description: "개인 학습자를 위한 기본 기능",
    monthlyPrice: 10000,
    yearlyPrice: 100000,
    features: ["무제한 문서 업로드", "기본 질문 생성", "크로스워드 퍼즐", "기본 마인드맵"],
  },
  {
    id: "pro",
    name: "프로",
    description: "심층 학습을 위한 고급 기능",
    monthlyPrice: 20000,
    yearlyPrice: 200000,
    features: [
      "무제한 문서 업로드",
      "고급 질문 생성",
      "크로스워드 퍼즐",
      "고급 마인드맵",
      "OCR 문서 인식",
      "학습 진도 분석",
    ],
    popular: true,
  },
  {
    id: "team",
    name: "팀",
    description: "소규모 팀을 위한 협업 기능",
    monthlyPrice: 50000,
    yearlyPrice: 500000,
    features: [
      "무제한 문서 업로드",
      "고급 질문 생성",
      "크로스워드 퍼즐",
      "고급 마인드맵",
      "OCR 문서 인식",
      "학습 진도 분석",
      "팀 협업 기능",
      "공유 학습 세션",
      "우선 지원",
    ],
  },
  {
    id: "enterprise",
    name: "기업",
    description: "대규모 조직을 위한 맞춤형 솔루션",
    monthlyPrice: 100000,
    yearlyPrice: 1000000,
    features: [
      "무제한 문서 업로드",
      "고급 질문 생성",
      "크로스워드 퍼즐",
      "고급 마인드맵",
      "OCR 문서 인식",
      "학습 진도 분석",
      "팀 협업 기능",
      "공유 학습 세션",
      "우선 지원",
      "API 액세스",
      "맞춤형 통합",
      "전담 계정 관리자",
    ],
  },
]

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // 연간 결제 시 할인율
  const yearlyDiscount = 0.17 // 17% 할인

  // 연간 결제 전환 처리
  const handleBillingCycleChange = (checked: boolean) => {
    setBillingCycle(checked ? "yearly" : "monthly")
  }

  // 요금제 선택 처리
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  // 선택된 요금제 정보
  const selectedPlanData = selectedPlan ? plans.find((plan) => plan.id === selectedPlan) : null

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center space-x-2 mb-8">
        <Label htmlFor="billing-cycle">월간 결제</Label>
        <Switch id="billing-cycle" checked={billingCycle === "yearly"} onCheckedChange={handleBillingCycleChange} />
        <div className="flex items-center">
          <Label htmlFor="billing-cycle">연간 결제</Label>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            17% 할인
          </Badge>
        </div>
      </div>

      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
              {plan.popular && <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">인기</Badge>}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    {billingCycle === "monthly"
                      ? `${plan.monthlyPrice.toLocaleString()}원`
                      : `${plan.yearlyPrice.toLocaleString()}원`}
                  </p>
                  <p className="text-sm text-muted-foreground">{billingCycle === "monthly" ? "월간" : "연간"}</p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  선택하기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>선택한 요금제</CardTitle>
              <CardDescription>선택하신 요금제 정보를 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPlanData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedPlanData.name}</h3>
                    <p className="text-muted-foreground">{selectedPlanData.description}</p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      {billingCycle === "monthly"
                        ? `${selectedPlanData.monthlyPrice.toLocaleString()}원`
                        : `${selectedPlanData.yearlyPrice.toLocaleString()}원`}
                    </p>
                    <p className="text-sm text-muted-foreground">{billingCycle === "monthly" ? "월간" : "연간"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">포함된 기능</h4>
                    <ul className="space-y-1">
                      {selectedPlanData.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setSelectedPlan(null)} className="w-full">
                다른 요금제 선택
              </Button>
            </CardFooter>
          </Card>

          {selectedPlanData && (
            <PaymentOptions
              selectedPlan={selectedPlanData.id}
              amount={billingCycle === "monthly" ? selectedPlanData.monthlyPrice : selectedPlanData.yearlyPrice}
            />
          )}
        </div>
      )}
    </div>
  )
}

