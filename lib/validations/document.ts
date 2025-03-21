import { z } from "zod"

// 문서 스키마
export const documentSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수입니다" }).max(100, { message: "제목은 100자 이내로 작성해주세요" }),
  content: z.string().min(1, { message: "내용은 필수입니다" }),
  userId: z.string().optional(),
})

// 문서 수정 스키마
export const documentUpdateSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수입니다" }).max(100, { message: "제목은 100자 이내로 작성해주세요" }).optional(),
  content: z.string().min(1, { message: "내용은 필수입니다" }).optional(),
})

// 문서 검색 스키마
export const documentSearchSchema = z.object({
  query: z.string().min(1, { message: "검색어를 입력해주세요" }).max(100, { message: "검색어는 100자 이내로 작성해주세요" }),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
}) 