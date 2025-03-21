"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
}

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // URL이 변경되면 모바일 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const mainItems: NavItem[] = [
    { title: "홈", href: "/" },
    { title: "서비스 소개", href: "/about" },
    { title: "가격 정책", href: "/pricing" },
    { title: "자주 묻는 질문", href: "/faq" },
    { title: "지원", href: "/support" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-primary shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">스터디헬퍼</span>
          </Link>
          <nav className="hidden md:flex gap-2">
            {mainItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link",
                  pathname === item.href && "nav-link-active"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="btn btn-outline"
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              className="btn btn-primary"
            >
              회원가입
            </Link>
          </div>
          <ThemeToggle />
          <button
            className="md:hidden btn btn-outline p-2"
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background flex flex-col p-4">
          <button
            className="self-end p-2"
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-lg">메뉴</h4>
              {mainItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-link",
                    pathname === item.href && "nav-link-active"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <h4 className="font-medium text-lg">계정</h4>
              <Link
                href="/auth/login"
                className="btn btn-outline w-full"
              >
                로그인
              </Link>
              <Link
                href="/auth/register"
                className="btn btn-primary w-full"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

