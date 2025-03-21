import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded">
        홈으로 돌아가기
      </Link>
    </div>
  )
} 