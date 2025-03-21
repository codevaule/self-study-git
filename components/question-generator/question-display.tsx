"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { GeneratedQuestion } from "@/lib/question-generator"
import { CheckCircle, XCircle, HelpCircle, MessageSquare } from "lucide-react"
import { FeedbackForm } from "./feedback-form"

interface QuestionDisplayProps {
  questions: GeneratedQuestion[]
  onReset: () => void
}

export function QuestionDisplay({ questions, onReset }: QuestionDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})

  const currentQuestion = questions[currentIndex]

  const handleAnswerChange = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    })
  }

  const handleShowAnswer = () => {
    setShowAnswers({
      ...showAnswers,
      [currentQuestion.id]: true,
    })
  }

  const handleToggleFeedback = () => {
    setShowFeedback({
      ...showFeedback,
      [currentQuestion.id]: !showFeedback[currentQuestion.id],
    })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const isCorrect = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return false

    const userAnswer = userAnswers[questionId]
    if (!userAnswer) return false

    return userAnswer.toLowerCase() === question.answer.toLowerCase()
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    const showAnswer = showAnswers[currentQuestion.id]
    const userAnswer = userAnswers[currentQuestion.id] || ""
    const correct = isCorrect(currentQuestion.id)

    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{currentQuestion.question}</p>

            <RadioGroup value={userAnswer} onValueChange={handleAnswerChange} className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={showAnswer} />
                  <Label
                    htmlFor={`option-${index}`}
                    className={showAnswer && option === currentQuestion.answer ? "font-bold text-green-600" : ""}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showAnswer && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md">
                <p className="font-medium">
                  {correct ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Correct!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="mr-2 h-5 w-5" />
                      Incorrect. The correct answer is: {currentQuestion.answer}
                    </span>
                  )}
                </p>
                {currentQuestion.explanation && <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>}
              </div>
            )}
          </div>
        )

      case "fill-in-blank":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{currentQuestion.question}</p>

            <div className="flex items-center space-x-2">
              <Input
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer..."
                disabled={showAnswer}
                className="max-w-xs"
              />
            </div>

            {showAnswer && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md">
                <p className="font-medium">
                  {correct ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Correct!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="mr-2 h-5 w-5" />
                      Incorrect. The correct answer is: {currentQuestion.answer}
                    </span>
                  )}
                </p>
                {currentQuestion.explanation && <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>}
              </div>
            )}
          </div>
        )

      case "true-false":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{currentQuestion.question}</p>

            <RadioGroup value={userAnswer} onValueChange={handleAnswerChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id="true" disabled={showAnswer} />
                <Label
                  htmlFor="true"
                  className={showAnswer && currentQuestion.answer === "True" ? "font-bold text-green-600" : ""}
                >
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id="false" disabled={showAnswer} />
                <Label
                  htmlFor="false"
                  className={showAnswer && currentQuestion.answer === "False" ? "font-bold text-green-600" : ""}
                >
                  False
                </Label>
              </div>
            </RadioGroup>

            {showAnswer && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md">
                <p className="font-medium">
                  {correct ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Correct!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="mr-2 h-5 w-5" />
                      Incorrect. The correct answer is: {currentQuestion.answer}
                    </span>
                  )}
                </p>
                {currentQuestion.explanation && <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>}
              </div>
            )}
          </div>
        )

      case "short-answer":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{currentQuestion.question}</p>

            <div className="flex items-center space-x-2">
              <Input
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer..."
                disabled={showAnswer}
                className="max-w-xs"
              />
            </div>

            {showAnswer && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md">
                <p className="font-medium">
                  {correct ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Correct!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="mr-2 h-5 w-5" />
                      Incorrect. The correct answer is: {currentQuestion.answer}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-gray-700">
                  Note: Short answer questions may have multiple valid answers. Your answer was compared exactly to the
                  expected answer.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return <p>Unsupported question type</p>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-normal text-gray-500">
            Difficulty: {Math.round(currentQuestion?.difficulty * 100)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderQuestion()}

        {showFeedback[currentQuestion?.id] && (
          <div className="mt-6">
            <FeedbackForm
              questionId={currentQuestion.id}
              onFeedbackSubmitted={() =>
                setShowFeedback({
                  ...showFeedback,
                  [currentQuestion.id]: false,
                })
              }
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </Button>
        </div>
        <div className="space-x-2">
          {!showAnswers[currentQuestion?.id] && (
            <Button variant="secondary" onClick={handleShowAnswer} className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Show Answer
            </Button>
          )}

          <Button variant="outline" onClick={handleToggleFeedback} className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            {showFeedback[currentQuestion?.id] ? "Hide Feedback" : "Give Feedback"}
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={onReset}>Finish</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

