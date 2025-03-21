"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Document, Section } from "@/types/document"
import ReactMarkdown from "react-markdown"

interface ScriptExtractorProps {
  document: Document
}

export function ScriptExtractor({ document }: ScriptExtractorProps) {
  const [open, setOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleExtract = async () => {
    try {
      setIsLoading(true)
      setSummary(null)

      const response = await fetch("/api/script-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.id,
          sectionId: selectedSectionId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "스크립트 추출 중 오류가 발생했습니다.")
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("스크립트 추출 오류:", error)
      toast({
        title: "스크립트 추출 실패",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      toast({
        title: "복사 완료",
        description: "요약 내용이 클립보드에 복사되었습니다.",
      })
    }
  }

  const handleDownload = () => {
    if (summary) {
      const blob = new Blob([summary], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${document.title}-요약.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          스크립트 추출
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>스크립트 추출 및 요약</DialogTitle>
          <DialogDescription>
            문서 내용을 요약하여 핵심 내용을 추출합니다. 전체 문서 또는 특정 섹션을 선택할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">섹션 선택</label>
            <Select value={selectedSectionId || ""} onValueChange={(value) => setSelectedSectionId(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="전체 문서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 문서</SelectItem>
                {document.sections.map((section: Section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExtract} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                요약 생성 중...
              </>
            ) : (
              "요약 생성"
            )}
          </Button>

          {summary && (
            <div className="mt-4 space-y-4">
              <div className="rounded-md border p-4 bg-muted/30">
                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{summary}</ReactMarkdown>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  클립보드에 복사
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  텍스트 파일로 다운로드
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

