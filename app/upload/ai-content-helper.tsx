"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BrainCircuit, Lightbulb, BookOpen, CheckCircle } from "lucide-react"

export default function AiContentHelper() {
  return (
    <Card className="mt-6 mx-auto max-w-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          AI 컨텐츠 생성 기능
        </CardTitle>
        <CardDescription className="text-sm">AI를 활용한 학습 자료 생성 방법</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-800 text-sm">AI 컨텐츠 생성이란?</AlertTitle>
          <AlertDescription className="text-blue-700 text-xs">
            외부 컨텐츠 업로드 없이도 AI가 시험 제목을 기반으로 관련 학습 자료를 자동으로 생성해 줍니다. 이 기능은
            OpenAI의 GPT 모델을 활용하여 시험 주제에 맞는 상세한 학습 자료를 제공합니다.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-usage">
            <AccordionTrigger className="text-sm">AI 컨텐츠 생성 사용 방법</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-xs">
                <div className="grid gap-3">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">시험 제목 입력</h4>
                      <p className="text-xs text-muted-foreground">
                        준비 중인 시험의 제목을 입력하세요 (예: 정보처리기사, TOEIC, 컴퓨터활용능력 등).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">"AI로 컨텐츠 생성" 버튼 클릭</h4>
                      <p className="text-xs text-muted-foreground">
                        버튼을 클릭하면 AI가 시험 주제에 맞는 학습 자료를 생성하기 시작합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">생성 완료 대기</h4>
                      <p className="text-xs text-muted-foreground">
                        AI가 컨텐츠를 생성하는 동안 잠시 기다려주세요. 생성 시간은 약 30초에서 1분 정도 소요됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">생성된 컨텐츠 확인 및 수정</h4>
                      <p className="text-xs text-muted-foreground">
                        생성된 학습 자료를 확인하고 필요한 경우 수정한 후 "문제 생성으로 계속하기" 버튼을 클릭하세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai-advantages">
            <AccordionTrigger className="text-sm">AI 생성 컨텐츠의 장점</AccordionTrigger>
            <AccordionContent>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-green-800">AI 생성 컨텐츠의 장점</h4>
                    <ul className="mt-1 space-y-1 text-xs text-green-700 list-disc pl-5">
                      <li>외부 자료 없이도 즉시 학습 자료 생성 가능</li>
                      <li>시험 유형에 맞춘 맞춤형 학습 자료 제공</li>
                      <li>최신 정보와 트렌드 반영</li>
                      <li>다양한 학습 포인트와 예시 포함</li>
                      <li>시험 준비에 필요한 핵심 개념 정리</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai-limitations">
            <AccordionTrigger className="text-sm">AI 생성 컨텐츠의 한계</AccordionTrigger>
            <AccordionContent>
              <div className="text-xs text-muted-foreground">
                <p className="flex items-center gap-1 mb-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    AI 생성 컨텐츠는 참고용으로만 사용하세요. 실제 시험 준비에는 공식 교재와 함께 활용하는 것이
                    좋습니다.
                  </span>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI가 생성한 내용은 100% 정확하지 않을 수 있습니다.</li>
                  <li>최신 시험 변경사항이 반영되지 않을 수 있습니다.</li>
                  <li>특정 전문 분야에서는 깊이 있는 내용이 부족할 수 있습니다.</li>
                  <li>생성된 내용을 항상 검증하고 보완하는 것이 좋습니다.</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

