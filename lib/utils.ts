import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * 애플리케이션의 기본 URL을 반환합니다.
 * 배포 환경에서는 VERCEL_URL 또는 NEXT_PUBLIC_APP_URL을 사용하고,
 * 로컬 환경에서는 localhost:3000을 사용합니다.
 */
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Vercel 배포 환경
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 로컬 개발 환경
  return "http://localhost:3000"
}

