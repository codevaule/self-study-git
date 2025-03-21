/**
 * 로컬 스토리지 관리자
 * - 로컬 스토리지 할당량 초과 오류 처리
 * - 데이터 압축 및 최적화
 */

import { compress, decompress } from "./compression"

// 로컬 스토리지 키 접두사
const KEY_PREFIX = "study_helper_"

// 로컬 스토리지 항목 만료 시간 (기본값: 30일)
const DEFAULT_EXPIRY = 30 * 24 * 60 * 60 * 1000

// 로컬 스토리지 항목 타입
interface StorageItem<T> {
  value: T
  timestamp: number
  expiry?: number
}

/**
 * 로컬 스토리지 관리자 클래스
 */
export class LocalStorageManager {
  private readonly prefix: string
  private readonly compressionThreshold: number

  /**
   * 생성자
   * @param prefix 키 접두사 (기본값: 'study_helper_')
   * @param compressionThreshold 압축 임계값 (바이트, 기본값: 1024)
   */
  constructor(prefix: string = KEY_PREFIX, compressionThreshold = 1024) {
    this.prefix = prefix
    this.compressionThreshold = compressionThreshold
  }

  /**
   * 항목 저장
   * @param key 키
   * @param value 값
   * @param expiry 만료 시간 (밀리초, 기본값: 30일)
   */
  setItem<T>(key: string, value: T, expiry: number = DEFAULT_EXPIRY): boolean {
    try {
      const prefixedKey = this.prefix + key
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: expiry > 0 ? expiry : undefined,
      }

      const serialized = JSON.stringify(item)

      // 데이터 크기가 임계값을 초과하면 압축
      if (serialized.length > this.compressionThreshold) {
        const compressed = compress(serialized)
        localStorage.setItem(`${prefixedKey}:compressed`, compressed)
      } else {
        localStorage.setItem(prefixedKey, serialized)
      }

      return true
    } catch (error) {
      // 할당량 초과 오류 처리
      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        this.handleQuotaExceeded(key, value, expiry)
      } else {
        console.error("Error saving to localStorage:", error)
      }

      return false
    }
  }

  /**
   * 항목 조회
   * @param key 키
   * @returns 값 또는 null
   */
  getItem<T>(key: string): T | null {
    try {
      const prefixedKey = this.prefix + key

      // 압축된 데이터 확인
      const compressedData = localStorage.getItem(`${prefixedKey}:compressed`)
      if (compressedData) {
        const decompressed = decompress(compressedData)
        const item = JSON.parse(decompressed) as StorageItem<T>

        // 만료 확인
        if (item.expiry && Date.now() - item.timestamp > item.expiry) {
          this.removeItem(key)
          return null
        }

        return item.value
      }

      // 일반 데이터 확인
      const data = localStorage.getItem(prefixedKey)
      if (!data) return null

      const item = JSON.parse(data) as StorageItem<T>

      // 만료 확인
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        this.removeItem(key)
        return null
      }

      return item.value
    } catch (error) {
      console.error("Error retrieving from localStorage:", error)
      return null
    }
  }

  /**
   * 항목 삭제
   * @param key 키
   */
  removeItem(key: string): void {
    try {
      const prefixedKey = this.prefix + key
      localStorage.removeItem(prefixedKey)
      localStorage.removeItem(`${prefixedKey}:compressed`)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  /**
   * 모든 항목 삭제
   */
  clear(): void {
    try {
      const keysToRemove: string[] = []

      // 접두사로 시작하는 모든 키 찾기
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }

      // 찾은 키 삭제
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }

  /**
   * 만료된 항목 정리
   */
  cleanup(): void {
    try {
      const now = Date.now()
      const keysToCheck: string[] = []

      // 접두사로 시작하는 모든 키 찾기
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix) && !key.endsWith(":compressed")) {
          keysToCheck.push(key)
        }
      }

      // 만료된 항목 삭제
      keysToCheck.forEach((key) => {
        try {
          const data = localStorage.getItem(key)
          if (!data) return

          const item = JSON.parse(data) as StorageItem<any>
          if (item.expiry && now - item.timestamp > item.expiry) {
            localStorage.removeItem(key)
            localStorage.removeItem(`${key}:compressed`)
          }
        } catch (e) {
          // 개별 항목 처리 중 오류 무시
        }
      })
    } catch (error) {
      console.error("Error during localStorage cleanup:", error)
    }
  }

  /**
   * 할당량 초과 오류 처리
   * @param key 저장하려는 키
   * @param value 저장하려는 값
   * @param expiry 만료 시간
   */
  private handleQuotaExceeded<T>(key: string, value: T, expiry: number): void {
    try {
      // 1. 만료된 항목 정리
      this.cleanup()

      // 2. 다시 저장 시도
      try {
        this.setItem(key, value, expiry)
        return // 성공하면 종료
      } catch (e) {
        // 계속 진행
      }

      // 3. 가장 오래된 항목부터 삭제
      const itemsInfo: { key: string; timestamp: number }[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (storageKey && storageKey.startsWith(this.prefix) && !storageKey.endsWith(":compressed")) {
          try {
            const data = localStorage.getItem(storageKey)
            if (!data) continue

            const item = JSON.parse(data) as StorageItem<any>
            itemsInfo.push({
              key: storageKey,
              timestamp: item.timestamp,
            })
          } catch (e) {
            // 개별 항목 처리 중 오류 무시
          }
        }
      }

      // 타임스탬프 기준 정렬 (오래된 순)
      itemsInfo.sort((a, b) => a.timestamp - b.timestamp)

      // 전체 항목의 20%를 삭제 (최소 1개)
      const removeCount = Math.max(1, Math.ceil(itemsInfo.length * 0.2))
      for (let i = 0; i < removeCount && i < itemsInfo.length; i++) {
        const keyToRemove = itemsInfo[i].key.substring(this.prefix.length)
        this.removeItem(keyToRemove)
      }

      // 4. 다시 저장 시도
      this.setItem(key, value, expiry)
    } catch (error) {
      console.error("Error handling quota exceeded:", error)
    }
  }

  /**
   * 사용 중인 로컬 스토리지 용량 확인
   * @returns 사용 중인 용량 (바이트)
   */
  getUsage(): number {
    let total = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key) || ""
        total += key.length + value.length
      }
    }

    return total * 2 // UTF-16 인코딩 (2바이트/문자)
  }

  /**
   * 로컬 스토리지 할당량 확인
   * @returns 할당량 (바이트) 또는 null
   */
  getQuota(): number | null {
    try {
      if ("quota" in navigator && "estimate" in navigator.storage) {
        return navigator.storage
          .estimate()
          .then((estimate) => estimate.quota || null)
          .catch(() => null)
      }
      return null
    } catch (error) {
      console.error("Error getting storage quota:", error)
      return null
    }
  }
}

// 싱글톤 인스턴스
export const storageManager = new LocalStorageManager()

