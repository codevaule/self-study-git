import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface OcrStatusProps {
  isProcessing: boolean
  progress: number
  currentPage: number
  totalPages: number
  status: string
  error: string | null
}

export default function OcrStatus({ isProcessing, progress, currentPage, totalPages, status, error }: OcrStatusProps) {
  if (!isProcessing && !error) return null

  return (
    <div className="space-y-4 mt-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">{status}</span>
            </div>
            <span className="text-sm">{progress}%</span>
          </div>

          <Progress value={progress} className="h-2" />

          {currentPage > 0 && totalPages > 0 && (
            <p className="text-xs text-muted-foreground">
              페이지 처리 중 {currentPage}/{totalPages}...
            </p>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>OCR 처리 오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isProcessing && !error && progress === 100 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">OCR 처리 완료</AlertTitle>
          <AlertDescription className="text-green-700">PDF에서 텍스트 추출이 완료되었습니다.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

