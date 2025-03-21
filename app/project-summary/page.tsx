const ProjectSummaryPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">프로젝트 개요</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">소개</h2>
        <p>
          이 프로젝트는 웹 기반 학습 도구 개발을 목표로 합니다. 사용자는 다양한 학습 모듈을 통해 지식을 습득하고, 퀴즈와
          크로스워드 퍼즐을 통해 학습 내용을 복습할 수 있습니다.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">주요 기능</h2>
        <ul>
          <li>다양한 학습 모듈 제공 (예: 객관식 퀴즈, 단답형 문제)</li>
          <li>학습 진행 상황 저장 및 관리</li>
          <li>크로스워드 퍼즐을 통한 복습 기능</li>
          <li>사용자 친화적인 인터페이스</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">기술 스택</h2>
        <ul>
          <li>React: 사용자 인터페이스 개발</li>
          <li>TypeScript: 정적 타입 검사 및 개발 생산성 향상</li>
          <li>Next.js: 서버 사이드 렌더링 및 라우팅</li>
          <li>LocalStorage: 사용자 학습 데이터 저장 (임시)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">API 명세 (예시)</h2>
        <ul>
          <li>
            <code>generateQuestions(options): Promise&lt;Question[]&gt;</code> - 문제 생성
          </li>
          <li>
            <code>handleCheckAnswer(): void</code> - 정답 확인
          </li>
          <li>
            <code>saveProgress(questionId: string, isCorrect: boolean): Promise&lt;void&gt;</code> - 학습 진행 저장
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">퀴즈 모듈</h2>
        <ul>
          <li>
            <code>generateQuestions(options: QuizOptions): Question[]</code> - 퀴즈 문제 생성
          </li>
          <li>
            <code>checkAnswer(question: Question, answer: string): boolean</code> - 정답 확인
          </li>
          <li>
            <code>saveQuizResult(result: QuizResult): void</code> - 퀴즈 결과 저장
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">크로스워드 모듈</h2>
        <ul>
          <li>
            <code>generateCrosswordPuzzle(questions: Question[], title: string): CrosswordPuzzle</code> - 크로스워드
            퍼즐 생성
          </li>
          <li>
            <code>
              updateCrosswordInput(puzzle: CrosswordPuzzle, x: number, y: number, value: string): CrosswordPuzzle
            </code>{" "}
            - 사용자 입력 업데이트
          </li>
          <li>
            <code>
              checkCrosswordAnswers(puzzle: CrosswordPuzzle): {"{"} isCorrect: boolean; puzzle: CrosswordPuzzle {"}"}
            </code>{" "}
            - 정답 확인
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">LocalStorage 사용 시 주의사항</h2>
        <p>
          LocalStorage는 브라우저당 약 5MB의 저장 공간 제한이 있습니다. 대용량 학습 자료를 저장할 때 할당량 초과 오류가
          발생할 수 있으므로 다음 사항을 고려하세요:
        </p>
        <ul>
          <li>저장할 데이터의 크기를 최소화하세요.</li>
          <li>불필요한 데이터는 삭제하세요.</li>
          <li>필요한 경우, 서버 데이터베이스를 사용하여 데이터를 저장하세요.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">향후 계획</h2>
        <ul>
          <li>다양한 학습 모듈 추가 (예: 카드 뒤집기, 빈칸 채우기)</li>
          <li>사용자 계정 관리 기능 추가</li>
          <li>서버 데이터베이스 연동을 통한 데이터 영구 저장</li>
          <li>학습 통계 및 분석 기능 추가</li>
        </ul>
      </section>
    </div>
  )
}

export default ProjectSummaryPage

