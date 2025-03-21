import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Award, Target, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">
                효율적인 학습의 <span className="text-primary">새로운 기준</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Study Helper는 AI 기술을 활용하여 자격증 취득을 준비하는 학습자들에게 맞춤형 학습 경험을 제공하는
                혁신적인 플랫폼입니다.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/upload">
                  <BookOpen className="h-5 w-5" />
                  서비스 시작하기
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden premium-shadow">
              <Image src="/placeholder.svg?height=800&width=1200" alt="Study Helper 팀" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 미션 및 비전 섹션 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-primary/10 premium-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">우리의 미션</h2>
                </div>
                <p className="text-muted-foreground">
                  Study Helper의 미션은 학습자들이 자격증 취득을 위한 공부를 더 효율적이고 즐겁게 할 수 있도록 돕는
                  것입니다. AI 기술을 활용하여 개인화된 학습 경험을 제공하고, 학습자의 시간과 노력을 최적화하여 더 높은
                  성취를 이룰 수 있도록 지원합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 premium-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">우리의 비전</h2>
                </div>
                <p className="text-muted-foreground">
                  Study Helper는 모든 학습자가 자신의 잠재력을 최대한 발휘할 수 있는 세상을 꿈꿉니다. 우리는 기술의
                  힘으로 교육의 장벽을 허물고, 누구나 자신의 목표를 달성할 수 있는 기회를 제공하는 글로벌 학습
                  플랫폼으로 성장하고자 합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 회사 연혁 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">회사 연혁</h2>
            <p className="text-lg text-muted-foreground">Study Helper의 성장 과정과 주요 이정표</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-lg font-bold text-primary">2023년</span>
                </div>
                <div className="border-l border-primary pl-6 pb-12 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2"></div>
                  <h3 className="text-xl font-medium mb-2">Study Helper 창립</h3>
                  <p className="text-muted-foreground">
                    AI 기반 학습 플랫폼의 비전을 가진 교육 전문가와 개발자들이 모여 Study Helper를 설립했습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-lg font-bold text-primary">2023년 9월</span>
                </div>
                <div className="border-l border-primary pl-6 pb-12 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2"></div>
                  <h3 className="text-xl font-medium mb-2">베타 서비스 출시</h3>
                  <p className="text-muted-foreground">
                    첫 번째 베타 버전의 Study Helper 서비스를 출시하고 초기 사용자들로부터 피드백을 수집했습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-lg font-bold text-primary">2024년 1월</span>
                </div>
                <div className="border-l border-primary pl-6 pb-12 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2"></div>
                  <h3 className="text-xl font-medium mb-2">정식 서비스 런칭</h3>
                  <p className="text-muted-foreground">
                    개선된 AI 알고리즘과 사용자 인터페이스를 갖춘 정식 서비스를 출시했습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-lg font-bold text-primary">2024년 3월</span>
                </div>
                <div className="border-l border-primary pl-6 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2"></div>
                  <h3 className="text-xl font-medium mb-2">10,000명 사용자 달성</h3>
                  <p className="text-muted-foreground">
                    서비스 출시 후 3개월 만에 10,000명의 활성 사용자를 달성하는 성과를 이루었습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 팀 소개 섹션 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">핵심 팀원 소개</h2>
            <p className="text-lg text-muted-foreground">Study Helper를 이끌어가는 열정적인 전문가들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 premium-shadow">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="CEO 프로필"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">김민수</h3>
              <p className="text-primary mb-2">CEO & 공동창업자</p>
              <p className="text-sm text-muted-foreground">
                교육 기술 분야에서 10년 이상의 경험을 가진 전문가로, AI를 활용한 교육 혁신에 대한 비전을 가지고
                있습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 premium-shadow">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="CTO 프로필"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">이지원</h3>
              <p className="text-primary mb-2">CTO & 공동창업자</p>
              <p className="text-sm text-muted-foreground">
                AI 및 머신러닝 전문가로, 여러 기술 스타트업에서의 경험을 바탕으로 Study Helper의 핵심 기술을 개발하고
                있습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 premium-shadow">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="교육 디렉터 프로필"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">박서연</h3>
              <p className="text-primary mb-2">교육 콘텐츠 디렉터</p>
              <p className="text-sm text-muted-foreground">
                15년 경력의 교육 전문가로, 다양한 자격증 시험 준비 과정을 설계하고 최적화하는 역할을 담당하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">함께 성장하는 Study Helper</h2>
            <p className="text-lg text-muted-foreground">
              Study Helper와 함께 효율적인 학습 여정을 시작하세요. AI 기술로 더 스마트하게, 더 효과적으로 자격증을
              준비할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="gap-2">
                <Link href="/upload">
                  <BookOpen className="h-5 w-5" />
                  무료로 시작하기
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/pricing">
                  <Award className="h-5 w-5" />
                  요금제 알아보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

