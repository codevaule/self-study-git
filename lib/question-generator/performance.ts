import type { Document, DocumentSection, Keyword } from "./types"

/**
 * 대용량 문서 처리를 위한 성능 최적화 유틸리티
 */

// 문서 청크 크기 (문자 수)
const CHUNK_SIZE = 10000

// 문서를 청크로 분할하여 처리
export function processLargeDocument(
  title: string,
  content: string,
  processChunk: (chunk: string) => Promise<DocumentSection[]>,
): Promise<Document> {
  return new Promise(async (resolve, reject) => {
    try {
      // 문서 초기화
      const document: Document = {
        id: generateDocumentId(),
        title,
        content,
        sections: [],
        createdAt: Date.now(),
      }

      // 컨텐츠가 충분히 작으면 한 번에 처리
      if (content.length <= CHUNK_SIZE) {
        document.sections = await processChunk(content)
        resolve(document)
        return
      }

      // 청크로 분할하여 처리
      const chunks = splitIntoChunks(content, CHUNK_SIZE)
      const sectionPromises = chunks.map((chunk) => processChunk(chunk))

      // 모든 청크 처리 완료 대기
      const allSections = await Promise.all(sectionPromises)

      // 결과 병합
      document.sections = allSections.flat()

      resolve(document)
    } catch (error) {
      reject(error)
    }
  })
}

// 문서 ID 생성
function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// 텍스트를 청크로 분할 (문단 경계 유지)
function splitIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  const paragraphs = text.split(/\n\s*\n/)

  let currentChunk = ""

  for (const paragraph of paragraphs) {
    // 현재 청크에 단락 추가 시 크기 초과 여부 확인
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk)
      currentChunk = ""
    }

    // 단락이 청크 크기보다 크면 분할
    if (paragraph.length > chunkSize) {
      const sentenceChunks = splitLargeParagraph(paragraph, chunkSize)

      // 첫 번째 문장 청크는 현재 청크에 추가
      if (currentChunk.length > 0) {
        currentChunk += "\n\n" + sentenceChunks[0]
        chunks.push(currentChunk)
        currentChunk = ""

        // 나머지 문장 청크는 개별 청크로 추가
        for (let i = 1; i < sentenceChunks.length; i++) {
          chunks.push(sentenceChunks[i])
        }
      } else {
        // 현재 청크가 비어있으면 모든 문장 청크를 개별 청크로 추가
        chunks.push(...sentenceChunks)
      }
    } else {
      // 단락이 청크 크기보다 작으면 현재 청크에 추가
      if (currentChunk.length > 0) {
        currentChunk += "\n\n"
      }
      currentChunk += paragraph
    }
  }

  // 마지막 청크 추가
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

// 큰 단락을 문장 단위로 분할
function splitLargeParagraph(paragraph: string, chunkSize: number): string[] {
  const chunks: string[] = []
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph]

  let currentChunk = ""

  for (const sentence of sentences) {
    // 문장이 청크 크기보다 크면 단어 단위로 분할
    if (sentence.length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk)
        currentChunk = ""
      }

      const wordChunks = splitLargeSentence(sentence, chunkSize)
      chunks.push(...wordChunks)
      continue
    }

    // 현재 청크에 문장 추가 시 크기 초과 여부 확인
    if (currentChunk.length + sentence.length > chunkSize) {
      chunks.push(currentChunk)
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }

  // 마지막 청크 추가
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

// 큰 문장을 단어 단위로 분할
function splitLargeSentence(sentence: string, chunkSize: number): string[] {
  const chunks: string[] = []
  const words = sentence.split(/\s+/)

  let currentChunk = ""

  for (const word of words) {
    // 단어가 청크 크기보다 크면 문자 단위로 분할 (극히 드문 경우)
    if (word.length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk)
        currentChunk = ""
      }

      // 단어를 문자 단위로 분할
      let i = 0
      while (i < word.length) {
        chunks.push(word.substring(i, i + chunkSize))
        i += chunkSize
      }
      continue
    }

    // 현재 청크에 단어 추가 시 크기 초과 여부 확인
    if (currentChunk.length + word.length + 1 > chunkSize) {
      chunks.push(currentChunk)
      currentChunk = word
    } else {
      if (currentChunk.length > 0) {
        currentChunk += " "
      }
      currentChunk += word
    }
  }

  // 마지막 청크 추가
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

// 웹 워커를 사용한 병렬 처리
export function createWorkerPool(workerCount: number, workerScript: string) {
  const workers: Worker[] = []
  const taskQueue: Array<{
    task: any
    resolve: (result: any) => void
    reject: (error: any) => void
  }> = []
  const availableWorkers: Worker[] = []

  // 웹 워커 생성
  for (let i = 0; i < workerCount; i++) {
    const worker = new Worker(workerScript)

    worker.onmessage = (event) => {
      const { result, error, taskId } = event.data

      // 작업 완료 처리
      const taskIndex = taskQueue.findIndex((task) => task.task.id === taskId)
      if (taskIndex !== -1) {
        const task = taskQueue[taskIndex]
        taskQueue.splice(taskIndex, 1)

        if (error) {
          task.reject(error)
        } else {
          task.resolve(result)
        }
      }

      // 워커를 다시 사용 가능한 상태로 설정
      availableWorkers.push(worker)
      processQueue()
    }

    availableWorkers.push(worker)
  }

  // 작업 큐 처리
  function processQueue() {
    if (taskQueue.length > 0 && availableWorkers.length > 0) {
      const worker = availableWorkers.pop()!
      const task = taskQueue[0]
      taskQueue.shift()

      worker.postMessage(task.task)
    }
  }

  // 작업 추가
  function addTask<T>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      taskQueue.push({
        task: { ...task, id: Math.random().toString(36).substring(2, 9) },
        resolve,
        reject,
      })

      processQueue()
    })
  }

  // 워커 풀 종료
  function terminate() {
    workers.forEach((worker) => worker.terminate())
  }

  return {
    addTask,
    terminate,
    get pendingTasks() {
      return taskQueue.length
    },
    get availableWorkers() {
      return availableWorkers.length
    },
  }
}

// 메모이제이션을 사용한 키워드 추출 최적화
export function createMemoizedKeywordExtractor() {
  const cache = new Map<string, Keyword[]>()

  return {
    extractKeywords(text: string, options: any): Keyword[] {
      const cacheKey = `${text}:${JSON.stringify(options)}`

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!
      }

      // 실제 키워드 추출 로직 (여기서는 가정)
      const keywords: Keyword[] = [] // 실제 구현 필요

      // 결과 캐싱
      cache.set(cacheKey, keywords)

      // 캐시 크기 제한
      if (cache.size > 1000) {
        const oldestKey = cache.keys().next().value
        cache.delete(oldestKey)
      }

      return keywords
    },

    clearCache() {
      cache.clear()
    },
  }
}

// 비동기 배치 처리
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => Promise<R[]>,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await processFn(batch)
    results.push(...batchResults)
  }

  return results
}

