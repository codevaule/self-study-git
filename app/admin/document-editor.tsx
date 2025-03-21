"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Save, Download, RefreshCw, AlertCircle } from "lucide-react"

// 기본 문서 템플릿
const DEFAULT_DOCUMENT = `# Study Helper 프로젝트 문서

## 1. 프로젝트 개요

Study Helper는 사용자가 학습 자료를 업로드하고 해당 자료를 기반으로 문제를 생성하여 학습할 수 있는 웹 애플리케이션입니다. 이 애플리케이션은 다양한 학습 모드와 기능을 제공하여 효율적인 학습을 지원합니다.

### 주요 기능
- 다양한 형식의 문서 업로드 및 텍스트 추출
- 컨텐츠 기반 문제 자동 생성 (객관식, 주관식)
- 학습 세션 관리 및 진행 상황 추적
- 크로스워드 퍼즐 생성
- 학습 계획 설정 및 관리

## 2. 기술 스택

### 프론트엔드
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui 컴포넌트

### 데이터 관리
- LocalStorage (클라이언트 측 데이터 저장)

### 문서 처리
- PDF.js (PDF 파일 처리)
- Tesseract.js (OCR 기능)

## 3. 아키텍처

### 컴포넌트 구조
- app/ - 페이지 및 라우팅
- components/ - 재사용 가능한 UI 컴포넌트
- lib/ - 유틸리티 함수 및 핵심 로직

### 데이터 흐름
1. 사용자가 문서 업로드 또는 텍스트 입력
2. 문서 처리 및 텍스트 추출
3. 컨텐츠 기반 문제 생성
4. 학습 세션 생성 및 저장
5. 사용자 학습 및 진행 상황 추적

## 4. 주요 모듈 설명

### 문서 처리 모듈
- document-converter.ts: 다양한 문서 형식을 텍스트로 변환
- pdf-utils.ts: PDF 파일 처리 및 텍스트 추출
- ocr-pdf-utils.ts: OCR을 이용한 이미지 기반 PDF 텍스트 추출

### 문제 생성 모듈
- question-generator.ts: 문제 생성 메인 로직
- content-based-generator.ts: 컨텐츠 기반 문제 생성 로직
- crossword-generator.ts: 크로스워드 퍼즐 생성 로직

### 학습 관리 모듈
- study-session.ts: 학습 세션 관리 및 저장
- types.ts: 타입 정의

## 5. 주요 기능 상세 설명

### 문서 업로드 및 처리
- 지원 형식: PDF, TXT, DOCX, HTML, RTF
- PDF 처리: 텍스트 레이어 추출 및 OCR 기능
- 텍스트 정규화 및 검증

### 문제 생성
- 컨텐츠 분석: 키워드 추출, 중요 문장 식별
- 객관식 문제: 정답 및 오답 생성
- 주관식 문제: 빈칸 채우기 형식
- 문제 검증 및 필터링

### 학습 세션
- 세션 생성 및 저장
- 진행 상황 추적
- 오답 및 표시된 문제 관리
- 학습 계획 설정 및 진행 관리

### 크로스워드 퍼즐
- 컨텐츠 기반 단어 및 힌트 추출
- 퍼즐 레이아웃 생성
- 사용자 입력 처리 및 검증

## 6. 개발 요건 및 테스트 상태

| 요구사항 | 상태 | 비고 |
|---------|------|------|
| 문서 업로드 기능 | 완료 | PDF, TXT, DOCX, HTML, RTF 지원 |
| PDF 텍스트 추출 | 완료 | 텍스트 레이어 추출 및 OCR 지원 |
| 컨텐츠 기반 문제 생성 | 완료 | API 의존성 없이 클라이언트 측에서 처리 |
| 객관식 문제 지원 | 완료 | 정답 및 오답 자동 생성 |
| 주관식 문제 지원 | 완료 | 빈칸 채우기 형식 |
| 학습 세션 관리 | 완료 | LocalStorage 기반 저장 |
| 학습 진행 상황 추적 | 완료 | 정답률 및 진행 상태 표시 |
| 오답 및 표시 문제 관리 | 완료 | 필터링 및 재학습 지원 |
| 학습 계획 설정 | 완료 | 일일 목표 및 진행 관리 |
| 크로스워드 퍼즐 생성 | 완료 | 컨텐츠 기반 단어 추출 |
| 문서 다운로드 기능 | 완료 | 텍스트 파일 형식 지원 |
| 반응형 UI | 완료 | 모바일 및 데스크톱 지원 |
| 다크 모드 지원 | 완료 | 시스템 설정 연동 |
| 문서화 | 완료 | 코드 주석 및 문서 제공 |

## 7. 알려진 이슈 및 제한사항

### LocalStorage 제한
- 브라우저당 약 5MB의 저장 공간 제한
- 대용량 학습 자료 저장 시 할당량 초과 가능성
- 해결책: 오래된 세션 자동 정리, 컨텐츠 크기 제한

### 문서 처리 제한
- 브라우저 환경에서 DOCX, HWP 등의 복잡한 문서 형식 처리 제한
- 이미지 기반 PDF의 OCR 처리 정확도 제한
- 해결책: 사용자에게 대체 방법 안내

### 문제 생성 제한
- 컨텐츠 품질에 따른 문제 품질 차이
- 복잡한 개념이나 수식 처리 제한
- 해결책: 문제 필터링 및 검증 로직 강화

## 8. 향후 개선 계획

### 기능 개선
- 서버 측 문서 처리 및 저장 기능 추가
- 사용자 계정 및 인증 시스템 구현
- 고급 학습 분석 및 통계 기능 추가
- 다양한 학습 모드 추가 (플래시카드, 매칭 게임 등)

### 기술적 개선
- 서버 데이터베이스 연동
- 성능 최적화
- 접근성 개선
- 다국어 지원

## 9. 개발자 정보

이 프로젝트는 Study Helper 개발팀에 의해 개발되었습니다.

## 10. 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

문서 생성일: ${new Date().toLocaleDateString()}
`

