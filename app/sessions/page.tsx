"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Plus, Trash2, Grid } from 'lucide-react'
import { getAllStudySessions, deleteStudySession } from "@/lib/study-session"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllStudySessions()
        setSessions(allSessions)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("이 학습 세션을 삭제하시겠습니까?")) {
      try {
        await deleteStudySession(sessionId)
        setSessions(sessions.filter((session) => session.id !== sessionId))
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">학습 세션 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">내 학습 세션</h1>
        <Button asChild>
          <Link href="/upload" className="gap-2">
            <Plus className="h-4 w-4" />새 세션
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">아직 학습 세션이 없습니다</h3>
            <p className="text-muted-foreground mb-6">연습 문제를 만들기 위해 문서를 업로드하세요</p>
            <Button asChild>
              <Link href="/upload">첫 번째 세션 만들기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{session.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(session.timestamp).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {session.questionHistory && (
                    <div className="text-sm">
                      <span className="font-medium">진행 상황: </span>
                      {Object.keys(session.questionHistory).length}개 문제 답변됨
                    </div>
                  )}
                  {session.lastQuestionIndex !== undefined && (
                    <div className="text-sm">
                      <span className="font-medium">마지막 위치: </span>
                      문제 {session.lastQuestionIndex + 1}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="icon" onClick={() => handleDeleteSession(session.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">삭제</span>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/crossword/${session.id}`} className="gap-1">
                      <Grid className="h-4 w-4" />
                      크로스워드
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/question-type/${session.id}`}>계속하기</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

