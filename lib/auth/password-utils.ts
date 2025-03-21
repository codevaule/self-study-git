import { hash, compare } from "bcryptjs"

/**
 * 비밀번호 해싱
 * @param password 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return hash(password, saltRounds)
}

/**
 * 비밀번호 검증
 * @param password 평문 비밀번호
 * @param hashedPassword 해시된 비밀번호
 * @returns 일치 여부
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

