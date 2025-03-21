"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// 사용자 역할 타입
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// 사용자 정보 타입
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// 인증 상태 타입
export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// 인증 훅
export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  // 사용자 정보 조회
  const fetchUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/auth/me")

      if (!response.ok) {
        if (response.status === 401) {
          setState({ user: null, isLoading: false, error: null })
          return
        }

        throw new Error("Failed to fetch user")
      }

      const data = await response.json()
      setState({ user: data.user, isLoading: false, error: null })
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "인증 정보를 가져오는 중 오류가 발생했습니다.",
      })
    }
  }, [])

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to logout")
      }

      setState({ user: null, isLoading: false, error: null })
      router.push("/login")
      router.refresh()
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "로그아웃 중 오류가 발생했습니다.",
      }))
    }
  }, [router])

  // 초기 로드 시 사용자 정보 조회
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    logout,
    refresh: fetchUser,
  }
}

