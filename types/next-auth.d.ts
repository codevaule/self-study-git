import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * JWT에 추가되는 속성들
   */
  interface JWT {
    id: string
    role: string
  }

  /**
   * 세션 사용자에 추가되는 속성들
   */
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      role: string
    }
  }

  /**
   * 사용자 객체에 추가되는 속성들
   */
  interface User {
    role?: string
  }
}

