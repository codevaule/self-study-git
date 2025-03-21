"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"

interface Payment {
  id: string
  userId: string
  userName: string
  amount: number
  method: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPayments()
  }, [filter, search, page])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payments?filter=${filter}&search=${search}&page=${page}`)

      if (!response.ok) {
        throw new Error("결제 내역을 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setPayments(data.payments)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("결제 내역 조회 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">완료</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">대기중</Badge>
      case "failed":
        return <Badge className="bg-red-500">실패</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 내역</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="사용자 이름 또는 ID 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">로딩 중...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>결제 방법</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      결제 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.id.substring(0, 8)}...</TableCell>
                      <TableCell>{payment.userName}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          상세 보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <div>
                {page > 1 && (
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)}>
                    이전
                  </Button>
                )}
              </div>
              <div>
                페이지 {page} / {totalPages}
              </div>
              <div>
                {page < totalPages && (
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
                    다음
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

