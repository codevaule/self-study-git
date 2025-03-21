"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Mail, Phone, MessageSquare, FileText, BookOpen, CreditCard, User, Send } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SupportPage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-primary">고객 지원</span> 센터
            </h1>
            <p className="text-base text-muted-foreground">
              Study Helper 이용 중 궁금한 점이 있으신가요? 저희가 도와드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 지원 옵션 섹션 */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-primary/10 premium-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  실시간 채팅
                </CardTitle>
                <CardDescription className="text-xs">평일 오전 9시 ~ 오후 6시</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  빠른 응답이 필요하신가요? 실시간 채팅으로 즉시 도움을 받으세요.
                </p>
                <Button className="w-full text-sm">채팅 시작하기</Button>
              </CardContent>
            </Card>

            <Card className="border-primary/10 premium-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  이메일 문의
                </CardTitle>
                <CardDescription className="text-xs">24시간 접수 가능</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  자세한 문의사항은 이메일로 보내주세요. 영업일 기준 24시간 이내 답변드립니다.
                </p>
                <Button variant="outline" className="w-full text-sm">
                  support@studyhelper.co.kr
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/10 premium-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  전화 상담
                </CardTitle>
                <CardDescription className="text-xs">평일 오전 10시 ~ 오후 5시</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  직접 통화로 문의하고 싶으신가요? 고객센터로 전화주세요.
                </p>
                <Button variant="outline" className="w-full text-sm">
                  02-123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 문의 양식 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-4">문의하기</h2>
              <p className="text-sm text-muted-foreground mb-6">
                아래 양식을 작성하여 문의사항을 보내주세요. 가능한 빠르게 답변 드리겠습니다.
              </p>

              <form className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium">
                    이름
                  </label>
                  <Input id="name" placeholder="이름을 입력하세요" className="text-sm" />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    이메일
                  </label>
                  <Input id="email" type="email" placeholder="이메일을 입력하세요" className="text-sm" />
                </div>

                <div className="space-y-1">
                  <label htmlFor="subject" className="text-sm font-medium">
                    문의 유형
                  </label>
                  <select
                    id="subject"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">문의 유형을 선택하세요</option>
                    <option value="account">계정 관련</option>
                    <option value="billing">결제 관련</option>
                    <option value="technical">기술 지원</option>
                    <option value="feature">기능 제안</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium">
                    문의 내용
                  </label>
                  <Textarea id="message" placeholder="문의 내용을 자세히 입력해주세요" rows={5} className="text-sm" />
                </div>

                <Button type="submit" className="w-full gap-2 text-sm">
                  <Send className="h-4 w-4" />
                  문의 보내기
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
              <p className="text-sm text-muted-foreground mb-6">가장 많이 문의하시는 질문들에 대한 답변입니다.</p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm text-left">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>계정 정보는 어떻게 변경하나요?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    로그인 후 우측 상단의 프로필 아이콘을 클릭하여 '계정 설정'으로 이동하세요. 이메일, 비밀번호, 프로필
                    정보 등을 변경할 수 있습니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm text-left">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>결제 내역은 어디서 확인할 수 있나요?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    '계정 설정' 메뉴에서 '결제 내역' 탭을 선택하면 모든 결제 기록을 확인할 수 있습니다. 영수증
                    다운로드도 가능합니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm text-left">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>학습 데이터를 내보낼 수 있나요?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    네, '내 학습' 페이지에서 각 세션의 상세 페이지로 이동한 후 '내보내기' 버튼을 클릭하면 PDF, Excel 등
                    다양한 형식으로 학습 데이터를 내보낼 수 있습니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-sm text-left">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>어떤 파일 형식을 업로드할 수 있나요?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    TXT, DOC, DOCX, PPT, PPTX, PDF, HWP, RTF, HTML 등 다양한 문서 형식을 지원합니다. 
                    각 파일 형식은 최적의 처리 방법으로 텍스트를 추출합니다. 이미지 기반 PDF의 경우 OCR 기능을 통해
                    텍스트를 추출할 수 있습니다. 파일 업로드 시 각 형식에 맞는 안내를 제공합니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-sm text-left">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>구독을 취소하려면 어떻게 해야 하나요?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    '계정 설정' 메뉴에서 '구독 관리' 탭으로 이동한 후 '구독 취소' 버튼을 클릭하세요. 취소 후에도 현재
                    결제 기간이 끝날 때까지는 서비스를 이용할 수 있습니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-6">
                <Link href="/faq" className="text-primary hover:underline flex items-center gap-1 text-sm">
                  <HelpCircle className="h-4 w-4" />
                  모든 FAQ 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지원 정보 섹션 */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">고객 지원 시간</h2>
            <p className="text-sm text-muted-foreground">
              Study Helper는 고객님의 원활한 학습을 위해 다양한 채널로 지원합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="border-primary/10 premium-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-base font-medium mb-1">실시간 채팅</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      평일: 오전 9시 ~ 오후 6시
                      <br />
                      주말 및 공휴일: 휴무
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 premium-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Mail className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-base font-medium mb-1">이메일 문의</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      24시간 접수 가능
                      <br />
                      응답 시간: 영업일 기준 24시간 이내
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 premium-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Phone className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-base font-medium mb-1">전화 상담</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      평일: 오전 10시 ~ 오후 5시
                      <br />
                      주말 및 공휴일: 휴무
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

