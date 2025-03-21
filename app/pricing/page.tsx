import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              합리적인 <span className="text-primary">요금제</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              다양한 학습 요구사항에 맞는 유연한 요금제를 제공합니다. 필요에 따라 선택하고 언제든지 변경할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/10 premium-shadow">
              <CardHeader>
                <CardTitle>무료 체험</CardTitle>
                <CardDescription>서비스를 경험해보세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  ₩0<span className="text-lg font-normal text-muted-foreground">/월</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>기본 문제 생성 (10문제/일)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>기본 학습 통계</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>텍스트 파일 업로드</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/register">무료로 시작하기</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary/10 premium-shadow">
              <CardHeader>
                <CardTitle>월간 요금제</CardTitle>
                <CardDescription>매월 결제, 언제든지 해지 가능</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  ₩10,000<span className="text-lg font-normal text-muted-foreground">/월</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>무제한 문제 생성</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>AI 기반 학습 분석</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>맞춤형 학습 계획</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>PDF 및 문서 업로드</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>이메일 기술 지원</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/payment?plan=monthly">시작하기</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary premium-shadow bg-primary/5">
              <CardHeader>
                <CardTitle>연간 요금제</CardTitle>
                <CardDescription>연간 결제 시 30% 할인</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  ₩7,000<span className="text-lg font-normal text-muted-foreground">/월</span>
                </div>
                <div className="text-sm text-muted-foreground">연 ₩84,000 (₩10,000 x 12개월 - 30% 할인)</div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>무제한 문제 생성</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>AI 기반 학습 분석</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>맞춤형 학습 계획</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>PDF 및 문서 업로드</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>우선 고객 지원</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>고급 통계 및 분석</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/payment?plan=yearly">연간 구독 시작하기</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 요금제 비교 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">요금제 비교</h2>
            <p className="text-lg text-muted-foreground">각 요금제별 기능을 비교하여 최적의 선택을 하세요</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">기능</th>
                  <th className="p-4 text-center">무료 체험</th>
                  <th className="p-4 text-center">월간 요금제</th>
                  <th className="p-4 text-center">연간 요금제</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">문제 생성</td>
                  <td className="p-4 text-center">10문제/일</td>
                  <td className="p-4 text-center">무제한</td>
                  <td className="p-4 text-center">무제한</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">학습 분석</td>
                  <td className="p-4 text-center">기본</td>
                  <td className="p-4 text-center">고급</td>
                  <td className="p-4 text-center">고급</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">맞춤형 학습 계획</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">PDF 및 문서 업로드</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">고객 지원</td>
                  <td className="p-4 text-center">이메일</td>
                  <td className="p-4 text-center">이메일</td>
                  <td className="p-4 text-center">우선 지원</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">고급 통계 및 분석</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">자주 묻는 질문</h2>
            <p className="text-lg text-muted-foreground">요금제 및 결제에 관한 궁금증을 해결해 드립니다</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>결제는 어떻게 이루어지나요?</AccordionTrigger>
                <AccordionContent>
                  신용카드, 체크카드, 계좌이체를 통해 결제가 가능합니다. 월간 요금제는 매월 자동으로 결제되며, 연간
                  요금제는 1년에 한 번 결제됩니다. 모든 결제 정보는 안전하게 암호화되어 처리됩니다.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>언제든지 요금제를 변경할 수 있나요?</AccordionTrigger>
                <AccordionContent>
                  네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 업그레이드 시에는 즉시 새로운
                  기능을 이용할 수 있으며, 남은 기간에 대한 차액만 결제됩니다. 다운그레이드는 현재 구독 기간이 끝난 후
                  적용됩니다.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>환불 정책은 어떻게 되나요?</AccordionTrigger>
                <AccordionContent>
                  구독 시작 후 7일 이내에 요청하시면 전액 환불이 가능합니다. 7일 이후에는 남은 기간에 대한 부분 환불이
                  제공됩니다. 환불 요청은 고객센터를 통해 접수해 주세요.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>무료 체험 후 자동으로 결제되나요?</AccordionTrigger>
                <AccordionContent>
                  아니요, 자동 결제되지 않습니다. 무료 체험 기간이 끝난 후에도 계속 서비스를 이용하시려면 유료 요금제로
                  직접 업그레이드하셔야 합니다.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>단체 할인이 있나요?</AccordionTrigger>
                <AccordionContent>
                  네, 10명 이상의 단체 구독 시 특별 할인이 제공됩니다. 자세한 내용은 support@studyhelper.co.kr로 문의해
                  주세요.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">지금 바로 시작하세요</h2>
            <p className="text-lg text-muted-foreground">
              무료 체험으로 Study Helper의 강력한 기능을 경험해보세요. 언제든지 업그레이드하여 더 많은 기능을 이용할 수
              있습니다.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/auth/register">무료로 시작하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

