"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Building, ArrowRight } from "lucide-react"

interface PaymentOptionsProps {
  selectedPlan: string
  amount: number
}

export function PaymentOptions({ selectedPlan, amount }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card")

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 방법 선택</CardTitle>
        <CardDescription>원하시는 결제 방법을 선택해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}
          className="space-y-4"
        >
          <div
            className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setPaymentMethod("card")}
          >
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">신용카드 결제</p>
                <p className="text-sm text-muted-foreground">신용카드로 바로 결제합니다.</p>
              </div>
            </Label>
          </div>

          <div
            className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setPaymentMethod("bank")}
          >
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex items-center cursor-pointer">
              <Building className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">계좌이체</p>
                <p className="text-sm text-muted-foreground">계좌이체 후 입금 확인 요청을 합니다.</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full text-lg font-medium">
          <span>총 결제 금액:</span>
          <span>{amount.toLocaleString()}원</span>
        </div>

        <Button asChild className="w-full">
          {paymentMethod === "card" ? (
            <Link href={`/payment/checkout?plan=${selectedPlan}`}>
              카드 결제 진행 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <Link href="/payment/bank-transfer">
              계좌이체 안내 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

