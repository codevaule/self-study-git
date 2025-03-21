"use client"

import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// 차트 데이터 타입
interface ChartData {
  [key: string]: any
}

// 차트 공통 속성
interface ChartProps {
  data: ChartData[]
  height?: number
  className?: string
}

// 라인 차트 속성
interface LineChartProps extends ChartProps {
  xField: string
  yField: string
}

// 바 차트 속성
interface BarChartProps extends ChartProps {
  xField: string
  yField: string
}

// 파이 차트 속성
interface PieChartProps extends ChartProps {
  nameField: string
  valueField: string
}

// 차트 컴포넌트 로딩 상태
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <Skeleton style={{ height: `${height}px` }} />
}

// 라인 차트 컴포넌트
export function LineChart({ data, xField, yField, height = 300, className }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const chart: any = null

    const initChart = async () => {
      try {
        setIsLoading(true)

        if (!chartRef.current) return

        // 차트 라이브러리 동적 로드 (실제 구현에서는 적절한 차트 라이브러리 사용)
        // 여기서는 간단한 캔버스 기반 차트를 그린다고 가정
        const canvas = document.createElement("canvas")
        canvas.width = chartRef.current.clientWidth
        canvas.height = height
        chartRef.current.innerHTML = ""
        chartRef.current.appendChild(canvas)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 간단한 라인 차트 그리기
        const maxValue = Math.max(...data.map((item) => item[yField]))
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2

        // 배경 그리기
        ctx.fillStyle = "#f9fafb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 축 그리기
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.strokeStyle = "#e5e7eb"
        ctx.stroke()

        // 데이터 포인트 그리기
        ctx.beginPath()
        data.forEach((item, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth
          const y = canvas.height - padding - (item[yField] / maxValue) * chartHeight

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          // x축 레이블
          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          if (index % Math.ceil(data.length / 10) === 0 || index === data.length - 1) {
            ctx.fillText(item[xField], x, canvas.height - padding + 15)
          }
        })

        // 선 스타일 설정
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // 영역 채우기
        ctx.lineTo(padding + chartWidth, canvas.height - padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.closePath()
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
        ctx.fill()

        // y축 레이블
        for (let i = 0; i <= 5; i++) {
          const y = canvas.height - padding - (i / 5) * chartHeight
          const value = Math.round((i / 5) * maxValue)

          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "right"
          ctx.fillText(value.toLocaleString(), padding - 5, y + 3)

          // 그리드 라인
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(canvas.width - padding, y)
          ctx.strokeStyle = "#e5e7eb"
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      } catch (error) {
        console.error("Failed to initialize chart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initChart()

    return () => {
      if (chart) {
        // 차트 정리 (필요한 경우)
      }
    }
  }, [data, xField, yField, height])

  if (isLoading) {
    return <ChartSkeleton height={height} />
  }

  return <div ref={chartRef} className={className} style={{ height: `${height}px` }} />
}

// 바 차트 컴포넌트
export function BarChart({ data, xField, yField, height = 300, className }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const chart: any = null

    const initChart = async () => {
      try {
        setIsLoading(true)

        if (!chartRef.current) return

        // 차트 라이브러리 동적 로드 (실제 구현에서는 적절한 차트 라이브러리 사용)
        // 여기서는 간단한 캔버스 기반 차트를 그린다고 가정
        const canvas = document.createElement("canvas")
        canvas.width = chartRef.current.clientWidth
        canvas.height = height
        chartRef.current.innerHTML = ""
        chartRef.current.appendChild(canvas)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 간단한 바 차트 그리기
        const maxValue = Math.max(...data.map((item) => item[yField]))
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        const barWidth = (chartWidth / data.length) * 0.8
        const barSpacing = (chartWidth / data.length) * 0.2

        // 배경 그리기
        ctx.fillStyle = "#f9fafb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 축 그리기
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.strokeStyle = "#e5e7eb"
        ctx.stroke()

        // 데이터 바 그리기
        data.forEach((item, index) => {
          const x = padding + index * (barWidth + barSpacing)
          const barHeight = (item[yField] / maxValue) * chartHeight
          const y = canvas.height - padding - barHeight

          // 바 그리기
          ctx.fillStyle = "#3b82f6"
          ctx.fillRect(x, y, barWidth, barHeight)

          // x축 레이블
          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          if (index % Math.ceil(data.length / 10) === 0 || index === data.length - 1) {
            ctx.fillText(item[xField], x + barWidth / 2, canvas.height - padding + 15)
          }
        })

        // y축 레이블
        for (let i = 0; i <= 5; i++) {
          const y = canvas.height - padding - (i / 5) * chartHeight
          const value = Math.round((i / 5) * maxValue)

          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "right"
          ctx.fillText(value.toLocaleString(), padding - 5, y + 3)

          // 그리드 라인
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(canvas.width - padding, y)
          ctx.strokeStyle = "#e5e7eb"
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      } catch (error) {
        console.error("Failed to initialize chart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initChart()

    return () => {
      if (chart) {
        // 차트 정리 (필요한 경우)
      }
    }
  }, [data, xField, yField, height])

  if (isLoading) {
    return <ChartSkeleton height={height} />
  }

  return <div ref={chartRef} className={className} style={{ height: `${height}px` }} />
}

// 파이 차트 컴포넌트
export function PieChart({ data, nameField, valueField, height = 300, className }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const chart: any = null

    const initChart = async () => {
      try {
        setIsLoading(true)

        if (!chartRef.current) return

        // 차트 라이브러리 동적 로드 (실제 구현에서는 적절한 차트 라이브러리 사용)
        // 여기서는 간단한 캔버스 기반 차트를 그린다고 가정
        const canvas = document.createElement("canvas")
        canvas.width = chartRef.current.clientWidth
        canvas.height = height
        chartRef.current.innerHTML = ""
        chartRef.current.appendChild(canvas)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 간단한 파이 차트 그리기
        const total = data.reduce((sum, item) => sum + item[valueField], 0)
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 40

        // 배경 그리기
        ctx.fillStyle = "#f9fafb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 색상 배열
        const colors = [
          "#3b82f6", // 파랑
          "#10b981", // 초록
          "#f59e0b", // 주황
          "#ef4444", // 빨강
          "#8b5cf6", // 보라
          "#ec4899", // 분홍
          "#06b6d4", // 청록
          "#f97316", // 주황-빨강
        ]

        // 파이 조각 그리기
        let startAngle = 0
        data.forEach((item, index) => {
          const sliceAngle = (2 * Math.PI * item[valueField]) / total
          const endAngle = startAngle + sliceAngle

          // 파이 조각 그리기
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()

          // 색상 설정
          ctx.fillStyle = colors[index % colors.length]
          ctx.fill()

          // 테두리 그리기
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()

          // 레이블 위치 계산
          const midAngle = startAngle + sliceAngle / 2
          const labelRadius = radius * 0.7
          const labelX = centerX + labelRadius * Math.cos(midAngle)
          const labelY = centerY + labelRadius * Math.sin(midAngle)

          // 레이블 그리기
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(`${Math.round(item[valueField])}%`, labelX, labelY)

          // 다음 조각의 시작 각도 설정
          startAngle = endAngle
        })

        // 범례 그리기
        const legendX = canvas.width - 120
        const legendY = 20

        data.forEach((item, legendIndex) => {
          const y = legendY + legendIndex * 20

          // 색상 표시
          ctx.fillStyle = colors[legendIndex % colors.length]
          ctx.fillRect(legendX, y, 15, 15)

          // 테두리 그리기
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.strokeRect(legendX, y, 15, 15)

          // 텍스트 그리기
          ctx.fillStyle = "#374151"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.fillText(item[nameField], legendX + 20, y + 7)
        })
      } catch (error) {
        console.error("Failed to initialize chart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initChart()

    return () => {
      if (chart) {
        // 차트 정리 (필요한 경우)
      }
    }
  }, [data, nameField, valueField, height])

  if (isLoading) {
    return <ChartSkeleton height={height} />
  }

  return <div ref={chartRef} className={className} style={{ height: `${height}px` }} />
}

