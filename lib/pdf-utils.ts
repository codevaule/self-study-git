// PDF.js 라이브러리를 사용하여 PDF 파일에서 텍스트를 추출하는 유틸리티 함수
import { extractTextFromPdfFallback } from "./fallback-pdf-extractor"

// PDF 파일에서 텍스트 추출 함수
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // PDF.js 라이브러리 동적 로드 (브라우저 환경에서만 실행)
    if (typeof window === "undefined") {
      throw new Error("PDF 처리는 브라우저 환경에서만 가능합니다.")
    }

    try {
      // 여러 방법을 시도하여 가장 좋은 결과를 반환
      const results = await Promise.allSettled([
        extractWithPdfJs(file),
        extractWithFallback(file),
        extractWithDataTransfer(file),
      ])

      // 성공한 결과 중 가장 긴 텍스트를 선택 (더 많은 텍스트가 추출되었다고 가정)
      const successfulResults = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<string>).value)
        .filter((text) => text && text.length > 0)

      if (successfulResults.length === 0) {
        throw new Error("모든 PDF 추출 방법이 실패했습니다.")
      }

      // 가장 긴 텍스트 선택
      const bestResult = successfulResults.reduce(
        (longest, current) => (current.length > longest.length ? current : longest),
        "",
      )

      // PDF 바이너리 구조 패턴 검사
      if (isPdfBinaryStructure(bestResult)) {
        // 다른 방법으로 다시 시도
        console.warn("PDF 바이너리 구조가 감지되었습니다. 다른 방법으로 다시 시도합니다.")

        // 다른 추출 방법 시도
        const alternativeResults = await Promise.allSettled([
          extractWithPdfJsAlternative(file),
          extractWithTextDecoder(file),
        ])

        const alternativeSuccessful = alternativeResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => (r as PromiseFulfilledResult<string>).value)
          .filter((text) => text && text.length > 0 && !isPdfBinaryStructure(text))

        if (alternativeSuccessful.length > 0) {
          // 가장 긴 대체 결과 선택
          const bestAlternative = alternativeSuccessful.reduce(
            (longest, current) => (current.length > longest.length ? current : longest),
            "",
          )

          return normalizeKoreanText(bestAlternative)
        }
      }

      return normalizeKoreanText(bestResult)
    } catch (error) {
      console.error("PDF 텍스트 추출 오류:", error)
      throw new Error("PDF 파일에서 텍스트를 추출하는 중 오류가 발생했습니다.")
    }
  } catch (error) {
    console.error("PDF 처리 오류:", error)
    throw error
  }
}

// PDF 바이너리 구조인지 확인
const isPdfBinaryStructure = (text: string): boolean => {
  if (!text) return false

  // PDF 바이너리 구조 패턴
  const pdfPatterns = [
    /^%PDF-\d\.\d/, // PDF 헤더
    /obj<</, // PDF 객체
    /\/Type\/Page/, // 페이지 타입
    /\/Contents \d+ \d+ R/, // 콘텐츠 참조
    /\/MediaBox \[\d+ \d+ \d+ \d+\]/, // 미디어 박스
    /endobj/, // 객체 종료
    /xref/, // 크로스 레퍼런스 테이블
    /trailer/, // 트레일러
    /startxref/, // 시작 참조
  ]

  // 패턴 검사
  return pdfPatterns.some((pattern) => pattern.test(text.substring(0, 500)))
}

// PDF.js를 사용한 추출 방법
const extractWithPdfJs = async (file: File): Promise<string> => {
  try {
    // PDF.js 라이브러리 동적 로드
    const pdfjs = await import("pdfjs-dist/build/pdf")
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")

    // 워커 설정
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await readFileAsArrayBuffer(file)

    // PDF 문서 로드 (한글 지원을 위한 추가 옵션)
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/",
      useSystemFonts: true, // 시스템 폰트 사용 활성화
    })

    const pdf = await loadingTask.promise

    // 총 페이지 수 가져오기
    const numPages = pdf.numPages
    let fullText = ""

    // 각 페이지에서 텍스트 추출
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)

      // 향상된 텍스트 추출 옵션
      const textContent = await page.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      })

      // 텍스트 항목을 문자열로 변환 (개선된 방식)
      let lastY = null
      let pageText = ""

      for (const item of textContent.items) {
        const textItem = item as any

        // 새 줄 처리 개선
        if (lastY !== null && Math.abs(textItem.transform[5] - lastY) > 1) {
          pageText += "\n"
        }

        pageText += textItem.str
        lastY = textItem.transform[5]
      }

      fullText += pageText + "\n\n"
    }

    return normalizeKoreanText(fullText)
  } catch (error) {
    console.warn("PDF.js 처리 실패:", error)
    throw error
  }
}

