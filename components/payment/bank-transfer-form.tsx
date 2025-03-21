"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Copy, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  amount: z.string().min(1, { message: "금액을 입력해주세요." }),
  plan: z.string({
    required_error: "요금제를 선택해주세요.",
  }),
  transferDate: z.string().min(1, { message: "이체일을 입력해주세요." }),
  transferName: z.string().min(2, { message: "입금자명을 입력해주세요." }),
  message: z.string().optional(),
})

export function BankTransferForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  // 은행 계좌 정보
  const bankInfo = {
    bank: "신한은행",
    account: "123-456-789012",
    holder: "스터디헬퍼",
  }

  // 폼 초기화
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      plan: "",
      transferDate: "",
      transferName: "",
      message: "",
    },
  })

  // 계좌번호 복사
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(bankInfo.account)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 폼 제출 처리
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // TODO: 실제 API 호출로 대체
      console.log("Form values:", values)

      // 제출 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "계좌이체 정보가 제출되었습니다.",
        description: "관리자 확인 후 서비스 이용이 가능합니다. 확인 메일을 보내드렸습니다.",
      })

      // 성공 페이지로 이동
      router.push("/payment/bank-transfer/success")
    } catch (error) {
      console.error("Error submitting bank transfer form:", error)
      toast({
        variant: "destructive",
        title: "제출 중 오류가 발생했습니다.",
        description: "잠시 후 다시 시도해주세요.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>계좌 정보</CardTitle>
          <CardDescription>아래 계좌로 결제 금액을 이체해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">은행</p>
                <p className="text-lg">{bankInfo.bank}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium mb-1">계좌번호</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-mono">{bankInfo.account}</p>
                  <Button variant="outline" size="icon" onClick={copyAccountNumber} title="계좌번호 복사">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">예금주</p>
              <p className="text-lg">{bankInfo.holder}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>입금 확인 안내</AlertTitle>
        <AlertDescription>
          입금 확인은 영업일 기준 1-2일 내에 처리됩니다. 입금자명이 다른 경우 아래 양식에 반드시 기재해주세요.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>이체 정보 입력</CardTitle>
          <CardDescription>계좌이체 후 아래 양식을 작성해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>요금제</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="요금제 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">기본 (10,000원/월)</SelectItem>
                          <SelectItem value="pro">프로 (20,000원/월)</SelectItem>
                          <SelectItem value="team">팀 (50,000원/월)</SelectItem>
                          <SelectItem value="enterprise">기업 (100,000원/월)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>결제 금액</FormLabel>
                      <FormControl>
                        <Input placeholder="10000" {...field} />
                      </FormControl>
                      <FormDescription>숫자만 입력 (예: 10000)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="transferDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이체일</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transferName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>입금자명</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>추가 메시지 (선택사항)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="추가 정보나 문의사항이 있으면 입력해주세요."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "제출 중..." : "제출하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

