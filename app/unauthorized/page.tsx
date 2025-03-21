import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-4xl font-bold">접근 권한이 없습니다</h1>
      <p className="text-lg text-muted-foreground">이 페이지에 접근할 수 있는 권한이 없습니다.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">대시보드로 이동</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 이동</Link>
        </Button>
      </div>
    </div>
  )
}

