import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

interface NaverProfile extends Record<string, any> {
  resultcode: string
  message: string
  response: {
    id: string
    nickname?: string
    name?: string
    email?: string
    gender?: string
    age?: string
    birthday?: string
    profile_image?: string
    birthyear?: string
    mobile?: string
  }
}

export function NaverProvider<P extends NaverProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: {
      url: "https://nid.naver.com/oauth2.0/authorize",
      params: { response_type: "code" },
    },
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: {
      url: "https://openapi.naver.com/v1/nid/me",
      async request({ tokens, provider }) {
        const res = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
        return await res.json()
      },
    },
    profile(profile) {
      return {
        id: profile.response.id,
        name: profile.response.name || profile.response.nickname,
        email: profile.response.email,
        image: profile.response.profile_image,
      }
    },
    options,
  }
}

