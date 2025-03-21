import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// 데모용 사용자 - 실제로는 데이터베이스에서 가져와야 함
const users = [
  {
    id: "1",
    name: "테스트 사용자",
    email: "test@example.com",
    password: "password123",
    image: "https://via.placeholder.com/150",
  },
]

// NextAuth 설정
export const authOptions: NextAuthOptions = {
  providers: [
    // 구글 로그인
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // 카카오 로그인
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
    
    // 네이버 로그인
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    
    // 이메일/비밀번호 로그인
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // 실제로는 데이터베이스에서 사용자 확인 로직이 필요
        const user = users.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password
        )
        
        if (!user) {
          return null
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  // 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  // 페이지 설정
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },
  // 콜백 함수
  callbacks: {
    // JWT 콜백
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
      }
      return token
    },
    // 세션 콜백
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.provider = token.provider
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

// NextAuth 핸들러
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

