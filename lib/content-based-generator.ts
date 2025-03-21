import type { Question } from "./types"

/**
 * 컨텐츠 기반 문제 생성 함수
 *
 * 이 함수는 사용자가 업로드한 컨텐츠를 분석하여 문제를 생성합니다.
 * API 의존성 없이 클라이언트 측에서 작동하며, 하드코딩된 내용을 사용하지 않습니다.
 *
 * @param content 사용자가 업로드한 컨텐츠
 * @param type 문제 유형 ("multiple-choice" 또는 "short-answer")
 * @param count 생성할 문제 수
 * @returns 생성된 문제 배열
 */
export function generateContentBasedQuestions(content: string, type = "multiple-choice", count = 10): Question[] {
  // 컨텐츠가 비어있는 경우 빈 배열 반환
  if (!content || content.trim().length === 0) {
    console.warn("컨텐츠가 비어있어 문제를 생성할 수 없습니다.")
    return []
  }

  console.log("컨텐츠 기반 문제 생성 시작:", { contentLength: content.length, type, count })

  // 컨텐츠에서 의미 있는 문장 추출
  const sentences = extractMeaningfulSentences(content)

  // 컨텐츠에서 중요 키워드 추출
  const keywords = extractKeywords(content, sentences)

  // 문장이 너무 적으면 문제 생성이 어려움
  if (sentences.length < 3) {
    console.warn("추출된 문장이 너무 적어 문제 생성이 제한됩니다.")
    return generateFallbackQuestions(content, type, Math.min(count, 3))
  }

  // 생성할 문제 수 결정 (최대 count개, 최소 문장 수의 2배)
  const maxQuestions = Math.min(count, sentences.length * 2)
  const questions: Question[] = []

  // 문제 생성
  for (let i = 0; i < maxQuestions; i++) {
    // 문장 선택 (순환)
    const sentenceIndex = i % sentences.length
    const sentence = sentences[sentenceIndex]

    // 키워드 선택 (순환, 키워드가 있는 경우)
    const keyword = keywords.length > 0 ? keywords[i % keywords.length] : ""

    try {
      // 문제 유형에 따라 다른 생성 함수 호출
      if (type === "multiple-choice") {
        const question = generateMultipleChoiceFromSentence(sentence, keyword, i + 1, sentences)
        if (question) questions.push(question)
      } else {
        const question = generateShortAnswerFromSentence(sentence, keyword, i + 1)
        if (question) questions.push(question)
      }
    } catch (error) {
      console.error(`문제 ${i + 1} 생성 중 오류:`, error)
      // 오류 발생 시 다음 문제로 넘어감
      continue
    }

    // 목표 문제 수에 도달하면 종료
    if (questions.length >= count) break
  }

  // 생성된 문제가 없거나 너무 적으면 대체 문제 생성
  if (questions.length < Math.min(3, count)) {
    console.warn("생성된 문제가 너무 적어 대체 문제를 생성합니다.")
    return generateFallbackQuestions(content, type, count)
  }

  console.log(`컨텐츠 기반 문제 생성 완료: ${questions.length}개 생성됨`)
  return questions
}

/**
 * 컨텐츠에서 의미 있는 문장 추출
 *
 * 이 함수는 컨텐츠를 문장 단위로 분리하고, 의미 있는 문장만 선택합니다.
 * 너무 짧거나 의미 없는 문장은 제외됩니다.
 *
 * @param content 분석할 컨텐츠
 * @returns 추출된 의미 있는 문장 배열
 */
function extractMeaningfulSentences(content: string): string[] {
  // 문장 분리 (마침표, 물음표, 느낌표 기준)
  const rawSentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  // 의미 있는 문장만 선택 (너무 짧은 문장 제외)
  const meaningfulSentences = rawSentences.filter((sentence) => {
    // 최소 길이 확인 (15자 이상)
    if (sentence.length < 15) return false

    // 최대 길이 확인 (200자 이하, 너무 긴 문장은 처리하기 어려움)
    if (sentence.length > 200) return false

    // 단어 수 확인 (최소 5개 단어)
    const wordCount = sentence.split(/\s+/).length
    if (wordCount < 5) return false

    // 특수 문자가 너무 많은 경우 제외
    const specialCharCount = (sentence.match(/[^\w\s가-힣]/g) || []).length
    if (specialCharCount > sentence.length * 0.3) return false

    return true
  })

  // 중복 제거
  const uniqueSentences = Array.from(new Set(meaningfulSentences))

  // 문장 점수 계산 및 정렬
  const scoredSentences = uniqueSentences.map((sentence) => {
    // 기본 점수
    let score = 0

    // 길이에 따른 점수 (적절한 길이의 문장 선호)
    const length = sentence.length
    if (length >= 30 && length <= 120) {
      score += 3
    } else if (length > 120) {
      score += 1
    }

    // 특정 패턴에 따른 점수
    if (/는\s|은\s|이란|란\s|정의|개념|의미|특징|종류|예시|예를들어|예를 들어/.test(sentence)) {
      score += 2 // 정의나 설명 문장
    }

    if (/\d+/.test(sentence)) {
      score += 1 // 숫자 포함 문장
    }

    if (/중요|핵심|필수|반드시|꼭/.test(sentence)) {
      score += 2 // 중요성 강조 문장
    }

    return { sentence, score }
  })

  // 점수 기준 내림차순 정렬
  scoredSentences.sort((a, b) => b.score - a.score)

  // 상위 30개 문장 선택 (또는 전체 문장이 30개 미만이면 전체 선택)
  return scoredSentences.slice(0, 30).map((item) => item.sentence)
}

