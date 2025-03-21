// 크로스워드 기능 개발 계획 및 일정

export const crosswordDevelopmentPlan = {
  // 1단계: 알고리즘 개선 (2주)
  algorithmImprovement: {
    startDate: "2023-11-20",
    endDate: "2023-12-03",
    tasks: [
      {
        name: "키워드 추출 알고리즘 개선",
        description: "TF-IDF 및 문맥 기반 키워드 추출 구현",
        duration: "5일",
        dependencies: [],
        status: "planning", // planning, in-progress, completed
      },
      {
        name: "문맥 기반 힌트 생성 알고리즘 개발",
        description: "추출된 키워드에 대한 문맥 기반 힌트 생성 로직 구현",
        duration: "5일",
        dependencies: ["키워드 추출 알고리즘 개선"],
        status: "planning",
      },
      {
        name: "크로스워드 배치 알고리즘 최적화",
        description: "키워드 간 교차점 최적화 및 배치 알고리즘 개선",
        duration: "4일",
        dependencies: [],
        status: "planning",
      },
    ],
  },

  // 2단계: 검증 및 테스트 (1주)
  validationAndTesting: {
    startDate: "2023-12-04",
    endDate: "2023-12-10",
    tasks: [
      {
        name: "자동 검증 시스템 구축",
        description: "생성된 크로스워드 퍼즐의 품질 자동 검증 시스템 개발",
        duration: "3일",
        dependencies: ["문맥 기반 힌트 생성 알고리즘 개발"],
        status: "planning",
      },
      {
        name: "사용자 테스트 및 피드백 수집",
        description: "개선된 알고리즘으로 생성된 퍼즐에 대한 사용자 테스트",
        duration: "4일",
        dependencies: ["자동 검증 시스템 구축"],
        status: "planning",
      },
    ],
  },

  // 3단계: UI/UX 개선 (1주)
  uiUxImprovement: {
    startDate: "2023-12-11",
    endDate: "2023-12-17",
    tasks: [
      {
        name: "크로스워드 인터페이스 개선",
        description: "사용자 경험을 향상시키기 위한 UI 개선",
        duration: "4일",
        dependencies: [],
        status: "planning",
      },
      {
        name: "힌트 표시 및 상호작용 개선",
        description: "힌트 표시 방식 및 사용자 상호작용 개선",
        duration: "3일",
        dependencies: ["크로스워드 인터페이스 개선"],
        status: "planning",
      },
    ],
  },

  // 4단계: 통합 및 배포 (1주)
  integrationAndDeployment: {
    startDate: "2023-12-18",
    endDate: "2023-12-24",
    tasks: [
      {
        name: "기존 시스템과의 통합",
        description: "개선된 크로스워드 기능을 기존 시스템에 통합",
        duration: "3일",
        dependencies: ["힌트 표시 및 상호작용 개선", "사용자 테스트 및 피드백 수집"],
        status: "planning",
      },
      {
        name: "성능 최적화",
        description: "크로스워드 생성 및 렌더링 성능 최적화",
        duration: "2일",
        dependencies: ["기존 시스템과의 통합"],
        status: "planning",
      },
      {
        name: "최종 테스트 및 배포",
        description: "통합 테스트 및 프로덕션 환경 배포",
        duration: "2일",
        dependencies: ["성능 최적화"],
        status: "planning",
      },
    ],
  },
}

// 전체 개발 기간: 5주
export const totalDevelopmentPeriod = "5주"

// 개발 우선순위
export const developmentPriorities = [
  "키워드 추출 알고리즘 개선",
  "문맥 기반 힌트 생성 알고리즘 개발",
  "자동 검증 시스템 구축",
  "크로스워드 인터페이스 개선",
]

