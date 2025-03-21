"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { QuestionType } from "@/lib/question-generator"
import { Loader2 } from "lucide-react"

interface QuestionFormProps {
  onSubmit: (title: string, content: string, options: any) => Promise<void>
  isLoading: boolean
}

export function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [questionCount, setQuestionCount] = useState(10)
  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([0.3, 0.8])
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    "multiple-choice",
    "fill-in-blank",
    "true-false",
    "short-answer",
  ])

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "fill-in-blank", label: "Fill in the Blank" },
    { value: "true-false", label: "True/False" },
    { value: "short-answer", label: "Short Answer" },
  ]

  const handleTypeToggle = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      // Don't allow deselecting the last type
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type))
      }
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const options = {
      questionTypes: selectedTypes,
      difficultyRange,
      count: questionCount,
    }

    await onSubmit(title, content, options)
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Document Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your document content here..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Question Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {questionTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                  />
                  <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="question-count">Number of Questions: {questionCount}</Label>
            </div>
            <Slider
              id="question-count"
              min={1}
              max={30}
              step={1}
              value={[questionCount]}
              onValueChange={(value) => setQuestionCount(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>
                Difficulty Range: {Math.round(difficultyRange[0] * 100)}% - {Math.round(difficultyRange[1] * 100)}%
              </Label>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={difficultyRange}
              onValueChange={(value) => setDifficultyRange([value[0], value[1]])}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Questions"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

