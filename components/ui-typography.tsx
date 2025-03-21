"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { typography } from "@/styles/ui-improvements"

interface UIHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4
  gradient?: boolean
  className?: string
  children: React.ReactNode
}

const UIHeading = forwardRef<HTMLHeadingElement, UIHeadingProps>(
  ({ level = 1, gradient = false, className, children, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements
    const typographyClass = typography[`h${level}` as keyof typeof typography]

    return (
      <Component ref={ref} className={cn(typographyClass, gradient && typography.gradient, className)} {...props}>
        {children}
      </Component>
    )
  },
)
UIHeading.displayName = "UIHeading"

interface UITextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "lead" | "large" | "small" | "muted" | "gradient"
  className?: string
  children: React.ReactNode
}

const UIText = forwardRef<HTMLParagraphElement, UITextProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    const typographyClass = variant === "default" ? typography.p : typography[variant as keyof typeof typography]

    return (
      <p ref={ref} className={cn(typographyClass, className)} {...props}>
        {children}
      </p>
    )
  },
)
UIText.displayName = "UIText"

export { UIHeading, UIText }