/**
 * 컨텐츠에서 중요 키워드 추출
 *
 * 이 함수는 컨텐츠와 추출된 문장을 분석하여 중요 키워드를 추출합니다.
 * 빈도수, 단어 길이, 특수 패턴 등을 고려하여 키워드를 선정합니다.
 *
 * @param content 분석할 컨텐츠
 * @param sentences 추출된 문장 배열
 * @returns 추출된 중요 키워드 배열
 */
function extractKeywords(content: string, sentences: string[]): string[] {
  // 불용어 목록 (문제 생성에 적합하지 않은 일반적인 단어)
  const stopWords = new Set([
    "그",
    "이",
    "저",
    "것",
    "수",
    "등",
    "들",
    "및",
    "에서",
    "으로",
    "에게",
    "에게서",
    "또는",
    "그리고",
    "하지만",
    "때문에",
    "그래서",
    "따라서",
    "그러나",
    "그러므로",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "through",
    "over",
    "before",
    "between",
    "after",
    "since",
    "without",
  ])

  // 모든 문장에서 단어 추출
  const words = sentences
    .join(" ")
    .split(/\s+/)
    .map((word) => word.replace(/[^\w가-힣]/g, "").trim())
    .filter(
      (word) =>
        word.length >= 2 && // 2글자 이상
        !stopWords.has(word.toLowerCase()) && // 불용어 제외
        !/^\d+$/.test(word), // 숫자만으로 이루어진 단어 제외
    )

  // 단어 빈도수 계산
  const wordFrequency: Record<string, number> = {}
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  }

  // 단어 점수 계산
  const scoredWords = Object.keys(wordFrequency).map((word) => {
    // 기본 점수 (빈도수)
    let score = wordFrequency[word]

    // 단어 길이에 따른 가중치 (길수록 중요할 가능성 높음)
    if (word.length >= 4) {
      score *= 1.5
    }

    // 대문자로 시작하는 단어 (고유명사일 가능성)
    if (/^[A-Z가-힣]/.test(word)) {
      score *= 1.2
    }

    // 특수 패턴 (전문 용어일 가능성)
    if (/[A-Z]{2,}/.test(word) || /\d+[A-Za-z]+/.test(word)) {
      score *= 1.3
    }

    return { word, score }
  })

  // 점수 기준 내림차순 정렬
  scoredWords.sort((a, b) => b.score - a.score)

  // 상위 20개 키워드 선택 (또는 전체 키워드가 20개 미만이면 전체 선택)
  return scoredWords.slice(0, 20).map((item) => item.word)
}

/**
 * 문장에서 객관식 문제 생성
 *
 * 이 함수는 주어진 문장과 키워드를 기반으로 객관식 문제를 생성합니다.
 *
 * @param sentence 문제의 기반이 되는 문장
 * @param keyword 문제와 관련된 키워드
 * @param index 문제 번호
 * @param allSentences 모든 문장 배열 (오답 생성에 사용)
 * @returns 생성된 객관식 문제
 */
