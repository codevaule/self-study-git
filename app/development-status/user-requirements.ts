// 사용자 결정 및 지원 필요 사항

export const userRequirementsForDevelopment = {
  // 1. 기술적 결정 사항
  technicalDecisions: [
    {
      id: "td-001",
      title: "NLP 라이브러리 선택",
      description: "키워드 추출 및 문맥 분석을 위한 자연어 처리 라이브러리 선택",
      options: [
        {
          name: "natural",
          pros: "자바스크립트 네이티브, 가벼움, 기본 NLP 기능 제공",
          cons: "고급 기능 제한적, 한국어 지원 제한적",
        },
        {
          name: "compromise",
          pros: "빠른 속도, 브라우저 호환성 좋음, 플러그인 시스템",
          cons: "한국어 지원 미흡",
        },
        {
          name: "OpenAI API 활용",
          pros: "고급 문맥 이해, 다국어 지원 우수, 정확도 높음",
          cons: "비용 발생, API 의존성, 속도 제한",
        },
      ],
      recommendedOption: "OpenAI API 활용",
      decisionDeadline: "2023-11-25",
      impactOnDevelopment: "키워드 추출 및 힌트 생성 품질에 직접적 영향",
    },
    {
      id: "td-002",
      title: "크로스워드 난이도 설정",
      description: "사용자 학습 수준에 따른 크로스워드 난이도 조정 방식",
      options: [
        {
          name: "고정 난이도 (상/중/하)",
          pros: "구현 간단, 사용자 선택 명확",
          cons: "개인화 부족, 학습 효과 제한적",
        },
        {
          name: "적응형 난이도 (사용자 성과 기반)",
          pros: "개인화된 학습 경험, 학습 효율성 향상",
          cons: "구현 복잡, 초기 데이터 필요",
        },
        {
          name: "콘텐츠 기반 자동 난이도",
          pros: "콘텐츠 특성에 맞는 난이도, 일관성",
          cons: "콘텐츠 분석 알고리즘 필요, 정확도 변동",
        },
      ],
      recommendedOption: "적응형 난이도 (사용자 성과 기반)",
      decisionDeadline: "2023-11-30",
      impactOnDevelopment: "사용자 경험 및 학습 효과에 중요한 영향",
    },
  ],

  // 2. 사용자 지원 필요 사항
  userSupportNeeds: [
    {
      id: "us-001",
      title: "테스트 데이터 제공",
      description: "다양한 주제와 난이도의 학습 자료 샘플 제공",
      details: [
        "최소 5개 이상의 서로 다른 주제 영역 (예: 과학, 역사, 언어, 기술, 예술)",
        "각 주제별 최소 3개의 난이도 수준 (입문, 중급, 고급)",
        "각 샘플당 최소 500단어 이상의 텍스트",
        "가능한 경우 전문 용어와 일반 용어가 혼합된 자료",
      ],
      format: "PDF 또는 텍스트 파일",
      deadline: "2023-11-28",
      impactIfNotProvided: "제한된 테스트 데이터로 인한 알고리즘 정확도 저하",
    },
    {
      id: "us-002",
      title: "사용자 테스트 참여",
      description: "개선된 크로스워드 기능 테스트 및 피드백 제공",
      details: [
        "최소 5명의 다양한 배경을 가진 테스터 모집",
        "테스트 세션당 약 30분 소요 예상",
        "구조화된 피드백 양식 작성",
        "가능한 경우 화면 녹화 및 음성 피드백",
      ],
      schedule: "2023-12-05 ~ 2023-12-09 (테스트 기간)",
      impactIfNotProvided: "실제 사용자 경험 기반 개선 기회 상실",
    },
  ],

  // 3. 기능 우선순위 결정
  featurePriorityDecisions: [
    {
      id: "fp-001",
      title: "크로스워드 기능 우선순위",
      description: "개발 리소스 할당을 위한 크로스워드 하위 기능 우선순위 결정",
      options: [
        {
          feature: "문맥 기반 힌트 품질 향상",
          benefit: "학습 효과 증대, 사용자 만족도 향상",
          developmentCost: "높음 (2주)",
        },
        {
          feature: "다양한 크로스워드 레이아웃",
          benefit: "시각적 다양성, 반복 사용 흥미 유지",
          developmentCost: "중간 (1주)",
        },
        {
          feature: "힌트 제공 시스템 개선",
          benefit: "학습 난이도 조절, 좌절감 감소",
          developmentCost: "낮음 (3일)",
        },
        {
          feature: "크로스워드 저장 및 공유",
          benefit: "협업 학습, 소셜 요소 추가",
          developmentCost: "중간 (1주)",
        },
      ],
      recommendedPriority: [
        "문맥 기반 힌트 품질 향상",
        "힌트 제공 시스템 개선",
        "다양한 크로스워드 레이아웃",
        "크로스워드 저장 및 공유",
      ],
      decisionDeadline: "2023-11-27",
      impactOnDevelopment: "개발 일정 및 리소스 할당에 직접적 영향",
    },
  ],

  // 4. 예산 및 리소스 결정
  budgetAndResourceDecisions: [
    {
      id: "br-001",
      title: "API 사용 예산",
      description: "OpenAI API 또는 기타 NLP 서비스 사용을 위한 월간 예산",
      options: [
        {
          level: "기본 (월 $50)",
          capability: "일일 약 500회 크로스워드 생성 가능",
          limitations: "동시 사용자 제한, 피크 시간 지연 가능성",
        },
        {
          level: "표준 (월 $200)",
          capability: "일일 약 2,500회 크로스워드 생성 가능",
          limitations: "적절한 동시 사용자 지원, 일반적 사용에 충분",
        },
        {
          level: "프리미엄 (월 $500)",
          capability: "일일 약 7,000회 크로스워드 생성 가능",
          limitations: "대규모 동시 사용자 지원, 고품질 응답",
        },
      ],
      recommendedOption: "표준 (월 $200)",
      decisionDeadline: "2023-11-29",
      impactOnDevelopment: "API 기반 기능의 품질 및 성능에 직접적 영향",
    },
  ],
}

