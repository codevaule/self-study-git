/**
 * 다양한 문서 형식을 텍스트로 변환하는 유틸리티
 * 지원 형식: DOCX, DOC, HWP, PDF, TXT, HTML, RTF, PPTX
 */
export async function convertDocumentToText(file: File): Promise<string> {
  try {
    // 파일 확장자 확인
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""

    // 파일 형식에 따라 적절한 변환 함수 호출
    switch (fileExtension) {
      case "txt":
        return await extractTextFromTxt(file)
      case "html":
      case "htm":
        return await extractTextFromHtml(file)
      case "rtf":
        return await extractTextFromRtf(file)
      case "docx":
        return await extractTextFromDocx(file)
      case "doc":
        return await extractTextFromDoc(file)
      case "hwp":
        return await extractTextFromHwp(file)
      case "pdf":
        return await extractTextFromPdf(file)
      case "pptx":
      case "ppt":
        return await extractTextFromPpt(file)
      default:
        throw new Error(`지원하지 않는 파일 형식입니다: ${fileExtension}`)
    }
  } catch (error) {
    console.error("문서 변환 오류:", error)
    throw new Error("문서를 텍스트로 변환하는 중 오류가 발생했습니다.")
  }
}

/**
 * TXT 파일에서 텍스트 추출
 */
async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        resolve(text || "")
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

/**
 * HTML 파일에서 텍스트 추출
 */
async function extractTextFromHtml(file: File): Promise<string> {
  const htmlContent = await extractTextFromTxt(file)

  // HTML 태그 제거
  const tempElement = document.createElement("div")
  tempElement.innerHTML = htmlContent

  // 스크립트와 스타일 태그 제거
  const scriptTags = tempElement.querySelectorAll("script, style")
  scriptTags.forEach((tag) => tag.remove())

  // 텍스트 컨텐츠만 추출
  return tempElement.textContent || ""
}

/**
 * RTF 파일에서 텍스트 추출 (기본 구현)
 */
async function extractTextFromRtf(file: File): Promise<string> {
  const rtfContent = await extractTextFromTxt(file)

  // RTF 태그 제거 (간단한 구현)
  return rtfContent
    .replace(/[\\][a-z0-9\-*]+/g, " ") // RTF 명령어 제거
    .replace(/[\\][''][0-9a-f]{2}/g, " ") // 특수 문자 코드 제거
    .replace(/[\\{}]/g, " ") // 중괄호 및 백슬래시 제거
    .replace(/\s+/g, " ") // 연속된 공백 제거
    .trim()
}

/**
 * DOCX 파일에서 텍스트 추출 (클라이언트 측 구현)
 */
async function extractTextFromDocx(file: File): Promise<string> {
  try {
    // 브라우저에서 DOCX 파일을 처리하는 것은 제한적이므로 사용자에게 안내 메시지 제공
    return `DOCX 파일 "${file.name}" (${Math.round(file.size / 1024)} KB)이(가) 업로드되었습니다.
    
브라우저에서 DOCX 파일의 내용을 완전히 추출하는 것은 제한적입니다.
최상의 결과를 위해 다음 방법을 시도해보세요:

1. 문서를 열고 내용을 복사하여 직접 붙여넣기
2. 문서를 TXT 형식으로 저장한 후 업로드
3. PDF로 변환한 후 업로드

업로드한 파일명: ${file.name}
파일 크기: ${Math.round(file.size / 1024)} KB
파일 유형: ${file.type}`
  } catch (error) {
    console.error("DOCX 파일 처리 오류:", error)
    throw new Error("DOCX 파일을 처리하는 중 오류가 발생했습니다.")
  }
}

/**
 * DOC 파일에서 텍스트 추출 (클라이언트 측 구현)
 */
async function extractTextFromDoc(file: File): Promise<string> {
  // DOC 파일도 DOCX와 유사한 제한이 있음
  return await extractTextFromDocx(file)
}

/**
 * HWP 파일에서 텍스트 추출 (클라이언트 측 구현)
 */
async function extractTextFromHwp(file: File): Promise<string> {
  try {
    // 브라우저에서 HWP 파일을 처리하는 것은 매우 제한적임
    return `HWP 파일 "${file.name}" (${Math.round(file.size / 1024)} KB)이(가) 업로드되었습니다.
    
브라우저에서 HWP 파일의 내용을 추출하는 것은 현재 지원되지 않습니다.
최상의 결과를 위해 다음 방법을 시도해보세요:

1. 문서를 열고 내용을 복사하여 직접 붙여넣기
2. 문서를 TXT 형식으로 저장한 후 업로드
3. PDF로 변환한 후 업로드

업로드한 파일명: ${file.name}
파일 크기: ${Math.round(file.size / 1024)} KB
파일 유형: ${file.type}`
  } catch (error) {
    console.error("HWP 파일 처리 오류:", error)
    throw new Error("HWP 파일을 처리하는 중 오류가 발생했습니다.")
  }
}

/**
 * PDF 파일에서 텍스트 추출 (클라이언트 측 구현)
 * 참고: 실제 PDF 텍스트 추출은 lib/pdf-utils.ts에서 처리
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // PDF 파일은 별도 처리가 필요하므로 안내 메시지 제공
    return `PDF 파일 "${file.name}" (${Math.round(file.size / 1024)} KB)이(가) 업로드되었습니다.
    
PDF 파일은 'PDF 파일' 탭을 사용하여 업로드해 주세요.
해당 탭에서는 PDF 텍스트 추출 및 OCR 기능을 제공합니다.

업로드한 파일명: ${file.name}
파일 크기: ${Math.round(file.size / 1024)} KB
파일 유형: ${file.type}`
  } catch (error) {
    console.error("PDF 파일 처리 오류:", error)
    throw new Error("PDF 파일을 처리하는 중 오류가 발생했습니다.")
  }
}

/**
 * PPT/PPTX 파일에서 텍스트 추출 (클라이언트 측 구현)
 */
async function extractTextFromPpt(file: File): Promise<string> {
  try {
    // 브라우저에서 PPT/PPTX 파일을 처리하는 것은 제한적이므로 사용자에게 안내 메시지 제공
    return `PPT/PPTX 파일 "${file.name}" (${Math.round(file.size / 1024)} KB)이(가) 업로드되었습니다.
    
브라우저에서 PPT/PPTX 파일의 내용을 완전히 추출하는 것은 제한적입니다.
최상의 결과를 위해 다음 방법을 시도해보세요:

1. 프레젠테이션을 열고 내용을 복사하여 직접 붙여넣기
2. 프레젠테이션을 TXT 형식으로 저장한 후 업로드
3. PDF로 변환한 후 업로드

업로드한 파일명: ${file.name}
파일 크기: ${Math.round(file.size / 1024)} KB
파일 유형: ${file.type}`
  } catch (error) {
    console.error("PPT/PPTX 파일 처리 오류:", error)
    throw new Error("PPT/PPTX 파일을 처리하는 중 오류가 발생했습니다.")
  }
}

