import { hash, compare } from "bcryptjs"

/**
 * 비밀번호를 해시화합니다.
 * @param password 해시화할 비밀번호
 * @returns 해시화된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

/**
 * 비밀번호가 해시와 일치하는지 확인합니다.
 * @param password 확인할 비밀번호
 * @param hashedPassword 해시화된 비밀번호
 * @returns 비밀번호 일치 여부
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

