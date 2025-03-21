"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <h2 className="text-2xl font-bold mb-4">예기치 않은 오류가 발생했습니다</h2>
          <p className="text-red-500 mb-4">
            {error.message || "애플리케이션에 문제가 발생했습니다"}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => reset()}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
} 