"use client"

import type React from "react"

import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/styles/ui-improvements"

interface UIButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gradient"
    | "glass"
    | "premium"
    | "soft"
  size?: "default" | "sm" | "lg" | "icon"
  animation?: "none" | "pulse" | "bounce"
  shadow?: "none" | "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

const UIButton = forwardRef<HTMLButtonElement, UIButtonProps>(
  (
    { variant = "default", size = "default", animation = "none", shadow = "none", className, children, ...props },
    ref,
  ) => {
    return (
      <Button ref={ref} className={cn(buttonVariants({ variant, size, animation, shadow }), className)} {...props}>
        {children}
      </Button>
    )
  },
)
UIButton.displayName = "UIButton"

export { UIButton }

