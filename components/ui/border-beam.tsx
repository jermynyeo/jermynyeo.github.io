"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  style?: CSSProperties
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
  /** Corner radius of the path the beam travels (defaults to `size`). */
  pathRadius?: number
}

/**
 * Magic UI BorderBeam adapted for Tailwind v3 / framer-motion.
 * A single light bead travels around the border of the parent
 * (parent must be `position: relative` with `overflow: hidden`).
 */
export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#4ade80",
  colorTo = "rgba(74, 222, 128, 0)",
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  pathRadius,
}: BorderBeamProps) => {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        border: `${borderWidth}px solid transparent`,
        WebkitMask:
          "linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000) border-box",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${pathRadius ?? size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          ...style,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
        }}
      />
    </div>
  )
}
