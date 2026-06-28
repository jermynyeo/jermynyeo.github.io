"use client"

import { HyperText } from "@/components/ui/hyper-text"
import { theme } from "@/content/theme"

interface SectionTitleProps {
  children: string
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="section__title">
      <HyperText
        as="span"
        className="ul-draw"
        startOnView
        animateOnHover
        duration={theme.hyperText.duration}
      >
        {children}
      </HyperText>
    </h2>
  )
}
