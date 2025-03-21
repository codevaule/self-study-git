// 개발 리소스 할당 및 일정

export const resourceAllocation = {
  // 개발 인력 구성
  team: [
    {
      role: "프론트엔드 개발자",
      count: 2,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      allocation: [
        { project: "소셜 로그인", percentage: 50 },
        { project: "관리자 대시보드", percentage: 50 },
        { project: "마인드맵 시각화", percentage: 50 },
        { project: "크로스워드 개선", percentage: 50 },
      ],
    },
    {
      role: "백엔드 개발자",
      count: 2,
      skills: ["Node.js", "Express", "MongoDB", "API 개발"],
      allocation: [
        { project: "소셜 로그인", percentage: 50 },
        { project: "결제 처리", percentage: 100 },
        { project: "관리자 대시보드", percentage: 50 },
        { project: "콘텐츠 요약", percentage: 50 },
      ],
    },
    {
      role: "데이터 과학자",
      count: 1,
      skills: ["NLP", "기계학습", "Python", "API 통합"],
      allocation: [
        { project: "마인드맵 시각화", percentage: 50 },
        { project: "콘텐츠 요약", percentage: 50 },
        { project: "크로스워드 개선", percentage: 50 },
      ],
    },
    {
      role: "UI/UX 디자이너",
      count: 1,
      skills: ["Figma", "UI 디자인", "UX 리서치", "프로토타이핑"],
      allocation: [{ project: "관리자 대시보드", percentage: 50 }, "UI 디자인", "UX 리서치", "프로토타이핑"],
      allocation: [
        { project: "관리자 대시보드", percentage: 50 },
        { project: "마인드맵 시각화", percentage: 25 },
        { project: "크로스워드 개선", percentage: 25 },
      ],
    },
  ],

  // 개발 일정 (주차별)
  schedule: [
    {
      week: 1,
      startDate: "2023-11-20",
      endDate: "2023-11-26",
      activities: [
        { project: "소셜 로그인", task: "OAuth 프로바이더 통합" },
        { project: "결제 처리", task: "은행 송금 통합" },
        { project: "크로스워드 개선", task: "키워드 추출 알고리즘 개선" },
      ],
    },
    {
      week: 2,
      startDate: "2023-11-27",
      endDate: "2023-12-03",
      activities: [
        { project: "소셜 로그인", task: "사용자 프로필 연동" },
        { project: "결제 처리", task: "가상 계좌 시스템 (1/2)" },
        { project: "관리자 대시보드", task: "사용자 통계 모듈" },
        { project: "크로스워드 개선", task: "문맥 기반 힌트 생성 알고리즘 개발" },
      ],
    },
    {
      week: 3,
      startDate: "2023-12-04",
      endDate: "2023-12-10",
      activities: [
        { project: "소셜 로그인", task: "권한 관리 및 보안" },
        { project: "결제 처리", task: "가상 계좌 시스템 (2/2)" },
        { project: "관리자 대시보드", task: "콘텐츠 관리 시스템" },
        { project: "마인드맵 시각화", task: "콘텐츠 분석 알고리즘 (1/2)" },
        { project: "크로스워드 개선", task: "자동 검증 시스템 구축" },
      ],
    },
    {
      week: 4,
      startDate: "2023-12-11",
      endDate: "2023-12-17",
      activities: [
        { project: "결제 처리", task: "결제 알림 시스템" },
        { project: "관리자 대시보드", task: "결제 및 구독 관리" },
        { project: "마인드맵 시각화", task: "콘텐츠 분석 알고리즘 (2/2)" },
        { project: "콘텐츠 요약", task: "텍스트 분석 엔진 (1/2)" },
        { project: "크로스워드 개선", task: "크로스워드 인터페이스 개선" },
      ],
    },
    {
      week: 5,
      startDate: "2023-12-18",
      endDate: "2023-12-24",
      activities: [
        { project: "관리자 대시보드", task: "시스템 모니터링" },
        { project: "마인드맵 시각화", task: "시각화 엔진 개발 (1/2)" },
        { project: "콘텐츠 요약", task: "텍스트 분석 엔진 (2/2)" },
        { project: "크로스워드 개선", task: "통합 및 배포" },
      ],
    },
    {
      week: 6,
      startDate: "2023-12-25",
      endDate: "2023-12-31",
      activities: [
        { project: "마인드맵 시각화", task: "시각화 엔진 개발 (2/2)" },
        { project: "마인드맵 시각화", task: "사용자 상호작용" },
        { project: "콘텐츠 요약", task: "요약 생성 알고리즘" },
      ],
    },
    {
      week: 7,
      startDate: "2024-01-01",
      endDate: "2024-01-07",
      activities: [
        { project: "콘텐츠 요약", task: "사용자 인터페이스" },
        { project: "통합 테스트", task: "전체 시스템 통합 테스트" },
        { project: "버그 수정", task: "최종 버그 수정 및 안정화" },
      ],
    },
  ],

  // 리소스 제약 사항
  constraints: [
    {
      type: "인력",
      description: "프론트엔드 개발자 2명, 백엔드 개발자 2명으로 제한됨",
      impact: "동시 진행 가능한 프로젝트 수 제한",
      mitigation: "우선순위가 높은 기능부터 순차적으로 개발",
    },
    {
      type: "예산",
      description: "API 사용 비용 월 $200로 제한됨",
      impact: "NLP 기능의 사용량 제한",
      mitigation: "효율적인 API 호출 설계 및 캐싱 전략 구현",
    },
    {
      type: "시간",
      description: "2024년 1월 초까지 모든 기능 완료 필요",
      impact: "일부 기능의 범위 축소 가능성",
      mitigation: "MVP 접근 방식 채택, 핵심 기능 우선 개발",
    },
  ],
}

