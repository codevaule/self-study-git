"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useClientSide } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isMounted = useClientSide()
  
  // 클라이언트 사이드 렌더링 여부 확인
  if (!isMounted) {
    // 렌더링 중 레이아웃 변화를 방지하기 위한 플레이스홀더
    return <div className="h-9 w-9" />
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 변경</span>
    </Button>
  )
} 