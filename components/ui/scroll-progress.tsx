"use client"

import { motion, useScroll, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollProgressProps {
  className?: string
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      className={cn(
        "scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#4ade80] via-[#bbf7d0] to-[#4ade80]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
        boxShadow: "0 0 10px rgba(74, 222, 128, 0.45)",
      }}
    />
  )
}
