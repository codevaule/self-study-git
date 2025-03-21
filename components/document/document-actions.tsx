"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Document } from "@/types/document"
import { MoreHorizontal, Trash, Edit, Download, Share } from "lucide-react"
import { ScriptExtractor } from "./script-extractor"

interface DocumentActionsProps {
  document: Document
}

export function DocumentActions({ document }: DocumentActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("문서 삭제 중 오류가 발생했습니다.")
      }

      router.push("/documents")
      router.refresh()

      toast({
        title: "문서 삭제 완료",
        description: "문서가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      console.error("문서 삭제 오류:", error)
      toast({
        title: "문서 삭제 실패",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteAlert(false)
    }
  }

  const handleExport = () => {
    try {
      const documentData = JSON.stringify(document, null, 2)
      const blob = new Blob([documentData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${document.title}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "문서 내보내기 완료",
        description: "문서가 JSON 파일로 내보내기 되었습니다.",
      })
    } catch (error) {
      console.error("문서 내보내기 오류:", error)
      toast({
        title: "문서 내보내기 실패",
        description: "문서를 내보내는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ScriptExtractor document={document} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">더 보기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/documents/${document.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            편집
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/documents/${document.id}/share`)}>
            <Share className="mr-2 h-4 w-4" />
            공유
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 문서와 관련된 모든 데이터가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

