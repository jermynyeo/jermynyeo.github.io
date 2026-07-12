"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  /**
   * Horizontal entrance offset in px. Sections use a small negative value so
   * content drifts in from the left, the side the wire-world "bit" travels,
   * making it read as the bit delivering the section. Default 0 (pure fade-up).
   */
  x?: number
  className?: string
  as?: "div" | "section" | "article" | "li"
  id?: string
}

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  className,
  as = "div",
  id,
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
