"use client"

import type React from "react"

import { forwardRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cardVariants } from "@/styles/ui-improvements"

interface UICardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  variant?: "default" | "glass" | "outline" | "premium"
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "premium" | "glow"
  hover?: "none" | "raise" | "glow" | "scale"
  className?: string
  children: React.ReactNode
}

const UICard = forwardRef<HTMLDivElement, UICardProps>(
  ({ variant = "default", shadow = "md", hover = "none", className, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn(cardVariants({ variant, shadow, hover }), className)} {...props}>
        {children}
      </Card>
    )
  },
)
UICard.displayName = "UICard"

// 타입 확장을 위한 컴포넌트 정의
const UICardHeader = forwardRef<React.ElementRef<typeof CardHeader>, React.ComponentPropsWithoutRef<typeof CardHeader>>(
  ({ className, ...props }, ref) => <CardHeader ref={ref} className={cn("", className)} {...props} />,
)
UICardHeader.displayName = "UICardHeader"

const UICardTitle = forwardRef<React.ElementRef<typeof CardTitle>, React.ComponentPropsWithoutRef<typeof CardTitle>>(
  ({ className, ...props }, ref) => <CardTitle ref={ref} className={cn("", className)} {...props} />,
)
UICardTitle.displayName = "UICardTitle"

const UICardDescription = forwardRef<
  React.ElementRef<typeof CardDescription>,
  React.ComponentPropsWithoutRef<typeof CardDescription>
>(({ className, ...props }, ref) => <CardDescription ref={ref} className={cn("", className)} {...props} />)
UICardDescription.displayName = "UICardDescription"

const UICardContent = forwardRef<
  React.ElementRef<typeof CardContent>,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => <CardContent ref={ref} className={cn("", className)} {...props} />)
UICardContent.displayName = "UICardContent"

const UICardFooter = forwardRef<React.ElementRef<typeof CardFooter>, React.ComponentPropsWithoutRef<typeof CardFooter>>(
  ({ className, ...props }, ref) => <CardFooter ref={ref} className={cn("", className)} {...props} />,
)
UICardFooter.displayName = "UICardFooter"

export { UICard, UICardHeader, UICardTitle, UICardDescription, UICardContent, UICardFooter }

