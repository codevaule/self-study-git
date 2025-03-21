"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Scan, FileText, CheckCircle, AlertTriangle } from "lucide-react"

export default function OcrHelper() {
  return (
    <Card className="mt-6 mx-auto max-w-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scan className="h-5 w-5" />
          OCR (광학 문자 인식) 기능
        </CardTitle>
        <CardDescription className="text-sm">이미지 기반 PDF와 스캔 문서에서 텍스트 추출</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <FileText className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-800 text-sm">OCR이란?</AlertTitle>
          <AlertDescription className="text-blue-700 text-xs">
            OCR(광학 문자 인식)은 이미지나 스캔된 문서에서 텍스트를 인식하여 편집 가능한 텍스트로 변환하는 기술입니다.
            이 기능을 사용하면 텍스트 레이어가 없는 PDF나 스캔된 문서에서도 텍스트를 추출할 수 있습니다.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ocr-usage">
            <AccordionTrigger className="text-sm">OCR 사용 방법</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-xs">
                <div className="grid gap-3">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">OCR 활성화</h4>
                      <p className="text-xs text-muted-foreground">PDF 업로드 화면에서 "OCR 사용" 스위치를 켭니다.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">PDF 파일 업로드</h4>
                      <p className="text-xs text-muted-foreground">PDF 파일을 끌어다 놓거나 클릭하여 선택합니다.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">OCR 처리 대기</h4>
                      <p className="text-xs text-muted-foreground">
                        OCR 처리는 페이지 수와 내용에 따라 시간이 걸릴 수 있습니다. 처리가 완료될 때까지 기다려주세요.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 rounded-full p-2 h-7 w-7 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">추출된 텍스트 검토 및 편집</h4>
                      <p className="text-xs text-muted-foreground">
                        추출된 텍스트를 검토하고 필요한 경우 수정한 후 "텍스트 사용" 버튼을 클릭합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ocr-advantages">
            <AccordionTrigger className="text-sm">OCR의 장점</AccordionTrigger>
            <AccordionContent>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-green-800">OCR의 장점</h4>
                    <ul className="mt-1 space-y-1 text-xs text-green-700 list-disc pl-5">
                      <li>이미지 기반 PDF에서 텍스트 추출</li>
                      <li>스캔된 문서에서 텍스트 인식</li>
                      <li>한글 문자 인식 지원</li>
                      <li>텍스트 레이어가 없는 PDF 처리</li>
                      <li>수동으로 텍스트를 복사할 필요 없음</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ocr-limitations">
            <AccordionTrigger className="text-sm">OCR 한계점</AccordionTrigger>
            <AccordionContent>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800 text-sm">OCR 한계점</AlertTitle>
                <AlertDescription className="text-amber-700 text-xs">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      OCR은 100% 정확하지 않으며, 특히 복잡한 레이아웃이나 특수 문자가 있는 경우 오류가 발생할 수
                      있습니다.
                    </li>
                    <li>저품질 PDF는 인식 정확도가 낮을 수 있습니다.</li>
                    <li>OCR 처리는 일반 텍스트 추출보다 시간이 더 오래 걸립니다.</li>
                    <li>추출된 텍스트를 항상 검토하고 필요한 경우 수정하세요.</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

