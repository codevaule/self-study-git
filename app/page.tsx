"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { UICard, UICardContent, UICardHeader, UICardTitle, UICardDescription } from "@/components/ui-card"
import { UIButton } from "@/components/ui-button"
import { UISection } from "@/components/ui-section"
import { UIHeading, UIText } from "@/components/ui-typography"
import { gradientBackgrounds, shadows, animations } from "@/styles/ui-improvements"
import { BookOpen, Upload, Brain, CheckCircle, Star, Users, ArrowRight, Sparkles, CheckCircle2, PenLine, FileText, Zap } from "lucide-react"
import { useClientSide } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram } from "lucide-react"

// 이미지 래퍼 컴포넌트 (이미지 에러 방지)
const SafeImage = ({ src, alt, ...props }: any) => {
  // 유효한 URL인지 확인
  const isValidSrc = src && (src.startsWith('/') || src.startsWith('http') || src.startsWith('data:'))
  const imgSrc = isValidSrc ? src : DEFAULT_IMAGE
  
  return (
    <Image 
      src={imgSrc} 
      alt={alt || "이미지"}
      unoptimized
      {...props} 
    />
  )
}

// 이미지 경로 없는 경우 기본 이미지 사용
const DEFAULT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNlMmUyZTIiLz48dGV4dCB4PSIyNTAiIHk9IjI1MCIgZm9udC1zaXplPSIyNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=="

