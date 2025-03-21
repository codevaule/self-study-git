// 전체 미개발 기능 개발 계획

export const overallDevelopmentPlan = {
  // 1. 소셜 로그인 기능
  socialLogin: {
    startDate: "2023-11-20",
    endDate: "2023-12-10",
    duration: "3주",
    tasks: [
      {
        name: "OAuth 프로바이더 통합",
        description: "Google, Facebook, Apple 로그인 통합",
        duration: "1주",
        status: "planning",
      },
      {
        name: "사용자 프로필 연동",
        description: "소셜 프로필 정보 동기화 및 관리",
        duration: "1주",
        status: "planning",
      },
      {
        name: "권한 관리 및 보안",
        description: "소셜 로그인 사용자 권한 관리 및 보안 강화",
        duration: "1주",
        status: "planning",
      },
    ],
    dependencies: [],
    priority: "높음",
    resources: "프론트엔드 1명, 백엔드 1명",
  },

  // 2. 관리자 대시보드
  adminDashboard: {
    startDate: "2023-11-27",
    endDate: "2023-12-24",
    duration: "4주",
    tasks: [
      {
        name: "사용자 통계 모듈",
        description: "사용자 활동 및 성과 통계 시각화",
        duration: "1주",
        status: "planning",
      },
      {
        name: "콘텐츠 관리 시스템",
        description: "학습 자료 및 퀴즈 관리 인터페이스",
        duration: "1주",
        status: "planning",
      },
      {
        name: "결제 및 구독 관리",
        description: "사용자 결제 내역 및 구독 관리",
        duration: "1주",
        status: "planning",
      },
      {
        name: "시스템 모니터링",
        description: "시스템 성능 및 오류 모니터링",
        duration: "1주",
        status: "planning",
      },
    ],
    dependencies: [],
    priority: "중간",
    resources: "프론트엔드 1명, 백엔드 1명, UI/UX 디자이너 0.5명",
  },

  // 3. 마인드맵 시각화
  mindMapVisualization: {
    startDate: "2023-12-04",
    endDate: "2023-12-31",
    duration: "4주",
    tasks: [
      {
        name: "콘텐츠 분석 알고리즘",
        description: "학습 자료에서 개념 및 관계 추출",
        duration: "1.5주",
        status: "planning",
      },
      {
        name: "시각화 엔진 개발",
        description: "인터랙티브 마인드맵 렌더링 엔진",
        duration: "1.5주",
        status: "planning",
      },
      {
        name: "사용자 상호작용",
        description: "마인드맵 편집 및 확장 기능",
        duration: "1주",
        status: "planning",
      },
    ],
    dependencies: [],
    priority: "중간",
    resources: "프론트엔드 1명, 백엔드 0.5명, 데이터 과학자 0.5명",
  },

  // 4. 결제 처리 및 가상 계좌
  paymentProcessing: {
    startDate: "2023-11-20",
    endDate: "2023-12-17",
    duration: "4주",
    tasks: [
      {
        name: "은행 송금 통합",
        description: "은행 송금 정보 관리 및 확인 시스템",
        duration: "1주",
        status: "planning",
      },
      {
        name: "가상 계좌 시스템",
        description: "사용자별 가상 계좌 생성 및 관리",
        duration: "1.5주",
        status: "planning",
      },
      {
        name: "결제 알림 시스템",
        description: "결제 상태 변경 시 알림 발송",
        duration: "1주",
        status: "planning",
      },
      {
        name: "관리자 결제 승인 인터페이스",
        description: "수동 결제 확인 및 승인 시스템",
        duration: "0.5주",
        status: "planning",
      },
    ],
    dependencies: ["관리자 대시보드"],
    priority: "높음",
    resources: "백엔드 1명, 프론트엔드 0.5명",
  },

  // 5. 콘텐츠 요약 기능
  contentSummarization: {
    startDate: "2023-12-11",
    endDate: "2024-01-07",
    duration: "4주",
    tasks: [
      {
        name: "텍스트 분석 엔진",
        description: "핵심 개념 및 주요 내용 추출",
        duration: "1.5주",
        status: "planning",
      },
      {
        name: "요약 생성 알고리즘",
        description: "추출된 정보를 기반으로 간결한 요약 생성",
        duration: "1.5주",
        status: "planning",
      },
      {
        name: "사용자 인터페이스",
        description: "요약 표시 및 상호작용 인터페이스",
        duration: "1주",
        status: "planning",
      },
    ],
    dependencies: [],
    priority: "중간",
    resources: "백엔드 1명, 프론트엔드 0.5명, 데이터 과학자 0.5명",
  },
}

// 전체 개발 일정 요약
export const developmentScheduleSummary = {
  startDate: "2023-11-20",
  endDate: "2024-01-07",
  totalDuration: "7주",
  criticalPath: ["소셜 로그인", "관리자 대시보드", "결제 처리 및 가상 계좌"],
  milestones: [
    {
      name: "소셜 로그인 완료",
      date: "2023-12-10",
      deliverables: ["OAuth 통합", "사용자 프로필 연동"],
    },
    {
      name: "결제 시스템 완료",
      date: "2023-12-17",
      deliverables: ["은행 송금 통합", "가상 계좌 시스템", "결제 알림"],
    },
    {
      name: "크로스워드 개선 완료",
      date: "2023-12-24",
      deliverables: ["개선된 알고리즘", "검증 시스템", "UI/UX 개선"],
    },
    {
      name: "관리자 대시보드 완료",
      date: "2023-12-24",
      deliverables: ["사용자 통계", "콘텐츠 관리", "결제 관리"],
    },
    {
      name: "마인드맵 완료",
      date: "2023-12-31",
      deliverables: ["콘텐츠 분석", "시각화 엔진", "사용자 상호작용"],
    },
    {
      name: "콘텐츠 요약 완료",
      date: "2024-01-07",
      deliverables: ["텍스트 분석", "요약 생성", "사용자 인터페이스"],
    },
  ],
}

