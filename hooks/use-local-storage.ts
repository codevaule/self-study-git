"use client"

import { useState, useEffect, useCallback } from "react"
import { storageManager } from "@/lib/storage/local-storage-manager"

/**
 * 로컬 스토리지 훅
 * - 로컬 스토리지 값을 React 상태로 관리
 * - 할당량 초과 오류 자동 처리
 *
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @param expiry 만료 시간 (밀리초, 기본값: 30일)
 * @returns [값, 값 설정 함수, 값 삭제 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  expiry?: number,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 로컬 스토리지에서 값 가져오기
      const item = storageManager.getItem<T>(key)

      // 값이 있으면 반환, 없으면 초기값 반환
      return item !== null ? item : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 값 설정 함수
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 함수인 경우 이전 값을 인자로 전달
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // 상태 업데이트
        setStoredValue(valueToStore)

        // 로컬 스토리지에 저장
        storageManager.setItem(key, valueToStore, expiry)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, expiry],
  )

  // 값 삭제 함수
  const removeValue = useCallback(() => {
    try {
      // 로컬 스토리지에서 삭제
      storageManager.removeItem(key)

      // 상태 초기화
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // 다른 탭/창에서 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(storageManager["prefix"] + key)) {
        try {
          const newValue = storageManager.getItem<T>(key)
          if (newValue !== null) {
            setStoredValue(newValue)
          } else {
            setStoredValue(initialValue)
          }
        } catch (error) {
          console.error(`Error handling storage event for key "${key}":`, error)
        }
      }
    }

    // 스토리지 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange)

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

