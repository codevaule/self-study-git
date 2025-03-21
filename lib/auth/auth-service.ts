/**
 * 인증 서비스
 * - 사용자 인증 및 권한 관리
 * - JWT 토큰 처리
 */

import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

// 사용자 역할 타입
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// 사용자 정보 타입
export interface UserInfo {
  id: string
  email: string
  name: string
  role: UserRole
}

// 인증 서비스 클래스
export class AuthService {
  private readonly secretKey: Uint8Array
  private readonly tokenExpiry: string
  private readonly cookieName: string

  /**
   * 생성자
   * @param secret JWT 시크릿 키
   * @param expiry 토큰 만료 시간 (기본값: '1d')
   * @param cookieName 쿠키 이름 (기본값: 'auth-token')
   */
  constructor(
    secret: string = process.env.JWT_SECRET || "default-secret-key-change-in-production",
    expiry = "1d",
    cookieName = "auth-token",
  ) {
    this.secretKey = new TextEncoder().encode(secret)
    this.tokenExpiry = expiry
    this.cookieName = cookieName
  }

  /**
   * JWT 토큰 생성
   * @param payload 토큰 페이로드
   * @returns JWT 토큰
   */
  async createToken(payload: any): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.tokenExpiry)
      .sign(this.secretKey)
  }

  /**
   * JWT 토큰 검증
   * @param token JWT 토큰
   * @returns 검증된 페이로드 또는 null
   */
  async verifyToken(token: string): Promise<any | null> {
    try {
      const { payload } = await jwtVerify(token, this.secretKey)
      return payload
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }

  /**
   * 쿠키에서 토큰 추출
   * @returns 토큰 또는 null
   */
  getTokenFromCookies(): string | null {
    const cookieStore = cookies()
    const token = cookieStore.get(this.cookieName)
    return token?.value || null
  }

  /**
   * 요청 헤더에서 토큰 추출
   * @param req Next.js 요청 객체
   * @returns 토큰 또는 null
   */
  getTokenFromRequest(req: NextRequest): string | null {
    // 쿠키에서 토큰 확인
    const token = req.cookies.get(this.cookieName)?.value
    if (token) return token

    // Authorization 헤더에서 토큰 확인
    const authHeader = req.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    return null
  }

  /**
   * 응답에 토큰 쿠키 설정
   * @param res Next.js 응답 객체
   * @param token JWT 토큰
   * @returns 업데이트된 응답 객체
   */
  setTokenCookie(res: NextResponse, token: string): NextResponse {
    res.cookies.set({
      name: this.cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1일
    })

    return res
  }

  /**
   * 응답에서 토큰 쿠키 삭제
   * @param res Next.js 응답 객체
   * @returns 업데이트된 응답 객체
   */
  clearTokenCookie(res: NextResponse): NextResponse {
    res.cookies.delete(this.cookieName)
    return res
  }

  /**
   * 현재 인증된 사용자 정보 조회
   * @returns 사용자 정보 또는 null
   */
  async getCurrentUser(): Promise<UserInfo | null> {
    const token = this.getTokenFromCookies()
    if (!token) return null

    const payload = await this.verifyToken(token)
    if (!payload) return null

    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    }
  }

  /**
   * 사용자 로그인 및 토큰 생성
   * @param user 사용자 정보
   * @returns JWT 토큰
   */
  async login(user: UserInfo): Promise<string> {
    try {
      console.log("로그인 시도:", { userId: user.id, email: user.email });
      
      // JWT 토큰 생성
      const token = await this.createToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      console.log("토큰 생성 성공");
      return token;
    } catch (error) {
      console.error("로그인/토큰 생성 오류:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
export const authService = new AuthService()

