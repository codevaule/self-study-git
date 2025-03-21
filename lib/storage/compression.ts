/**
 * 데이터 압축 및 압축 해제 유틸리티
 */

/**
 * 문자열 압축
 * @param data 압축할 문자열
 * @returns 압축된 문자열
 */
export function compress(data: string): string {
  try {
    // 브라우저 환경 확인
    if (typeof window === "undefined") {
      return data
    }

    // TextEncoder를 사용하여 문자열을 Uint8Array로 변환
    const textEncoder = new TextEncoder()
    const uint8Array = textEncoder.encode(data)

    // CompressionStream API 사용 가능 여부 확인
    if ("CompressionStream" in window) {
      return compressWithCompressionStream(uint8Array)
    }

    // LZ-based 압축 알고리즘 구현
    return simpleLZCompress(data)
  } catch (error) {
    console.error("Compression error:", error)
    return data // 오류 발생 시 원본 반환
  }
}

/**
 * 압축된 문자열 압축 해제
 * @param compressedData 압축된 문자열
 * @returns 압축 해제된 문자열
 */
export function decompress(compressedData: string): string {
  try {
    // 브라우저 환경 확인
    if (typeof window === "undefined") {
      return compressedData
    }

    // CompressionStream API 사용 가능 여부 확인
    if ("CompressionStream" in window && compressedData.startsWith("CS:")) {
      return decompressWithCompressionStream(compressedData.substring(3))
    }

    // LZ-based 압축 해제 알고리즘 구현
    if (compressedData.startsWith("LZ:")) {
      return simpleLZDecompress(compressedData.substring(3))
    }

    return compressedData // 압축되지 않은 데이터
  } catch (error) {
    console.error("Decompression error:", error)
    return compressedData // 오류 발생 시 원본 반환
  }
}

/**
 * CompressionStream API를 사용한 압축
 * @param uint8Array 압축할 Uint8Array
 * @returns 압축된 문자열
 */
async function compressWithCompressionStream(uint8Array: Uint8Array): Promise<string> {
  // CompressionStream 생성
  const cs = new CompressionStream("deflate")
  const writer = cs.writable.getWriter()

  // 데이터 쓰기
  writer.write(uint8Array)
  writer.close()

  // 압축된 데이터 읽기
  const reader = cs.readable.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  // 청크 병합
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  // Base64 인코딩
  return "CS:" + btoa(String.fromCharCode.apply(null, Array.from(result)))
}

/**
 * CompressionStream API를 사용한 압축 해제
 * @param compressedData 압축된 문자열
 * @returns 압축 해제된 문자열
 */
async function decompressWithCompressionStream(compressedData: string): Promise<string> {
  // Base64 디코딩
  const binaryString = atob(compressedData)
  const uint8Array = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }

  // DecompressionStream 생성
  const ds = new DecompressionStream("deflate")
  const writer = ds.writable.getWriter()

  // 데이터 쓰기
  writer.write(uint8Array)
  writer.close()

  // 압축 해제된 데이터 읽기
  const reader = ds.readable.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  // 청크 병합
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  // TextDecoder를 사용하여 Uint8Array를 문자열로 변환
  const textDecoder = new TextDecoder()
  return textDecoder.decode(result)
}

/**
 * 간단한 LZ 기반 압축 알고리즘
 * @param data 압축할 문자열
 * @returns 압축된 문자열
 */
function simpleLZCompress(data: string): string {
  let result = ""
  let i = 0

  while (i < data.length) {
    const lookAhead = Math.min(data.length - i, 255)
    let bestLength = 0
    let bestOffset = 0

    // 최대 255자 이전까지 검색
    for (let offset = 1; offset <= Math.min(i, 255); offset++) {
      let length = 0
      while (length < lookAhead && data[i - offset + (length % offset)] === data[i + length]) {
        length++
      }

      if (length > bestLength) {
        bestLength = length
        bestOffset = offset
      }
    }

    if (bestLength >= 4) {
      // 반복 패턴 인코딩: <길이><오프셋>
      result += String.fromCharCode(bestLength) + String.fromCharCode(bestOffset)
      i += bestLength
    } else {
      // 리터럴 문자 인코딩: <0><문자>
      result += String.fromCharCode(0) + data[i]
      i++
    }
  }

  return "LZ:" + result
}

/**
 * 간단한 LZ 기반 압축 해제 알고리즘
 * @param compressedData 압축된 문자열
 * @returns 압축 해제된 문자열
 */
function simpleLZDecompress(compressedData: string): string {
  let result = ""
  let i = 0

  while (i < compressedData.length) {
    const length = compressedData.charCodeAt(i++)

    if (length === 0) {
      // 리터럴 문자
      result += compressedData[i++]
    } else {
      // 반복 패턴
      const offset = compressedData.charCodeAt(i++)
      const start = result.length - offset

      for (let j = 0; j < length; j++) {
        result += result[start + (j % offset)]
      }
    }
  }

  return result
}

