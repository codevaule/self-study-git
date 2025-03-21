'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// 클라이언트 측 렌더링을 추적하는 컨텍스트
const ClientSideContext = React.createContext(false)

export function useClientSide() {
  return React.useContext(ClientSideContext)
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // hydration 문제를 방지하기 위해 마운트 후에만 렌더링
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ClientSideContext.Provider value={true}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </ClientSideContext.Provider>
  )
}
