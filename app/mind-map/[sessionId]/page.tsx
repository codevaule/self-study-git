"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, { Background, Controls, MiniMap, Panel, useNodesState, useEdgesState, MarkerType } from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Download, FileText, Lightbulb } from "lucide-react"
import { getStudySession } from "@/lib/study-session"
import { generateMindMap, convertToReactFlow, summarizeText } from "@/lib/mind-map"

export default function MindMapPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [summary, setSummary] = useState("")
  const [activeTab, setActiveTab] = useState("mind-map")

  // 세션 로드
  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const sessionData = await getStudySession(params.sessionId)
        if (!sessionData) {
          setError("학습 세션을 찾을 수 없습니다.")
          setIsLoading(false)
          return
        }

        setSession(sessionData)

        // 마인드맵 생성
        const mindMap = generateMindMap(sessionData.content, sessionData.title)
        const { nodes: flowNodes, edges: flowEdges } = convertToReactFlow(mindMap)

        // 노드 스타일 설정
        const styledNodes = flowNodes.map((node) => ({
          ...node,
          style: {
            background: node.type === "input" ? "#e2f0fd" : node.type === "output" ? "#f0e7fd" : "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            fontSize: node.type === "input" ? "16px" : "14px",
            fontWeight: node.type === "input" ? "bold" : "normal",
            width: node.type === "output" ? 300 : "auto",
            maxWidth: 300,
          },
        }))

        // 엣지 스타일 설정
        const styledEdges = flowEdges.map((edge) => ({
          ...edge,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: "#888",
          },
          style: {
            stroke: "#888",
            strokeWidth: 2,
          },
        }))

        setNodes(styledNodes)
        setEdges(styledEdges)

        // 텍스트 요약 생성
        const textSummary = summarizeText(sessionData.content, 500)
        setSummary(textSummary)

        setIsLoading(false)
      } catch (error) {
        console.error("마인드맵 생성 오류:", error)
        setError("마인드맵을 생성하는 중 오류가 발생했습니다.")
        setIsLoading(false)
      }
    }

    loadSession()
  }, [params.sessionId])

  // 마인드맵 다운로드
  const downloadMindMap = useCallback(() => {
    const svgElement = document.querySelector(".react-flow__renderer svg")
    if (!svgElement) return

    // SVG를 문자열로 변환
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    // 다운로드 링크 생성
    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `${session?.title || "mind-map"}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }, [session])

  // 요약 다운로드
  const downloadSummary = useCallback(() => {
    if (!summary) return

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = `${session?.title || "summary"}.txt`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
  }, [summary, session])

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">마인드맵 생성 중...</p>
        </div>
      </div>
    )
  }

  // 오류 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>마인드맵 생성 실패</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 space-y-4">
              <p className="text-sm">다음 중 하나의 방법을 시도해 보세요:</p>
              <div className="grid gap-3">
                <Button onClick={() => router.push("/sessions")} variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  학습 세션 목록으로 돌아가기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{session?.title} - 마인드맵</h1>
        <Button variant="outline" asChild>
          <a href={`/sessions`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            세션 목록으로
          </a>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="mind-map">마인드맵</TabsTrigger>
          <TabsTrigger value="summary">요약</TabsTrigger>
        </TabsList>

        <TabsContent value="mind-map">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>마인드맵 시각화</CardTitle>
              <CardDescription>
                학습 내용을 시각적으로 구조화한 마인드맵입니다. 노드를 드래그하여 위치를 조정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "70vh", width: "100%" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                  <Panel position="top-right">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadMindMap()}>
                        <Download className="h-4 w-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>내용 요약</CardTitle>
              <CardDescription>학습 내용의 핵심 포인트를 요약한 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-medium">핵심 요약</h3>
                    <p className="text-sm text-muted-foreground">
                      이 요약은 AI가 자동으로 생성한 것으로, 원본 내용의 중요 포인트를 담고 있습니다.
                    </p>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm">{summary}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={downloadSummary}>
                <FileText className="h-4 w-4 mr-2" />
                요약 다운로드
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

