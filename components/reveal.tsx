"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section" | "article" | "li"
  id?: string
}

export default function Reveal({
  children,
  delay = 0,
  y = 24,
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
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
