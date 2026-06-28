"use client"

import React, { useCallback, useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
}

/**
 * Lightweight wrapper that adds a mouse-following spotlight glow.
 * Renders children unchanged so existing card markup (`.about__card`,
 * `.learn-card`, etc.) keeps its border + padding.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 240,
  gradientColor = "rgba(0, 255, 0, 0.18)",
  gradientOpacity = 1,
}: MagicCardProps) {
  const reduce = useReducedMotion()
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const lastRect = useRef<DOMRect | null>(null)

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      lastRect.current = rect
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  if (reduce) {
    return <div className={cn("relative", className)}>{children}</div>
  }

  return (
    <div
      className={cn(
        "group relative isolate rounded-[inherit]",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 70%)`,
          opacity: gradientOpacity,
          mixBlendMode: "plus-lighter",
        }}
      />
    </div>
  )
}
