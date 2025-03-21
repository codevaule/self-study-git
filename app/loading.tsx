export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-24">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">로드 중...</p>
    </div>
  )
} 