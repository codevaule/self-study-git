export interface User {
  id: string
  name: string
  email: string
  image: string | null
  provider: "google" | "github" | "facebook" | "kakao" | "naver" | "credentials"
  createdAt: string
  updatedAt: string
  role?: string
}

