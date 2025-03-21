"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createFeedbackService } from "@/lib/question-generator/feedback"
import { Star } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FeedbackFormProps {
  questionId: string
  onFeedbackSubmitted?: () => void
}

export function FeedbackForm({ questionId, onFeedbackSubmitted }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [hoverRating, setHoverRating] = useState<number>(0)

  const feedbackService = createFeedbackService()

  const handleRatingClick = (newRating: number) => {
    setRating(newRating)
  }

  const handleRatingHover = (newRating: number) => {
    setHoverRating(newRating)
  }

  const handleRatingLeave = () => {
    setHoverRating(0)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting feedback.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await feedbackService.submitFeedback(questionId, rating, comment)

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
        variant: "default",
      })

      // Reset form
      setRating(0)
      setComment("")

      // Notify parent component
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted()
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-slate-50">
      <h3 className="font-medium">Rate this question</h3>

      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => handleRatingHover(star)}
            onMouseLeave={handleRatingLeave}
            className="text-2xl focus:outline-none"
          >
            {(hoverRating || rating) >= star ? (
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-6 h-6 text-gray-300" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "Click to rate"}
        </span>
      </div>

      <div>
        <Textarea
          placeholder="Additional comments (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  )
}

