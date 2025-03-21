import type { User } from "@/types/user"

// 소셜 로그인 제공자 타입
export type SocialProvider = "google" | "facebook" | "kakao" | "naver"

// 소셜 로그인 설정
export interface SocialLoginConfig {
  clientId: string
  redirectUri: string
  scope: string
}

// 소셜 로그인 응답
export interface SocialLoginResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// 소셜 로그인 설정 맵
const socialLoginConfigs: Record<SocialProvider, SocialLoginConfig> = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/google`,
    scope: "email profile",
  },
  facebook: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/facebook`,
    scope: "email,public_profile",
  },
  kakao: {
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/kakao`,
    scope: "profile_nickname,account_email",
  },
  naver: {
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/naver`,
    scope: "name,email",
  },
}

// 소셜 로그인 URL 생성
export function getSocialLoginUrl(provider: SocialProvider): string {
  const config = socialLoginConfigs[provider]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // 클라이언트 측에서는 환경 변수가 NEXT_PUBLIC_ 접두사가 있어야 함
  let clientId
  switch (provider) {
    case "google":
      clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      break
    case "kakao":
      clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
      break
    case "naver":
      clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
      break
    case "facebook":
      clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID
      break
    default:
      clientId = ""
  }

  if (!clientId) {
    // 소셜 로그인이 설정되지 않았을 때는 직접 NextAuth 엔드포인트로 리디렉션
    return `/api/auth/signin/${provider}`
  }

  switch (provider) {
    case "google":
      return `/api/auth/signin/google`

    case "facebook":
      return `/api/auth/signin/facebook`

    case "kakao":
      return `/api/auth/signin/kakao`

    case "naver":
      return `/api/auth/signin/naver`

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

// 소셜 로그인 콜백 처리 (서버 측)
export async function handleSocialLoginCallback(provider: SocialProvider, code: string): Promise<SocialLoginResponse> {
  try {
    const config = socialLoginConfigs[provider]

    if (!config.clientId) {
      throw new Error(`Client ID for ${provider} is not configured`)
    }

    // 각 제공자별 토큰 교환 로직
    let tokenResponse
    let userInfo

    switch (provider) {
      case "google":
        // Google 토큰 교환
        tokenResponse = await exchangeGoogleToken(code, config)
        userInfo = await fetchGoogleUserInfo(tokenResponse.access_token)
        break

      case "facebook":
        // Facebook 토큰 교환
        tokenResponse = await exchangeFacebookToken(code, config)
        userInfo = await fetchFacebookUserInfo(tokenResponse.access_token)
        break

      case "kakao":
        // Kakao 토큰 교환
        tokenResponse = await exchangeKakaoToken(code, config)
        userInfo = await fetchKakaoUserInfo(tokenResponse.access_token)
        break

      case "naver":
        // Naver 토큰 교환
        tokenResponse = await exchangeNaverToken(code, config)
        userInfo = await fetchNaverUserInfo(tokenResponse.access_token)
        break

      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    // 사용자 정보를 기반으로 사용자 생성 또는 조회
    const user = await findOrCreateUser(userInfo, provider)

    // JWT 토큰 생성
    const token = generateJWT(user)

    return {
      success: true,
      user,
      token,
    }
  } catch (error) {
    console.error(`Social login error (${provider}):`, error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// Google 토큰 교환
async function exchangeGoogleToken(code: string, config: SocialLoginConfig) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!response.ok) {
    throw new Error(`Google token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

// Facebook 토큰 교환
async function exchangeFacebookToken(code: string, config: SocialLoginConfig) {
  const response = await fetch(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET || ""}&code=${code}`,
  )

  if (!response.ok) {
    throw new Error(`Facebook token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

// Kakao 토큰 교환
async function exchangeKakaoToken(code: string, config: SocialLoginConfig) {
  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: process.env.KAKAO_CLIENT_SECRET || "",
      redirect_uri: config.redirectUri,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(`Kakao token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

// Naver 토큰 교환
async function exchangeNaverToken(code: string, config: SocialLoginConfig) {
  const response = await fetch("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: process.env.NAVER_CLIENT_SECRET || "",
      redirect_uri: config.redirectUri,
      code,
      state: "STATE_STRING",
    }),
  })

  if (!response.ok) {
    throw new Error(`Naver token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

// 사용자 정보 조회 함수들
async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Google user info: ${response.statusText}`)
  }

  return response.json()
}

async function fetchFacebookUserInfo(accessToken: string) {
  const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Facebook user info: ${response.statusText}`)
  }

  return response.json()
}

async function fetchKakaoUserInfo(accessToken: string) {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Kakao user info: ${response.statusText}`)
  }

  return response.json()
}

async function fetchNaverUserInfo(accessToken: string) {
  const response = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Naver user info: ${response.statusText}`)
  }

  return response.json()
}

// 사용자 생성 또는 조회
async function findOrCreateUser(userInfo: any, provider: SocialProvider): Promise<User> {
  // 실제 구현에서는 데이터베이스 조회 및 생성 로직 구현
  // 여기서는 테스트용 더미 데이터 반환
  return {
    id: userInfo.id || `${provider}_${Date.now()}`,
    name: userInfo.name || userInfo.login || userInfo.nickname || "User",
    email: userInfo.email || `${userInfo.id}@example.com`,
    image: userInfo.picture || userInfo.avatar_url || null,
    provider,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// JWT 토큰 생성
function generateJWT(user: User): string {
  // 실제 구현에서는 JWT 라이브러리 사용
  // 여기서는 테스트용 더미 토큰 반환
  return `dummy_jwt_token_for_${user.id}`
}

