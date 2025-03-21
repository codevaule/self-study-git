"use client"

import type React from "react"

import { useState } from "react"
import { MindMapVisualization } from "@/components/mindmap/mindmap-visualization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 마인드맵 노드 타입
interface MindMapNode {
  id: string
  name: string
  children?: MindMapNode[]
}

export default function MindMapPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentContent, setDocumentContent] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    // 파일 타입 확인
    if (
      ![
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setError("Unsupported file type. Please upload PDF, TXT, or DOCX files.")
      setIsLoading(false)
      return
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.")
      setIsLoading(false)
      return
    }

    // 파일 읽기 (실제 구현에서는 API 호출)
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        // 실제 구현에서는 API 호출하여 마인드맵 데이터 생성
        // 여기서는 샘플 데이터 사용
        setTimeout(() => {
          setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""))
          setMindMapData({
            id: "root",
            name: file.name.replace(/\.[^/.]+$/, ""),
            children: [
              {
                id: "topic1",
                name: "Main Topic 1",
                children: [
                  { id: "subtopic1_1", name: "Subtopic 1.1" },
                  { id: "subtopic1_2", name: "Subtopic 1.2" },
                ],
              },
              {
                id: "topic2",
                name: "Main Topic 2",
                children: [
                  { id: "subtopic2_1", name: "Subtopic 2.1" },
                  { id: "subtopic2_2", name: "Subtopic 2.2" },
                ],
              },
            ],
          })
          setIsLoading(false)
          setActiveTab("view")
        }, 1500)
      } catch (err) {
        setError((err as Error).message)
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      setError("Error reading file.")
      setIsLoading(false)
    }

    reader.readAsText(file)
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!documentTitle || !documentContent) {
      setError("Please provide both title and content.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 실제 구현에서는 API 호출하여 마인드맵 데이터 생성
      // 여기서는 샘플 데이터 사용
      setTimeout(() => {
        setMindMapData({
          id: "root",
          name: documentTitle,
          children: [
            {
              id: "topic1",
              name: "Main Topic 1",
              children: [
                { id: "subtopic1_1", name: "Subtopic 1.1" },
                { id: "subtopic1_2", name: "Subtopic 1.2" },
              ],
            },
            {
              id: "topic2",
              name: "Main Topic 2",
              children: [
                { id: "subtopic2_1", name: "Subtopic 2.1" },
                { id: "subtopic2_2", name: "Subtopic 2.2" },
              ],
            },
          ],
        })
        setIsLoading(false)
        setActiveTab("view")
      }, 1500)
    } catch (err) {
      setError((err as Error).message)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mind Map Visualization</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="text">Enter Text</TabsTrigger>
          {mindMapData && <TabsTrigger value="view">View Mind Map</TabsTrigger>}
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a document to generate a mind map visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mb-4">Supports PDF, TXT, and DOCX files up to 10MB</p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
                <label htmlFor="file-upload">
                  <Button as="span" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Select File"}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Enter Text</CardTitle>
              <CardDescription>Enter document content to generate a mind map visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter document title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Document Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter document content"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    rows={10}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Generating Mind Map..." : "Generate Mind Map"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          {mindMapData && <MindMapVisualization data={mindMapData} width={800} height={600} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