// PDF.js 대체 방법 (다른 옵션으로 시도)
const extractWithPdfJsAlternative = async (file: File): Promise<string> => {
  try {
    // PDF.js 라이브러리 동적 로드
    const pdfjs = await import("pdfjs-dist/build/pdf")
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")

    // 워커 설정
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await readFileAsArrayBuffer(file)

    // 다른 옵션으로 PDF 문서 로드
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
      cMapPacked: true,
      disableRange: true,
      disableStream: true,
      disableAutoFetch: true,
      isEvalSupported: false,
    })

    const pdf = await loadingTask.promise
    let fullText = ""

    // 각 페이지에서 텍스트 추출
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)

      try {
        // 텍스트 레이어 렌더링 (다른 방식)
        const viewport = page.getViewport({ scale: 1.0 })
        const textLayerDiv = document.createElement("div")
        textLayerDiv.style.height = `${viewport.height}px`
        textLayerDiv.style.width = `${viewport.width}px`
        textLayerDiv.style.position = "absolute"
        textLayerDiv.style.left = "0"
        textLayerDiv.style.top = "0"
        textLayerDiv.style.overflow = "hidden"

        const textContent = await page.getTextContent()
        const textLayerFrag = document.createDocumentFragment()

        for (const item of textContent.items) {
          const textItem = item as any
          const textElement = document.createElement("span")
          textElement.textContent = textItem.str
          textLayerFrag.appendChild(textElement)
        }

        textLayerDiv.appendChild(textLayerFrag)
        fullText += textLayerDiv.textContent + "\n\n"
      } catch (pageError) {
        console.warn(`페이지 ${i} 텍스트 추출 실패:`, pageError)

        // 기본 방식으로 대체
        try {
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(" ")
          fullText += pageText + "\n\n"
        } catch (fallbackError) {
          console.warn(`페이지 ${i} 대체 텍스트 추출도 실패:`, fallbackError)
        }
      }
    }

    return normalizeKoreanText(fullText)
  } catch (error) {
    console.warn("PDF.js 대체 방법 실패:", error)
    throw error
  }
}

// 대체 추출기를 사용한 방법
const extractWithFallback = async (file: File): Promise<string> => {
  try {
    const text = await extractTextFromPdfFallback(file)
    return normalizeKoreanText(text)
  } catch (error) {
    console.warn("대체 PDF 추출기 실패:", error)
    throw error
  }
}

// DataTransfer API를 사용한 추출 방법 (클립보드 시뮬레이션)
const extractWithDataTransfer = async (file: File): Promise<string> => {
  try {
    // 이 방법은 일부 브라우저에서만 작동할 수 있음
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)

    // 파일을 텍스트로 읽기 시도
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        try {
          if (!event.target?.result) {
            throw new Error("파일을 읽을 수 없습니다.")
          }

          const text = event.target.result as string
          resolve(normalizeKoreanText(text))
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file, "UTF-8")
    })
  } catch (error) {
    console.warn("DataTransfer 추출 실패:", error)
    throw error
  }
}

// TextDecoder를 사용한 추출 방법
const extractWithTextDecoder = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)

    // 다양한 인코딩으로 시도
    const encodings = ["utf-8", "euc-kr", "utf-16", "iso-8859-1"]
    let bestResult = ""

    for (const encoding of encodings) {
      try {
        const decoder = new TextDecoder(encoding)
        const text = decoder.decode(arrayBuffer)

        // 한글 문자 수 계산
        const koreanCount = countKoreanCharacters(text)

        // 더 많은 한글이 포함된 결과 선택
        if (koreanCount > countKoreanCharacters(bestResult)) {
          bestResult = text
        }
      } catch (encodingError) {
        console.warn(`${encoding} 인코딩 디코딩 실패:`, encodingError)
      }
    }

    return normalizeKoreanText(bestResult)
  } catch (error) {
    console.warn("TextDecoder 추출 실패:", error)
    throw error
  }
}

// 한글 텍스트 정규화 함수
const normalizeKoreanText = (text: string): string => {
  try {
    // 1. 유니코드 정규화
    let normalized = text.normalize("NFC")

    // 2. 이상한 문자 제거 또는 대체
    normalized = normalized
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "") // 제어 문자 제거
      .replace(/[\uFFFD\uFFFE\uFFFF]/g, "") // 유효하지 않은 유니코드 제거

    // 3. 연속된 공백 및 줄바꿈 정리
    normalized = normalized
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim()

    // 4. 한글 깨짐 감지 및 복구 시도
    if (containsBrokenKorean(normalized)) {
      normalized = attemptKoreanRecovery(normalized)
    }

    return normalized
  } catch (error) {
    console.warn("텍스트 정규화 실패:", error)
    return text // 원본 반환
  }
}

// 깨진 한글 감지 함수
const containsBrokenKorean = (text: string): boolean => {
  // 한글 유니코드 범위를 벗어난 특수 문자 패턴 감지
  const suspiciousPatterns = [
    /[\uAC00-\uD7A3][\u0080-\u00FF]+/, // 한글 다음에 특수 문자
    /[\u0080-\u00FF]+[\uAC00-\uD7A3]/, // 특수 문자 다음에 한글
    /[\u0080-\u00FF]{2,}/, // 연속된 특수 문자
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(text))
}

// 깨진 한글 복구 시도 함수
const attemptKoreanRecovery = (text: string): string => {
  // 1. EUC-KR로 인코딩된 텍스트 복구 시도
  try {
    // 이 부분은 브라우저에서 직접 구현하기 어려움
    // 실제로는 서버 측에서 처리하거나 더 복잡한 라이브러리 필요
    return text
  } catch (error) {
    console.warn("한글 복구 실패:", error)
    return text
  }
}

// 한글 문자 수 계산
const countKoreanCharacters = (text: string): number => {
  let count = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 0xac00 && code <= 0xd7a3) {
      count++
    }
  }
  return count
}

// 파일을 ArrayBuffer로 읽는 헬퍼 함수
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result)
      } else {
        reject(new Error("파일을 ArrayBuffer로 변환하는 데 실패했습니다."))
      }
    }
    reader.onerror = (e) => {
      reject(new Error("파일 읽기 오류: " + e))
    }
    reader.readAsArrayBuffer(file)
  })
}

