"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, FileText, ExternalLink } from "lucide-react"

export default function PdfHelper() {
  return (
    <Card className="mt-6 mx-auto max-w-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">PDF 파일 사용 방법</CardTitle>
        <CardDescription className="text-sm">PDF 파일에서 텍스트를 추출하는 방법</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800 text-sm">PDF 텍스트 추출 문제</AlertTitle>
          <AlertDescription className="text-amber-700 text-xs">
            브라우저에서 PDF 파일의 텍스트를 자동으로 추출하는 것은 기술적 제한이 있습니다. 특히 한글이 포함된 PDF는
            텍스트가 깨질 수 있습니다. 아래 방법을 사용하여 텍스트를 추출하세요.
          </AlertDescription>
        </Alert>

        <div className="mb-4 p-3 border rounded-md bg-blue-50">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-800">
            <FileText className="h-4 w-4" />
            권장하는 PDF 텍스트 추출 방법
          </h3>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-blue-700">
            <li>PDF 파일을 업로드합니다.</li>
            <li>"PDF 열기" 버튼을 클릭하여 브라우저에서 PDF를 엽니다.</li>
            <li>PDF에서 필요한 텍스트를 선택하고 복사합니다 (Ctrl+C 또는 Cmd+C).</li>
            <li>텍스트 입력 영역에 복사한 내용을 붙여넣습니다 (Ctrl+V 또는 Cmd+V).</li>
            <li>"텍스트 사용하기" 버튼을 클릭합니다.</li>
          </ol>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm">Adobe Acrobat Reader에서 텍스트 복사하기</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>Adobe Acrobat Reader에서 PDF 파일을 엽니다.</li>
                <li>복사하려는 텍스트를 선택합니다.</li>
                <li>
                  마우스 오른쪽 버튼을 클릭하고 &quot;복사&quot;를 선택하거나 Ctrl+C(Windows) 또는 Cmd+C(Mac)를
                  누릅니다.
                </li>
                <li>텍스트 입력 영역에 붙여넣습니다.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm">Chrome 브라우저에서 PDF 텍스트 복사하기</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>Chrome 브라우저에서 PDF 파일을 엽니다.</li>
                <li>복사하려는 텍스트를 선택합니다.</li>
                <li>
                  마우스 오른쪽 버튼을 클릭하고 &quot;복사&quot;를 선택하거나 Ctrl+C(Windows) 또는 Cmd+C(Mac)를
                  누릅니다.
                </li>
                <li>텍스트 입력 영역에 붙여넣습니다.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-sm">온라인 PDF to Text 변환 도구 사용하기</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>Google에서 &quot;PDF to Text converter&quot;를 검색합니다.</li>
                <li>신뢰할 수 있는 온라인 변환 도구를 선택합니다.</li>
                <li>PDF 파일을 업로드하고 텍스트로 변환합니다.</li>
                <li>변환된 텍스트를 복사하여 텍스트 입력 영역에 붙여넣습니다.</li>
              </ol>
              <p className="mt-2 text-xs text-muted-foreground">
                참고: 개인 정보가 포함된 PDF 파일을 온라인 도구에 업로드할 때는 주의하세요.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-sm">한글 PDF 파일 특별 처리 방법</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-xs">한글이 포함된 PDF 파일은 특별한 처리가 필요할 수 있습니다:</p>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>한글 PDF를 열 때는 Adobe Acrobat Reader를 사용하는 것이 좋습니다.</li>
                <li>PDF 내용을 한글 워드 프로세서(한글, MS Word 등)로 복사한 후 다시 텍스트만 복사하세요.</li>
                <li>PDF를 텍스트(.txt) 파일로 먼저 변환한 후 그 내용을 복사하여 붙여넣으세요.</li>
                <li>
                  <a
                    href="https://www.onlineocr.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    온라인 OCR 서비스 <ExternalLink className="h-3 w-3" />
                  </a>
                  를 사용하여 PDF를 텍스트로 변환해 보세요.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-sm">텍스트 파일(.txt)로 변환하기</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-xs">PDF 파일을 텍스트 파일로 변환하는 방법:</p>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>Adobe Acrobat Pro를 사용하여 PDF를 텍스트 파일로 저장할 수 있습니다.</li>
                <li>
                  <a
                    href="https://smallpdf.com/pdf-to-txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Smallpdf <ExternalLink className="h-3 w-3" />
                  </a>
                  와 같은 온라인 변환 도구를 사용할 수 있습니다.
                </li>
                <li>변환된 텍스트 파일을 열고 내용을 복사하여 붙여넣으세요.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