function generateMultipleChoiceFromSentence(
  sentence: string,
  keyword: string,
  index: number,
  allSentences: string[],
): Question | null {
  // 문장에서 중요 단어 찾기
  const words = sentence
    .split(/\s+/)
    .map((word) => word.replace(/[^\w가-힣]/g, "").trim())
    .filter((word) => word.length >= 2)

  // 문장에 단어가 너무 적으면 null 반환
  if (words.length < 5) return null

  // 문제 유형 결정 (1: 빈칸 채우기, 2: 문장 선택)
  const questionType = Math.random() < 0.7 ? 1 : 2

  let question = ""
  let correctAnswer = ""
  let options: string[] = []

  if (questionType === 1) {
    // 빈칸 채우기 문제
    // 중요 단어 선택 (키워드가 있으면 키워드 사용, 없으면 랜덤 단어)
    let targetWord = ""

    if (keyword && sentence.includes(keyword)) {
      targetWord = keyword
    } else {
      // 중요 단어 후보 (3글자 이상)
      const candidates = words.filter((word) => word.length >= 3)
      if (candidates.length === 0) return null

      // 랜덤 단어 선택
      targetWord = candidates[Math.floor(Math.random() * candidates.length)]
    }

    // 빈칸으로 대체
    const blankSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, "gi"), "_____")

    // 문제와 정답 설정
    question = `다음 문장의 빈칸에 들어갈 가장 적절한 단어는 무엇인가요?\n\n"${blankSentence}"`
    correctAnswer = targetWord

    // 오답 생성
    options = generateWrongOptions(targetWord, words, allSentences)
    options.push(targetWord)
  } else {
    // 문장 선택 문제
    question = `다음 중 "${sentence}"와 가장 관련이 깊은 설명은 무엇인가요?`
    correctAnswer = summarizeSentence(sentence)

    // 오답 생성 (다른 문장에서 요약)
    options = []
    const otherSentences = allSentences.filter((s) => s !== sentence)

    for (let i = 0; i < 4; i++) {
      if (otherSentences.length > i) {
        options.push(summarizeSentence(otherSentences[i]))
      } else {
        // 다른 문장이 부족하면 임의 생성
        options.push(`이 내용은 ${words[i % words.length]}와 관련이 있습니다.`)
      }
    }

    options.push(correctAnswer)
  }

  // 옵션 섞기
  shuffleArray(options)

  // 문제 객체 생성
  return {
    id: `q-${index}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer,
    source: {
      text: sentence,
      reference: "컨텐츠 기반 생성 문제",
    },
    examInfo: `문제 ${index}`,
    hint: `문장의 핵심 내용을 생각해보세요.`,
  }
}

/**
 * 문장에서 주관식 문제 생성
 *
 * 이 함수는 주어진 문장과 키워드를 기반으로 주관식 문제를 생성합니다.
 *
 * @param sentence 문제의 기반이 되는 문장
 * @param keyword 문제와 관련된 키워드
 * @param index 문제 번호
 * @returns 생성된 주관식 문제
 */
function generateShortAnswerFromSentence(sentence: string, keyword: string, index: number): Question | null {
  // 문장에서 중요 단어 찾기
  const words = sentence
    .split(/\s+/)
    .map((word) => word.replace(/[^\w가-힣]/g, "").trim())
    .filter((word) => word.length >= 2)

  // 문장에 단어가 너무 적으면 null 반환
  if (words.length < 5) return null

  let targetWord = ""
  let question = ""

  // 키워드가 있고 문장에 포함되어 있으면 사용
  if (keyword && sentence.includes(keyword)) {
    targetWord = keyword

    // 빈칸으로 대체
    const blankSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, "gi"), "_____")
    question = `다음 문장의 빈칸에 들어갈 단어를 쓰세요:\n\n"${blankSentence}"`
  } else {
    // 중요 단어 후보 (3글자 이상)
    const candidates = words.filter((word) => word.length >= 3)
    if (candidates.length === 0) return null

    // 랜덤 단어 선택
    targetWord = candidates[Math.floor(Math.random() * candidates.length)]

    // 빈칸으로 대체
    const blankSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, "gi"), "_____")
    question = `다음 문장의 빈칸에 들어갈 단어를 쓰세요:\n\n"${blankSentence}"`
  }

  // 문제 객체 생성
  return {
    id: `q-${index}`,
    type: "short-answer",
    question,
    correctAnswer: targetWord,
    source: {
      text: sentence,
      reference: "컨텐츠 기반 생성 문제",
    },
    examInfo: `문제 ${index}`,
    hint: `${targetWord.charAt(0)}로 시작하는 단어입니다.`,
  }
}

/**
 * 오답 생성 함수
 *
 * 이 함수는 정답과 유사하지만 다른 오답을 생성합니다.
 *
 * @param correctAnswer 정답
 * @param words 문장에서 추출한 단어 목록
 * @param allSentences 모든 문장 배열
 * @returns 생성된 오답 배열
 */
function generateWrongOptions(correctAnswer: string, words: string[], allSentences: string[]): string[] {
  const wrongOptions: string[] = []

  // 1. 비슷한 길이의 다른 단어 사용
  const similarLengthWords = words.filter(
    (word) => word !== correctAnswer && Math.abs(word.length - correctAnswer.length) <= 2,
  )

  if (similarLengthWords.length > 0) {
    wrongOptions.push(similarLengthWords[Math.floor(Math.random() * similarLengthWords.length)])
  }

  // 2. 다른 문장에서 단어 추출
  const otherWords = new Set<string>()
  allSentences.forEach((sentence) => {
    sentence.split(/\s+/).forEach((word) => {
      const cleanWord = word.replace(/[^\w가-힣]/g, "").trim()
      if (cleanWord.length >= 3 && cleanWord !== correctAnswer) {
        otherWords.add(cleanWord)
      }
    })
  })

  const otherWordsArray = Array.from(otherWords)
  for (let i = 0; i < 3; i++) {
    if (otherWordsArray.length > i) {
      wrongOptions.push(otherWordsArray[Math.floor(Math.random() * otherWordsArray.length)])
    }
  }

  // 3. 정답 변형
  if (correctAnswer.length > 3) {
    // 글자 순서 변경
    const chars = correctAnswer.split("")
    const lastIndex = chars.length - 1
    ;[chars[0], chars[lastIndex]] = [chars[lastIndex], chars[0]]
    wrongOptions.push(chars.join(""))
  }

  // 중복 제거 및 최대 4개 선택
  return Array.from(new Set(wrongOptions)).slice(0, 4)
}

/**
 * 문장 요약 함수
 *
 * 이 함수는 문장을 간단하게 요약합니다.
 *
 * @param sentence 요약할 문장
 * @returns 요약된 문장
 */
function summarizeSentence(sentence: string): string {
  // 문장이 너무 길면 앞부분만 사용
  if (sentence.length > 50) {
    return sentence.substring(0, 50) + "..."
  }
  return sentence
}

/**
 * 대체 문제 생성 함수
 *
 * 이 함수는 문제 생성이 실패했을 때 사용하는 대체 문제를 생성합니다.
 *
 * @param content 원본 컨텐츠
 * @param type 문제 유형
 * @param count 생성할 문제 수
 * @returns 생성된 대체 문제 배열
 */
function generateFallbackQuestions(content: string, type: string, count: number): Question[] {
  const questions: Question[] = []

  // 컨텐츠에서 단어 추출
  const words = content
    .split(/\s+/)
    .map((word) => word.replace(/[^\w가-힣]/g, "").trim())
    .filter((word) => word.length >= 3)

  // 중복 제거
  const uniqueWords = Array.from(new Set(words))

  // 단어가 너무 적으면 기본 문제 생성
  if (uniqueWords.length < 5) {
    for (let i = 0; i < count; i++) {
      if (type === "multiple-choice") {
        questions.push({
          id: `q-${i + 1}`,
          type: "multiple-choice",
          question: `이 컨텐츠의 주제와 가장 관련이 있는 것은?`,
          options: ["학습 내용 이해", "주요 개념 파악", "핵심 요소 분석", "중요 정보 요약", "기본 원리 적용"],
          correctAnswer: "주요 개념 파악",
          source: {
            text: "컨텐츠 기반 생성 문제",
            reference: "대체 문제",
          },
          examInfo: `문제 ${i + 1}`,
          hint: "컨텐츠의 핵심 목적을 생각해보세요.",
        })
      } else {
        questions.push({
          id: `q-${i + 1}`,
          type: "short-answer",
          question: `이 컨텐츠에서 다루는 가장 중요한 개념은 무엇인가요?`,
          correctAnswer: "학습",
          source: {
            text: "컨텐츠 기반 생성 문제",
            reference: "대체 문제",
          },
          examInfo: `문제 ${i + 1}`,
          hint: "컨텐츠의 주요 목적과 관련된 단어입니다.",
        })
      }
    }
    return questions
  }

  // 단어 기반 문제 생성
  for (let i = 0; i < Math.min(count, uniqueWords.length); i++) {
    const word = uniqueWords[i]

    if (type === "multiple-choice") {
      // 객관식 문제
      const options = [`${word}의 정의`, `${word}의 특징`, `${word}의 예시`, `${word}의 종류`, `${word}의 활용`]

      questions.push({
        id: `q-${i + 1}`,
        type: "multiple-choice",
        question: `다음 중 "${word}"와 가장 관련이 깊은 것은?`,
        options,
        correctAnswer: options[0],
        source: {
          text: `컨텐츠에서 추출한 단어: ${word}`,
          reference: "대체 문제",
        },
        examInfo: `문제 ${i + 1}`,
        hint: `${word}의 기본적인 의미를 생각해보세요.`,
      })
    } else {
      // 주관식 문제
      questions.push({
        id: `q-${i + 1}`,
        type: "short-answer",
        question: `다음 설명에 해당하는 용어를 쓰세요: "${word}와(과) 관련된 개념"`,
        correctAnswer: word,
        source: {
          text: `컨텐츠에서 추출한 단어: ${word}`,
          reference: "대체 문제",
        },
        examInfo: `문제 ${i + 1}`,
        hint: `${word}의 첫 글자는 "${word.charAt(0)}"입니다.`,
      })
    }
  }

  return questions
}

/**
 * 배열 요소 무작위 섞기
 *
 * @param array 섞을 배열
 * @returns 섞인 배열
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

