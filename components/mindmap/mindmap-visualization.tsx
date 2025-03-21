"use client"

import { useRef, useState, useEffect } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ZoomIn, ZoomOut, Download, Share } from "lucide-react"

// 마인드맵 노드 타입
interface MindMapNode {
  id: string
  name: string
  children?: MindMapNode[]
  value?: number
  depth?: number
  parent?: MindMapNode
  x?: number
  y?: number
  x0?: number
  y0?: number
}

// 마인드맵 링크 타입
interface MindMapLink {
  source: MindMapNode
  target: MindMapNode
}

// 마인드맵 시각화 컴포넌트 props
interface MindMapVisualizationProps {
  data?: MindMapNode
  width?: number
  height?: number
}

// 샘플 데이터
const sampleData: MindMapNode = {
  id: "root",
  name: "학습 주제",
  children: [
    {
      id: "mathematics",
      name: "수학",
      children: [
        { id: "algebra", name: "대수학" },
        { id: "geometry", name: "기하학" },
        { id: "calculus", name: "미적분학" },
        { id: "statistics", name: "통계학" },
      ],
    },
    {
      id: "physics",
      name: "물리학",
      children: [
        { id: "mechanics", name: "역학" },
        { id: "electromagnetism", name: "전자기학" },
        { id: "thermodynamics", name: "열역학" },
        { id: "quantum_mechanics", name: "양자역학" },
      ],
    },
    {
      id: "computer_science",
      name: "컴퓨터 과학",
      children: [
        { id: "algorithms", name: "알고리즘" },
        { id: "data_structures", name: "자료구조" },
        { id: "programming_languages", name: "프로그래밍 언어" },
        { id: "artificial_intelligence", name: "인공지능" },
      ],
    },
    {
      id: "quantum_physics",
      name: "양자 물리학",
      children: [
        { id: "quantum_mechanics", name: "양자 역학" }
      ]
    },
    {
      id: "relativity",
      name: "상대성 이론",
      children: [
        { id: "special_relativity", name: "특수 상대성 이론" },
        { id: "general_relativity", name: "일반 상대성 이론" }
      ]
    }
  ],
}

export function MindMapVisualization({ data = sampleData, width = 800, height = 600 }: MindMapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [layout, setLayout] = useState<"tree" | "radial">("tree")
  const [zoom, setZoom] = useState(1)
  const [linkType, setLinkType] = useState<"curve" | "straight">("curve")
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // SVG 요소 초기화
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // 마진 설정
    const margin = { top: 20, right: 90, bottom: 30, left: 90 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 그룹 요소 생성
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 레이아웃 선택
    let root
    if (layout === "tree") {
      // 트리 레이아웃
      const treeLayout = d3.tree<MindMapNode>().size([innerHeight, innerWidth])
      root = d3.hierarchy(data)
      treeLayout(root)
    } else {
      // 방사형 레이아웃
      const radius = Math.min(innerWidth, innerHeight) / 2
      const radialLayout = d3.cluster<MindMapNode>().size([2 * Math.PI, radius])
      root = d3.hierarchy(data)
      radialLayout(root)

      // 극좌표 변환
      root.each((d: any) => {
        d.x0 = d.x
        d.y0 = d.y
        d.x = d.y * Math.cos(d.x)
        d.y = d.y * Math.sin(d.x)
      })
    }

    // 링크 생성
    const links = root.links()
    const linkGenerator = linkType === "curve" 
      ? d3.linkHorizontal<any, any>().x((d) => d.y).y((d) => d.x)
      : d3.linkVertical<any, any>().x((d) => d.y).y((d) => d.x)

    // 링크 그리기
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", layout === "tree" ? linkGenerator : (d) => {
        return `M${d.source.y},${d.source.x}L${d.target.y},${d.target.x}`
      })
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)

    // 노드 그룹 생성
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", (d) => `node ${d.children ? "node--internal" : "node--leaf"}`)
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .on("click", (event, d: any) => {
        setSelectedNode(d.data)
      })

    // 노드 원 그리기
    node
      .append("circle")
      .attr("r", 7)
      .attr("fill", (d: any) => (d.children ? "#69b3a2" : "#f8a100"))
      .attr("stroke", "white")
      .attr("stroke-width", 2)

    // 노드 텍스트 추가
    node
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d: any) => (d.children ? -12 : 12))
      .style("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .style("font-size", "12px")
      .text((d: any) => d.data.name)
      .style("fill", "#333")
  }, [data, layout, linkType, width, height])

  // 줌 이벤트 처리
  const handleZoom = (event: any) => {
    if (!svgRef.current) return
    const newZoom = Math.max(0.5, Math.min(2, zoom + event))
    setZoom(newZoom)
    
    d3.select(svgRef.current)
      .select("g")
      .attr("transform", `translate(${width / 4},${height / 4}) scale(${newZoom})`)
  }

  const handleZoomIn = () => {
    handleZoom(0.1)
  }

  const handleZoomOut = () => {
    handleZoom(-0.1)
  }

  const handleDownload = () => {
    if (!svgRef.current) return
    
    // SVG 데이터 가져오기
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    // 다운로드 링크 생성
    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = "mindmap.svg"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>마인드맵 시각화</CardTitle>
        <CardDescription>학습 주제를 시각적으로 구조화하여 표현합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="flex space-x-2 mb-4">
              <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="레이아웃 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tree">트리</SelectItem>
                  <SelectItem value="radial">방사형</SelectItem>
                </SelectContent>
              </Select>
              <Select value={linkType} onValueChange={(value: any) => setLinkType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="링크 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curve">곡선</SelectItem>
                  <SelectItem value="straight">직선</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative w-full h-[500px] border rounded-md overflow-hidden">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          ></svg>
        </div>
        {selectedNode && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">{selectedNode.name}</h3>
            <p className="text-sm text-gray-500">ID: {selectedNode.id}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">
          마인드맵을 통해 학습 주제 간의 관계를 시각적으로 이해할 수 있습니다.
        </p>
      </CardFooter>
    </Card>
  )
}

