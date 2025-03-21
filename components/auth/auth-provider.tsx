"use client"

import React, { useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 마운트 상태 변경
    if (typeof window !== 'undefined') {
      const timeout = setTimeout(() => {
        setMounted(true);
      }, 50);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  // SSR 중에는 최소한의 마크업만 반환
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  // 클라이언트 측에서 완전히 마운트된 후 세션 제공자 렌더링
  return <SessionProvider>{children}</SessionProvider>;
}