/**
 * 관리자용 문서 편집기 컴포넌트
 *
 * 이 컴포넌트는 프로젝트 문서를 편집하고 관리할 수 있는 기능을 제공합니다.
 *
 * @param onSave 저장 콜백 함수
 * @param onDownload 다운로드 콜백 함수
 * @returns 문서 편집기 컴포넌트
 */
export default function AdminDocumentEditor({
  onSave,
  onDownload,
}: {
  onSave: (content: string) => boolean
  onDownload: (content: string) => void
}) {
  const [documentContent, setDocumentContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null)
  const [saveMessage, setSaveMessage] = useState("")

  // 문서 내용 로드
  useEffect(() => {
    const loadDocument = () => {
      const savedDoc = localStorage.getItem("project-documentation")
      if (savedDoc) {
        setDocumentContent(savedDoc)
      } else {
        setDocumentContent(DEFAULT_DOCUMENT)
      }
    }

    loadDocument()
  }, [])

  // 문서 저장 처리
  const handleSave = () => {
    setIsSaving(true)
    setSaveStatus(null)

    try {
      const success = onSave(documentContent)

      if (success) {
        setSaveStatus("success")
        setSaveMessage("문서가 성공적으로 저장되었습니다.")
      } else {
        setSaveStatus("error")
        setSaveMessage("문서 저장 중 오류가 발생했습니다.")
      }
    } catch (error) {
      setSaveStatus("error")
      setSaveMessage("문서 저장 중 오류가 발생했습니다.")
      console.error("문서 저장 오류:", error)
    } finally {
      setIsSaving(false)

      // 3초 후 상태 메시지 숨기기
      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    }
  }

  // 문서 다운로드 처리
  const handleDownload = () => {
    onDownload(documentContent)
  }

  // 문서 초기화 처리
  const handleReset = () => {
    if (confirm("문서를 기본 템플릿으로 초기화하시겠습니까? 모든 변경 사항이 손실됩니다.")) {
      setDocumentContent(DEFAULT_DOCUMENT)
    }
  }

  return (
    <div className="space-y-4">
      {saveStatus && (
        <Alert variant={saveStatus === "success" ? "default" : "destructive"}>
          {saveStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{saveStatus === "success" ? "성공" : "오류"}</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <Textarea
        value={documentContent}
        onChange={(e) => setDocumentContent(e.target.value)}
        className="min-h-[500px] font-mono text-sm"
        placeholder="프로젝트 문서 내용을 입력하세요..."
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              저장
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          다운로드
        </Button>

        <Button variant="outline" onClick={handleReset} className="gap-2 ml-auto">
          <RefreshCw className="h-4 w-4" />
          초기화
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>* 문서는 마크다운 형식으로 작성됩니다.</p>
        <p>* 변경 사항은 자동으로 저장되지 않습니다. 작업 후 반드시 저장 버튼을 클릭하세요.</p>
        <p>* 문서는 브라우저의 로컬 스토리지에 저장됩니다. 브라우저 데이터를 삭제하면 문서도 삭제됩니다.</p>
      </div>
    </div>
  )
}

