"use client"

import { useState } from "react"
import { QuestionForm } from "@/components/question-generator/question-form"
import { QuestionDisplay } from "@/components/question-generator/question-display"
import type { GeneratedQuestion } from "@/lib/question-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileText, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function QuestionGeneratorPage() {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("form")
  const [useAI, setUseAI] = useState(false)

  const handleSubmit = async (title: string, content: string, options: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          options,
          useAI,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions")
      }

      if (data.questions.length === 0) {
        throw new Error("No questions could be generated from the provided content")
      }

      setQuestions(data.questions)
      setActiveTab("questions")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setActiveTab("form")
  }

  const handleTestData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/questions/test")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load test data")
      }

      setQuestions(data.questions)
      setActiveTab("questions")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Question Generator</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="form">Create Questions</TabsTrigger>
          {questions.length > 0 && <TabsTrigger value="questions">View Questions</TabsTrigger>}
        </TabsList>

        <TabsContent value="form">
          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-md">
                <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
                <Label htmlFor="use-ai" className="flex items-center cursor-pointer">
                  <Zap className={`mr-2 h-4 w-4 ${useAI ? "text-yellow-500" : "text-gray-400"}`} />
                  Use AI for better questions
                  {useAI && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      Requires API Key
                    </span>
                  )}
                </Label>
              </div>

              <QuestionForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Enter your document content to generate questions, or use our sample data to see how it works.</p>
                <Button variant="secondary" onClick={handleTestData} disabled={isLoading} className="w-full">
                  Load Sample Data
                </Button>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>Tips:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use headings (# Title) to organize your content</li>
                    <li>Include definitions and key concepts</li>
                    <li>Longer, more detailed content produces better questions</li>
                    {useAI && (
                      <li className="text-yellow-700">AI mode creates more natural questions but may take longer</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          {questions.length > 0 && <QuestionDisplay questions={questions} onReset={handleReset} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

