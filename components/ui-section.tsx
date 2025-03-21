"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { layouts, spacing } from "@/styles/ui-improvements"

interface UISectionProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
  children: React.ReactNode
}

const UISection = forwardRef<HTMLDivElement, UISectionProps>(
  ({ container = true, size = "default", className, children, ...props }, ref) => {
    const sectionSpacing = size === "sm" ? spacing.sectionSm : size === "lg" ? spacing.sectionLg : spacing.section

    return (
      <section ref={ref} className={cn(sectionSpacing, className)} {...props}>
        {container ? <div className={layouts.container}>{children}</div> : children}
      </section>
    )
  },
)
UISection.displayName = "UISection"

export { UISection }

