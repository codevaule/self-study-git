import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import DocumentationDownloadButton from "./download-button"
import ProjectStatusDownload from "./project-status"

/**
 * 프로젝트 문서 페이지
 *
 * 이 페이지는 프로젝트의 개요, 아키텍처, 기능, 기술적 세부사항 등을 설명합니다.
 * 또한 개발 요건 및 테스트 상태를 표로 정리하여 제공합니다.
 *
 * @returns 문서 페이지 컴포넌트
 */
export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">프로젝트 문서</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로
            </Link>
          </Button>
          <DocumentationDownloadButton />
          <ProjectStatusDownload />
        </div>
      </div>

      <div className="grid gap-6">
        {/* 프로젝트 개요 */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 개요</CardTitle>
            <CardDescription>Study Helper 프로젝트의 목적과 주요 기능</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Study Helper는 사용자가 학습 자료를 업로드하고 해당 자료를 기반으로 문제를 생성하여 학습할 수 있는 웹
              애플리케이션입니다. 이 애플리케이션은 다양한 학습 모드와 기능을 제공하여 효율적인 학습을 지원합니다.
            </p>

            <h3 className="text-lg font-medium mb-2">주요 기능</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>다양한 형식의 문서 업로드 및 텍스트 추출</li>
              <li>컨텐츠 기반 문제 자동 생성 (객관식, 주관식)</li>
              <li>학습 세션 관리 및 진행 상황 추적</li>
              <li>크로스워드 퍼즐 생성</li>
              <li>학습 계획 설정 및 관리</li>
            </ul>
          </CardContent>
        </Card>

        {/* 아키텍처 */}
        <Card>
          <CardHeader>
            <CardTitle>아키텍처</CardTitle>
            <CardDescription>프로젝트의 구조 및 데이터 흐름</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">기술 스택</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>프론트엔드: Next.js (App Router), React, TypeScript, Tailwind CSS</li>
              <li>데이터 관리: LocalStorage (클라이언트 측 데이터 저장)</li>
              <li>문서 처리: PDF.js (PDF 파일 처리), Tesseract.js (OCR 기능)</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">컴포넌트 구조</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>app/ - 페이지 및 라우팅</li>
              <li>components/ - 재사용 가능한 UI 컴포넌트</li>
              <li>lib/ - 유틸리티 함수 및 핵심 로직</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">데이터 흐름</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>사용자가 문서 업로드 또는 텍스트 입력</li>
              <li>문서 처리 및 텍스트 추출</li>
              <li>컨텐츠 기반 문제 생성</li>
              <li>학습 세션 생성 및 저장</li>
              <li>사용자 학습 및 진행 상황 추적</li>
            </ol>
          </CardContent>
        </Card>

        {/* 주요 모듈 */}
        <Card>
          <CardHeader>
            <CardTitle>주요 모듈</CardTitle>
            <CardDescription>프로젝트의 핵심 모듈 및 기능 설명</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">문서 처리 모듈</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                <code>document-converter.ts</code>: 다양한 문서 형식을 텍스트로 변환
              </li>
              <li>
                <code>pdf-utils.ts</code>: PDF 파일 처리 및 텍스트 추출
              </li>
              <li>
                <code>ocr-pdf-utils.ts</code>: OCR을 이용한 이미지 기반 PDF 텍스트 추출
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2">문제 생성 모듈</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                <code>question-generator.ts</code>: 문제 생성 메인 로직
              </li>
              <li>
                <code>content-based-generator.ts</code>: 컨텐츠 기반 문제 생성 로직
              </li>
              <li>
                <code>crossword-generator.ts</code>: 크로스워드 퍼즐 생성 로직
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2">학습 관리 모듈</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code>study-session.ts</code>: 학습 세션 관리 및 저장
              </li>
              <li>
                <code>types.ts</code>: 타입 정의
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 개발 요건 및 테스트 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>개발 요건 및 테스트 상태</CardTitle>
            <CardDescription>요구사항 및 구현 상태 정리</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">요구사항</TableHead>
                  <TableHead className="w-[100px]">상태</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>문서 업로드 기능</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>PDF, TXT, DOCX, HTML, RTF 지원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PDF 텍스트 추출</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>텍스트 레이어 추출 및 OCR 지원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>컨텐츠 기반 문제 생성</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>API 의존성 없이 클라이언트 측에서 처리</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>객관식 문제 지원</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>정답 및 오답 자동 생성</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>주관식 문제 지원</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>빈칸 채우기 형식</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>학습 세션 관리</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>LocalStorage 기반 저장</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>학습 진행 상황 추적</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>정답률 및 진행 상태 표시</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>오답 및 표시 문제 관리</TableCell>
                  <TableCell>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </TableCell>
                  <TableCell>기본 기능 구현, 별도 연습 기능 미구현</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>학습 계획 설정</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>일일 목표 및 진행 관리</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>크로스워드 퍼즐 생성</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>컨텐츠 기반 단어 추출</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>소셜 로그인</TableCell>
                  <TableCell>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </TableCell>
                  <TableCell>UI 구현, 실제 연동 미구현</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>마인드맵 시각화</TableCell>
                  <TableCell>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </TableCell>
                  <TableCell>미구현</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>관리자 대시보드</TableCell>
                  <TableCell>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </TableCell>
                  <TableCell>미구현</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>결제 시스템</TableCell>
                  <TableCell>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </TableCell>
                  <TableCell>UI 구현, 실제 연동 미구현</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>문서 다운로드 기능</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>텍스트 파일 형식 지원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>반응형 UI</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>모바일 및 데스크톱 지원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>다크 모드 지원</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>시스템 설정 연동</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>문서화</TableCell>
                  <TableCell>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </TableCell>
                  <TableCell>코드 주석 및 문서 제공</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 알려진 이슈 및 제한사항 */}
        <Card>
          <CardHeader>
            <CardTitle>알려진 이슈 및 제한사항</CardTitle>
            <CardDescription>현재 버전의 제한사항 및 해결 방안</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">LocalStorage 제한</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>브라우저당 약 5MB의 저장 공간 제한</li>
              <li>대용량 학습 자료 저장 시 할당량 초과 가능성</li>
              <li>해결책: 오래된 세션 자동 정리, 컨텐츠 크기 제한</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">문서 처리 제한</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>브라우저 환경에서 DOCX, HWP 등의 복잡한 문서 형식 처리 제한</li>
              <li>이미지 기반 PDF의 OCR 처리 정확도 제한</li>
              <li>해결책: 사용자에게 대체 방법 안내</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">문제 생성 제한</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>컨텐츠 품질에 따른 문제 품질 차이</li>
              <li>복잡한 개념이나 수식 처리 제한</li>
              <li>해결책: 문제 필터링 및 검증 로직 강화</li>
            </ul>
          </CardContent>
        </Card>

        {/* 향후 개선 계획 */}
        <Card>
          <CardHeader>
            <CardTitle>향후 개선 계획</CardTitle>
            <CardDescription>향후 개발 및 개선 방향</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">기능 개선</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>서버 측 문서 처리 및 저장 기능 추가</li>
              <li>사용자 계정 및 인증 시스템 구현</li>
              <li>고급 학습 분석 및 통계 기능 추가</li>
              <li>다양한 학습 모드 추가 (플래시카드, 매칭 게임 등)</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">기술적 개선</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>서버 데이터베이스 연동</li>
              <li>성능 최적화</li>
              <li>접근성 개선</li>
              <li>다국어 지원</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

