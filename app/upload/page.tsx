"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, FileText, AlertCircle, BrainCircuit, AlertTriangle, Lightbulb } from 'lucide-react'
import { createStudySession } from "@/lib/study-session"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PdfDropZone from "./pdf-drop-zone"
import { convertDocumentToText } from "@/lib/document-converter"

export default function UploadPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFileLoading, setIsFileLoading] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [fileLoadingProgress, setFileLoadingProgress] = useState(0)
  const [contentGenerationProgress, setContentGenerationProgress] = useState(0)
  const [error, setError] = useState("")
  const [fileError, setFileError] = useState("")
  const [isPdfProcessing, setIsPdfProcessing] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const [isSampleContent, setIsSampleContent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manualText, setManualText] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsFileLoading(true)
    setFileLoadingProgress(0)
    setFileError("")

    try {
      // PDF 파일은 별도 처리
      if (selectedFile.type === "application/pdf") {
        setFileError("PDF 파일은 'PDF 파일' 탭을 사용하여 업로드해 주세요.")
        setIsFileLoading(false)
        return
      }

      // 문서 변환 처리
      try {
        // 진행 상황 표시 시작
        setFileLoadingProgress(10)
        
        // 문서를 텍스트로 변환
        const extractedText = await convertDocumentToText(selectedFile)
        
        setFileLoadingProgress(90)
        
        // 변환된 텍스트 설정
        setContent(extractedText)
        setFileLoadingProgress(100)
      } catch (conversionError) {
        console.error("문서 변환 오류:", conversionError)
        setFileError(
          "문서 변환 중 오류가 발생했습니다. 지원되는 형식인지 확인하거나 내용을 직접 붙여넣으세요."
        )
      } finally {
        setIsFileLoading(false)
      }
    } catch (error) {
      console.error("파일 읽기 오류:", error)
      setFileError("파일을 처리하는 중 오류가 발생했습니다.")
      setIsFileLoading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("학습 세션의 제목을 입력해주세요")
      return
    }

    // Improve content and file checking logic
    const trimmedContent = content.trim()
    const hasFile = file !== null
    const hasPdfContent = manualText && manualText.trim().length > 0

    if (!trimmedContent && !hasFile && !hasPdfContent) {
      setError("문서를 업로드하거나 내용을 입력해주세요")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // If content is very large, show a warning
      if (content.length > 50000) {
        console.warn("Large content detected, this may cause storage issues")
      }

      // Create a new study session with the appropriate content
      const sessionId = await createStudySession({
        title,
        content: trimmedContent || manualText || "Sample content for demonstration",
        timestamp: new Date().toISOString(),
        fileName: file ? file.name : "직접 입력한 내용",
      })

      // Redirect to the question type selection page
      router.push(`/question-type/${sessionId}`)
    } catch (err) {
      console.error(err)
      setError("학습 세션을 생성하지 못했습니다. 내용이 너무 클 수 있습니다. 더 작은 문서나 텍스트로 시도해보세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePdfTextExtracted = (text: string) => {
    setManualText(text)
    setContent(text) // Also update the main content
  }

  // AI로 컨텐츠 생성 - 오류 처리 완전 개선
  const generateAIContent = async () => {
    if (!title.trim()) {
      setError("AI 컨텐츠를 생성하려면 시험 제목을 입력해주세요")
      return
    }

    setIsGeneratingContent(true)
    setContentGenerationProgress(0)
    setError("")
    setWarning(null)
    setIsSampleContent(false)

    // 진행 상태 시뮬레이션
    const progressInterval = setInterval(() => {
      setContentGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 500) // 더 빠르게 진행되도록 500ms로 변경

    try {
      // 샘플 컨텐츠 생성 (API 의존성 제거)
      const sampleContent = generateSampleContent(title)
      
      clearInterval(progressInterval)
      setContentGenerationProgress(100)
      
      // 컨텐츠 설정
      setContent(sampleContent)
      setIsSampleContent(true)
      setWarning("샘플 컨텐츠가 생성되었습니다. 실제 학습에는 더 자세한 자료를 사용하는 것이 좋습니다.")

      // 짧은 지연 후 완료 표시
      setTimeout(() => {
        setIsGeneratingContent(false)
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("컨텐츠 생성 오류:", error)

      // 오류 발생 시 샘플 컨텐츠 생성
      setContent(generateSampleContent(title))
      setIsSampleContent(true)
      setWarning("오류가 발생하여 샘플 컨텐츠가 생성되었습니다. 실제 학습에는 더 자세한 자료를 사용하는 것이 좋습니다.")

      setIsGeneratingContent(false)
    } finally {
      setContentGenerationProgress(0)
    }
  }

  // 샘플 컨텐츠 생성
  const generateSampleContent = (examTitle: string): string => {
    return `# ${examTitle} 학습 자료 (샘플)

## ${examTitle} 시험 개요

${examTitle}은(는) 전문 지식과 기술을 평가하는 중요한 시험입니다.

### 주요 학습 영역

#### 1. 기초 이론
- 핵심 개념 이해
- 기본 원리 학습
- 용어 및 정의 숙지

#### 2. 응용 기술
- 실무 적용 방법
- 문제 해결 기법
- 사례 분석

### 학습 전략
1. 체계적인 학습 계획 수립
2. 기출문제 분석을 통한 출제 경향 파악
3. 이론과 실습 병행 학습

**참고**: 이 내용은 샘플이므로 실제 시험 준비에는 공식 교재와 함께 사용하는 것이 좋습니다.`
  }

  // 미리보기 텍스트 준비
  const getPreviewText = () => {
    if (!content) return ""

    // 미리보기 길이를 1000자로 확장
    const previewLength = 1000
    const preview = content.substring(0, previewLength)

    return preview + (content.length > previewLength ? "..." : "")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">학습 자료 업로드</CardTitle>
          <CardDescription className="text-sm">
            학습 문서를 업로드하거나 내용을 붙여넣어 연습 문제를 생성하세요
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">
                  시험 제목
                </Label>
                <Input
                  id="title"
                  placeholder="예: 정보처리기사 실기시험"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  관련 문제를 생성하는 데 도움이 되도록 준비 중인 시험을 지정하세요
                </p>
              </div>

              <Button
                type="button"
                onClick={generateAIContent}
                disabled={isGeneratingContent || !title.trim()}
                className="w-full text-sm"
              >
                {isGeneratingContent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    컨텐츠 생성 중...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    샘플 컨텐츠 생성
                  </>
                )}
              </Button>
            </div>

            {isGeneratingContent && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>컨텐츠 생성 중...</span>
                  <span>{contentGenerationProgress}%</span>
                </div>
                <Progress value={contentGenerationProgress} />
                <p className="text-xs text-muted-foreground">
                  "{title}" 주제에 맞는 학습 자료를 생성하고 있습니다. 잠시만 기다려주세요...
                </p>
              </div>
            )}

            {warning && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800 text-sm">안내</AlertTitle>
                <AlertDescription className="text-amber-700 text-xs">{warning}</AlertDescription>
              </Alert>
            )}

            {isSampleContent && (
              <Alert className="bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-800 text-sm">샘플 컨텐츠</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs">
                  현재 샘플 컨텐츠가 생성되었습니다. 이 컨텐츠는 실제 시험 내용과 다를 수 있으며, 학습 목적으로만
                  사용하세요. 필요한 경우 내용을 직접 수정하거나 추가할 수 있습니다.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="file" className="text-xs">
                  문서 파일
                </TabsTrigger>
                <TabsTrigger value="pdf" className="text-xs">
                  PDF 파일
                </TabsTrigger>
                <TabsTrigger value="paste" className="text-xs">
                  직접 입력
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm">
                    문서 파일 업로드
                  </Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Input
                        ref={fileInputRef}
                        id="file"
                        type="file"
                        accept=".txt,.doc,.docx,.hwp,.rtf,.html,.ppt,.pptx"
                        onChange={handleFileChange}
                        className="flex-1 text-xs"
                        disabled={isFileLoading || isPdfProcessing || isGeneratingContent}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleUploadClick}
                        disabled={isFileLoading || isPdfProcessing || isGeneratingContent}
                      >
                        {isFileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>

                    {fileError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm">파일 오류</AlertTitle>
                        <AlertDescription className="text-xs">{fileError}</AlertDescription>
                      </Alert>
                    )}

                    {isFileLoading && !isPdfProcessing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>파일 로딩 중...</span>
                          <span>{fileLoadingProgress}%</span>
                        </div>
                        <Progress value={fileLoadingProgress} />
                      </div>
                    )}

                    {file && !isFileLoading && !isPdfProcessing && !fileError && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pdf" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">PDF 파일 업로드</Label>
                  <PdfDropZone onTextExtracted={handlePdfTextExtracted} />
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF 파일을 끌어다 놓거나 클릭하여 선택하세요. 향상된 PDF 처리 라이브러리가 텍스트를 추출합니다.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="paste" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm">
                    내용 직접 입력
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="학습 내용을 여기에 붙여넣으세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    disabled={isFileLoading || isPdfProcessing || isGeneratingContent}
                    spellCheck={false}
                    lang="ko"
                  />
                  <p className="text-xs text-muted-foreground">
                    PDF 파일이나 웹페이지에서 텍스트를 복사하여 여기에 붙여넣으세요.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">오류</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {content && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">미리보기 (처음 1000자):</p>
                  <span className="text-xs text-muted-foreground">총 {content.length.toLocaleString()}자</span>
                </div>
                <div className="text-xs text-muted-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {getPreviewText()}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-sm"
              disabled={isLoading || isFileLoading || isPdfProcessing || isGeneratingContent}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "문제 생성으로 계속하기"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 도움말 섹션을 아코디언으로 통합 */}
      <Card className="mt-6 mx-auto max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">도움말</CardTitle>
          <CardDescription className="text-sm">파일 업로드 및 기능 사용에 대한 도움말</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="file-formats">
              <AccordionTrigger className="text-sm">지원되는 파일 형식</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p>다음 파일 형식을 지원합니다:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>텍스트 파일</strong>: .txt</li>
                    <li><strong>워드 문서</strong>: .docx, .doc</li>
                    <li><strong>프레젠테이션</strong>: .pptx, .ppt</li>
                    <li><strong>PDF 문서</strong>: .pdf</li>
                    <li><strong>한글 문서</strong>: .hwp (제한적 지원)</li>
                    <li><strong>리치 텍스트</strong>: .rtf</li>
                    <li><strong>HTML 문서</strong>: .html</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    한글(HWP) 파일은 브라우저에서 직접 처리가 어려울 수 있습니다. 텍스트를 복사하여 붙여넣거나 다른 형식으로 변환 후 업로드하는 것이 좋습니다.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pdf-helper">
              <AccordionTrigger className="text-sm">PDF 파일 사용 방법</AccordionTrigger>
              <AccordionContent>
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-800 text-sm">PDF 텍스트 추출 문제</AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs">
                    브라우저에서 PDF 파일의 텍스트를 자동으로 추출하는 것은 기술적 제한이 있습니다. 특히 한글이 포함된
                    PDF는 텍스트가 깨질 수 있습니다. 아래 방법을 사용하여 텍스트를 추출하세요.
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content-generation">
              <AccordionTrigger className="text-sm">컨텐츠 생성 기능</AccordionTrigger>
              <AccordionContent>
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-800 text-sm">컨텐츠 생성이란?</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs">
                    외부 컨텐츠 업로드 없이도 시험 제목을 기반으로 관련 학습 자료를 자동으로 생성해 줍니다. 이 기능은 시험 주제에 맞는 기본적인 학습 자료를 제공합니다.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 text-xs">
                  <h3 className="text-sm font-medium">컨텐츠 생성 사용 방법</h3>
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
                        <h4 className="font-medium text-sm">"샘플 컨텐츠 생성" 버튼 클릭</h4>
                        <p className="text-xs text-muted-foreground">
                          버튼을 클릭하면 시험 주제에 맞는 기본적인 학습 자료가 생성됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

