"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, FileText, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 콘텐츠 타입
interface Content {
  id: string
  title: string
  type: "document" | "question" | "mindmap" | "crossword"
  status: "published" | "draft" | "archived"
  author: string
  createdAt: string
  updatedAt: string
  views: number
}

export function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // 콘텐츠 데이터 가져오기
  useEffect(() => {
    const fetchContents = async () => {
      try {
        setIsLoading(true)

        // TODO: 실제 API 호출로 대체
        // 임시 데이터
        const contentTypes = ["document", "question", "mindmap", "crossword"]
        const statusTypes = ["published", "draft", "archived"]

        const mockContents: Content[] = Array.from({ length: 20 }, (_, i) => ({
          id: `content-${i + 1}`,
          title: `콘텐츠 ${i + 1}`,
          type: contentTypes[i % contentTypes.length] as any,
          status: statusTypes[i % statusTypes.length] as any,
          author: `사용자 ${(i % 5) + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          updatedAt: new Date(Date.now() - i * 43200000).toISOString().split("T")[0],
          views: Math.floor(Math.random() * 1000),
        }))

        // 데이터 설정
        setContents(mockContents)
      } catch (error) {
        console.error("Failed to fetch contents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContents()
  }, [])

  // 콘텐츠 필터링
  const filteredContents = contents.filter((content) => {
    // 검색어 필터링
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.toLowerCase().includes(searchQuery.toLowerCase())

    // 탭 필터링
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "document" && content.type === "document") ||
      (activeTab === "question" && content.type === "question") ||
      (activeTab === "mindmap" && content.type === "mindmap") ||
      (activeTab === "crossword" && content.type === "crossword")

    return matchesSearch && matchesTab
  })

  // 콘텐츠 보기 처리
  const handleViewContent = (content: Content) => {
    setSelectedContent(content)
    setIsViewDialogOpen(true)
  }

  // 콘텐츠 편집 처리
  const handleEditContent = (content: Content) => {
    setSelectedContent(content)
    setIsEditDialogOpen(true)
  }

  // 콘텐츠 삭제 처리
  const handleDeleteContent = (content: Content) => {
    setSelectedContent(content)
    setIsDeleteDialogOpen(true)
  }

  // 콘텐츠 타입 배지 렌더링
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "document":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            문서
          </Badge>
        )
      case "question":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            질문
          </Badge>
        )
      case "mindmap":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            마인드맵
          </Badge>
        )
      case "crossword":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            크로스워드
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // 콘텐츠 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            게시됨
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            초안
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            보관됨
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">콘텐츠 관리</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          콘텐츠 추가
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="document">문서</TabsTrigger>
          <TabsTrigger value="question">질문</TabsTrigger>
          <TabsTrigger value="mindmap">마인드맵</TabsTrigger>
          <TabsTrigger value="crossword">크로스워드</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="제목 또는 작성자로 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>{renderTypeBadge(content.type)}</TableCell>
                    <TableCell>{renderStatusBadge(content.status)}</TableCell>
                    <TableCell>{content.author}</TableCell>
                    <TableCell>{content.createdAt}</TableCell>
                    <TableCell>{content.updatedAt}</TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">메뉴 열기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>작업</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewContent(content)}>
                            <Eye className="mr-2 h-4 w-4" />
                            보기
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditContent(content)}>
                            <Edit className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteContent(content)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 콘텐츠 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>콘텐츠 보기</DialogTitle>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedContent.title}</h3>
                {renderTypeBadge(selectedContent.type)}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <span>작성자: {selectedContent.author}</span>
                  <span className="mx-2">•</span>
                  <span>조회수: {selectedContent.views.toLocaleString()}</span>
                </div>
                <div>
                  <span>생성일: {selectedContent.createdAt}</span>
                  <span className="mx-2">•</span>
                  <span>수정일: {selectedContent.updatedAt}</span>
                </div>
              </div>

              <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">
                {/* 콘텐츠 내용 (실제 구현에서는 콘텐츠 유형에 따라 다르게 표시) */}
                <p className="text-muted-foreground">
                  이 부분에는 실제 콘텐츠 내용이 표시됩니다. 콘텐츠 유형에 따라 다른 형태로 렌더링됩니다.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 콘텐츠 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>콘텐츠 편집</DialogTitle>
            <DialogDescription>콘텐츠 정보를 수정합니다.</DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm font-medium">
                  제목
                </label>
                <Input id="title" defaultValue={selectedContent.title} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right text-sm font-medium">
                  유형
                </label>
                <Select defaultValue={selectedContent.type}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">문서</SelectItem>
                    <SelectItem value="question">질문</SelectItem>
                    <SelectItem value="mindmap">마인드맵</SelectItem>
                    <SelectItem value="crossword">크로스워드</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right text-sm font-medium">
                  상태
                </label>
                <Select defaultValue={selectedContent.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">게시됨</SelectItem>
                    <SelectItem value="draft">초안</SelectItem>
                    <SelectItem value="archived">보관됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 콘텐츠 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>콘텐츠 삭제</DialogTitle>
            <DialogDescription>정말로 이 콘텐츠를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>제목:</strong> {selectedContent.title}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>유형:</strong> {selectedContent.type}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