export default function HomePage() {
  const isMounted = useClientSide()
  const [domReady, setDomReady] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  // 클라이언트 사이드에서만 실행되는 렌더링 보호
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 하이드레이션 문제를 피하기 위해
      const timeout = setTimeout(() => {
        setDomReady(true);
        setImagesLoaded(true);
      }, 10);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [])
  
  // 서버 사이드 렌더링 또는 하이드레이션 중에는 간단한 로딩 상태를 표시
  if (!isMounted || !domReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }
  
  return (
    <main className="flex-1">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-background py-20">
        {/* 배경 효과 */}
        <div className="absolute inset-0 z-0 opacity-20">
          <SafeImage 
            src="/images/texture-overlay.svg" 
            alt="Texture Overlay" 
            fill 
            className="object-cover"
          />
        </div>
        
        {/* 장식 요소 */}
        <div className="absolute -right-20 -top-20 z-0">
          <SafeImage 
            src="/images/blob-shape.svg" 
            alt="Blob Shape" 
            width={400} 
            height={400} 
            className="opacity-20"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                학습을 더 <span className="text-primary">스마트하게</span> 관리하세요
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                인공지능 기반 학습 도우미로 당신의 학습을 최적화하고 성과를 높여보세요. 
                시간 관리부터 진도 추적까지 모든 것을 한 곳에서 관리할 수 있습니다.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <UIButton size="lg" asChild>
                  <Link href="/auth/register">
                    무료로 시작하기
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </UIButton>
                <UIButton variant="outline" size="lg" asChild>
                  <Link href="/about">기능 살펴보기</Link>
                </UIButton>
              </div>
              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    무료 계정 제공
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    설치 필요 없음
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    AI 기반 학습 분석
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <SafeImage
                src="/images/hero-image.svg"
                alt="학습 관리 대시보드"
                width={500}
                height={400}
                className="w-full max-w-[500px] rounded-lg border border-border bg-muted/50 p-2 shadow-lg dark:bg-muted/30"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 통계 카드 섹션 */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <UICard className="flex flex-col items-center p-6 text-center">
              <h3 className="text-3xl font-bold text-primary">99%</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                사용자 만족도
              </p>
            </UICard>
            <UICard className="flex flex-col items-center p-6 text-center">
              <h3 className="text-3xl font-bold text-primary">32%</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                학습 효율성 향상
              </p>
            </UICard>
            <UICard className="flex flex-col items-center p-6 text-center">
              <h3 className="text-3xl font-bold text-primary">10,000+</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                활성 사용자
              </p>
            </UICard>
            <UICard className="flex flex-col items-center p-6 text-center">
              <h3 className="text-3xl font-bold text-primary">24/7</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                지원 및 도움
              </p>
            </UICard>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="bg-background py-20">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              스마트한 기능으로 <span className="text-primary">학습 효율</span>을 
              극대화하세요
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              학습 관리에 필요한 모든 기능을 제공합니다. 다양한 도구를 활용해 학습 계획을 
              세우고 진행 상황을 추적해보세요.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <SafeImage
                  src="/images/feature-upload.svg"
                  alt="문서 업로드"
                  width={36}
                  height={36}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">문서 업로드 및 관리</h3>
                <p className="mt-2 text-muted-foreground">
                  PDF, Word, 이미지 등 다양한 형식의 학습 자료를 업로드하고 관리할 수 있습니다.
                  클라우드에 안전하게 보관되어 언제 어디서나 접근할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <SafeImage
                  src="/images/feature-analyze.svg"
                  alt="학습 분석"
                  width={36}
                  height={36}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">학습 분석 및 통계</h3>
                <p className="mt-2 text-muted-foreground">
                  AI 기반 학습 분석으로 학습 패턴과 효율성을 파악할 수 있습니다.
                  개인화된 데이터를 통해 학습 방법을 개선하고 성과를 높여보세요.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <SafeImage
                  src="/images/feature-schedule.svg"
                  alt="일정 관리"
                  width={36}
                  height={36}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">스마트 일정 관리</h3>
                <p className="mt-2 text-muted-foreground">
                  최적화된 학습 일정을 자동으로 생성하고 관리할 수 있습니다.
                  알림 기능으로 중요한 일정을 놓치지 않고, 효율적으로 시간을 관리해보세요.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <SafeImage
                  src="/images/feature-ai.svg"
                  alt="AI 도우미"
                  width={36}
                  height={36}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI 학습 도우미</h3>
                <p className="mt-2 text-muted-foreground">
                  인공지능 학습 도우미가 질문에 답변하고 학습 내용을 요약해 줍니다.
                  복잡한 개념도 쉽게 이해할 수 있도록 맞춤형 설명을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 후기 섹션 */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              사용자들의 <span className="text-primary">생생한 후기</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              스터디 헬퍼를 사용하는 사용자들의 경험을 들어보세요.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <UICard className="p-6">
              <div className="flex items-start gap-4">
                <SafeImage
                  src="/images/user-testimonial-1.svg"
                  alt="사용자 프로필"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-bold">김지영</h4>
                  <p className="text-sm text-muted-foreground">대학생</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "시험 기간에 이 앱을 사용하기 시작했는데, 학습 계획을 세우고 진도를 추적하는 기능이 정말 유용했어요. 
                덕분에 시간 관리가 훨씬 수월해졌고 성적도 향상되었습니다."
              </p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <PenLine key={i} className="size-4 text-yellow-500" />
                ))}
              </div>
            </UICard>

            <UICard className="p-6">
              <div className="flex items-start gap-4">
                <SafeImage
                  src="/images/user-testimonial-2.svg"
                  alt="사용자 프로필"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-bold">이현우</h4>
                  <p className="text-sm text-muted-foreground">직장인</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "바쁜 직장 생활 중에도 자격증 공부를 병행할 수 있게 도와줍니다. 특히 AI 요약 기능이 
                핵심 내용을 빠르게 파악하는 데 도움이 되었어요. 출퇴근 시간을 효율적으로 활용할 수 있게 되었습니다."
              </p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <PenLine key={i} className="size-4 text-yellow-500" />
                ))}
              </div>
            </UICard>

            <UICard className="p-6">
              <div className="flex items-start gap-4">
                <SafeImage
                  src="/images/user-testimonial-3.svg"
                  alt="사용자 프로필"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-bold">박서연</h4>
                  <p className="text-sm text-muted-foreground">고등학생</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "수능 준비를 하면서 이 앱의 학습 분석 기능이 많은 도움이 되었어요. 취약한 부분을 
                쉽게 파악할 수 있었고, 맞춤형 학습 계획을 통해 효율적으로 공부할 수 있었습니다."
              </p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <PenLine key={i} className="size-4 text-yellow-500" />
                ))}
              </div>
            </UICard>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-background py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex items-center justify-center">
              <SafeImage
                src="/images/cta-image.svg"
                alt="지금 시작하세요"
                width={400}
                height={300}
                className="max-w-full rounded-lg border border-border p-2"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                지금 바로 <span className="text-primary">스마트한 학습</span>을 시작하세요
              </h2>
              <p className="text-lg text-muted-foreground">
                더 이상 미루지 마세요. 스터디 헬퍼와 함께 효율적인 학습 여정을 시작하고,
                목표를 달성하는 성취감을 경험해보세요. 지금 가입하면 프리미엄 기능을 2주간 무료로 이용할 수 있습니다.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <UIButton size="lg" asChild>
                  <Link href="/auth/register">
                    무료로 시작하기
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </UIButton>
                <UIButton variant="outline" size="lg" asChild>
                  <Link href="/support">문의하기</Link>
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 mt-20 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Study Helper</h3>
              <p className="text-sm text-gray-600">인공지능 기반의 학습 도우미 서비스</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">링크</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    기능
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    요금제
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-600 hover:text-gray-900">
                    서비스 이용약관
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                    개인정보 처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

