"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, FileText, AlertCircle, Copy, Check, ExternalLink, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { extractTextFromPdf, loadPdfLibrary } from "@/lib/enhanced-pdf-utils"
import { extractTextFromPdfWithOcr } from "@/lib/ocr-pdf-utils"
import { addOcrProgressListener } from "@/lib/ocr-events"
import { validateExtractedText } from "@/lib/text-validator"
import OcrStatus from "./ocr-status"

interface PdfDropZoneProps {
  onTextExtracted: (text: string) => void
}

export default function PdfDropZone({ onTextExtracted }: PdfDropZoneProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [manualText, setManualText] = useState("")
  const [copied, setCopied] = useState(false)
  const [extractionMethod, setExtractionMethod] = useState<string | null>(null)
  const [libraryLoaded, setLibraryLoaded] = useState(false)
  const [useOcr, setUseOcr] = useState(false)
  const [ocrStatus, setOcrStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load PDF library on component mount
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const loaded = await loadPdfLibrary()
        setLibraryLoaded(loaded)
      } catch (error) {
        console.warn("Failed to load PDF library:", error)
      }
    }

    loadLibrary()

    // Register OCR progress listener
    const removeListener = addOcrProgressListener((event) => {
      setCurrentPage(event.page)
      setTotalPages(event.pages)
      setOcrStatus(event.status)
      setProgress(Math.min(90, Math.round((event.page / event.pages) * 90)))
    })

    return () => {
      removeListener()
    }
  }, [])

  // Process PDF file
  const processPdf = async (pdfFile: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setPdfUrl(null)
    setExtractionMethod(null)
    setCurrentPage(0)
    setTotalPages(0)
    setOcrStatus("")

    // Create PDF URL for preview
    const url = URL.createObjectURL(pdfFile)
    setPdfUrl(url)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 200)

    try {
      let extractedText = ""

      if (useOcr) {
        // Extract text using OCR
        setExtractionMethod("Extracting text from PDF using OCR...")
        extractedText = await extractTextFromPdfWithOcr(pdfFile)
      } else {
        // Extract text using regular method
        setExtractionMethod("Extracting text from PDF...")
        extractedText = await extractTextFromPdf(pdfFile)
      }

      clearInterval(progressInterval)
      setProgress(100)

      // Validate extracted text
      const validation = validateExtractedText(extractedText, pdfFile.name)

      if (!validation.isValid) {
        setError(validation.warning || "Failed to extract text from PDF. Try using OCR.")
      }

      // Set extracted text in textarea
      setManualText(extractedText)

      // Delay completion for better UX
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    } catch (err) {
      clearInterval(progressInterval)
      console.error("PDF processing error:", err)
      setError(`Failed to extract text from PDF: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const pdfFile = acceptedFiles[0]
      if (!pdfFile || !pdfFile.type.includes("pdf")) {
        setError("Only PDF files are allowed.")
        return
      }

      setFile(pdfFile)
      await processPdf(pdfFile)
    },
    [useOcr],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  })

  // Submit manually entered text
  const handleManualTextSubmit = () => {
    if (manualText.trim()) {
      onTextExtracted(manualText)
    }
  }

  // Copy PDF URL to clipboard
  const copyPdfUrl = () => {
    if (pdfUrl) {
      navigator.clipboard.writeText(pdfUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Open PDF in new window
  const openPdfInNewWindow = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank")
    }
  }

  // Toggle OCR
  const handleOcrToggle = (checked: boolean) => {
    setUseOcr(checked)

    // Reprocess file if already selected
    if (file) {
      processPdf(file)
    }
  }

  return (
    <div className="mt-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upload">PDF 업로드</TabsTrigger>
          <TabsTrigger value="manual">직접 텍스트 입력</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Switch id="use-ocr" checked={useOcr} onCheckedChange={handleOcrToggle} disabled={isProcessing} />
              <Label htmlFor="use-ocr" className="flex items-center gap-1">
                <Scan className="h-4 w-4" />
                OCR 사용 (이미지 기반 PDF 및 한글 텍스트용)
              </Label>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>PDF 처리 중...</p>
                {extractionMethod && <p className="text-xs text-muted-foreground">{extractionMethod}</p>}
                <Progress value={progress} className="w-full max-w-xs" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "PDF 파일을 여기에 놓으세요" : "PDF 파일을 끌어다 놓거나 클릭하여 선택하세요"}
                </p>
                {libraryLoaded && <span className="text-xs text-green-600">PDF library loaded</span>}
                {useOcr && (
                  <span className="text-xs text-blue-600">OCR 활성화됨 (이미지 기반 PDF 및 한글 텍스트용)</span>
                )}
              </div>
            )}

            {file && !isProcessing && !error && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-primary">
                <FileText className="h-4 w-4" />
                <span>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
            )}
          </div>

          <OcrStatus
            isProcessing={isProcessing && useOcr}
            progress={progress}
            currentPage={currentPage}
            totalPages={totalPages}
            status={ocrStatus || "Processing with OCR..."}
            error={error}
          />

          {error && !useOcr && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>PDF 처리 오류</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
                <p className="mt-2 text-sm">이미지 기반 또는 스캔된 PDF의 경우 OCR을 활성화해 보세요.</p>
                {pdfUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-2">PDF를 열어 텍스트를 수동으로 복사해 보세요:</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={openPdfInNewWindow}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        PDF 열기
                      </Button>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {pdfUrl && !error && (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">PDF 파일 처리 완료</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p className="mb-2">
                    추출된 텍스트를 검토하고 필요한 경우 수정한 후 "텍스트 사용하기" 버튼을 클릭하세요.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={openPdfInNewWindow}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      PDF 열기
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={copyPdfUrl}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          URL 복사
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="text-sm font-medium">추출된 텍스트 (필요시 수정):</p>
                <Textarea
                  ref={textareaRef}
                  placeholder="PDF에서 추출된 텍스트가 여기에 표시됩니다..."
                  className="min-h-[200px] font-mono"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleManualTextSubmit} disabled={!manualText.trim()}>
                    텍스트 사용하기
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-muted-foreground">
            <p>
              <strong>참고:</strong> 자동 추출이 실패하면 PDF를 열어 텍스트를 수동으로 복사하세요. 이미지 기반 또는
              스캔된 PDF의 경우 OCR을 활성화하세요.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">PDF 내용 직접 입력:</p>
            <Textarea
              placeholder="PDF 내용을 여기에 입력하거나 붙여넣으세요..."
              className="min-h-[200px]"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleManualTextSubmit} disabled={!manualText.trim()}>
                텍스트 사용하기
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

