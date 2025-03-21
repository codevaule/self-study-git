import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/dashboard"

export const metadata: Metadata = {
  title: "관리자 대시보드 | Study Helper",
  description: "시스템 통계 및 사용자 관리를 위한 관리자 대시보드",
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}

