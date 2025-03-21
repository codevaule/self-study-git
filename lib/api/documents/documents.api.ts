export interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

// 문서 목록 조회
export async function getDocuments(userId: string): Promise<Document[]> {
  // 임시 데이터 반환 (실제로는 데이터베이스 연동 필요)
  return [
    {
      id: '1',
      title: '샘플 문서',
      content: '이것은 샘플 문서입니다.',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    },
  ]
}

// 문서 상세 조회
export async function getDocument(id: string): Promise<Document | null> {
  // 임시 데이터 반환 (실제로는 데이터베이스 연동 필요)
  return {
    id,
    title: '샘플 문서',
    content: '이것은 샘플 문서입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  }
}

// 문서 생성
export async function createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
  // 임시 데이터 반환 (실제로는 데이터베이스 연동 필요)
  return {
    ...document,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// 문서 수정
export async function updateDocument(id: string, document: Partial<Document>): Promise<Document | null> {
  // 임시 데이터 반환 (실제로는 데이터베이스 연동 필요)
  return {
    id,
    title: document.title || '샘플 문서',
    content: document.content || '이것은 샘플 문서입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: document.userId || '1',
  }
}

// 문서 삭제
export async function deleteDocument(id: string): Promise<boolean> {
  // 임시 데이터 반환 (실제로는 데이터베이스 연동 필요)
  return true
} 