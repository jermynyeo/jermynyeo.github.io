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
        "fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#00ff00] via-[#7CFC8A] to-[#00ff00]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
        boxShadow: "0 0 10px rgba(0, 255, 0, 0.55)",
      }}
    />
  )
}
