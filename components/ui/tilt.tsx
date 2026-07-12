"use client"

import type { ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { theme } from "@/content/theme"

/**
 * Pointer-tracking 3D tilt (same tracking idea as MagicCard, but mapped to
 * rotateX/rotateY). Mouse-only, springs back on leave, disabled under
 * reduced motion. Knobs in `theme.tilt`.
 */
export function Tilt({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 250, damping: 18 })
  const sry = useSpring(ry, { stiffness: 250, damping: 18 })

  if (reduce) return <div className={className}>{children}</div>

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    // Pointer position normalized to -0.5 … 0.5 from the card center.
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(-ny * theme.tilt.maxDeg * 2)
    ry.set(nx * theme.tilt.maxDeg * 2)
  }

  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 600 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
