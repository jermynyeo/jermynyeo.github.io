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
 * Magnetic hover: the wrapped element leans a few pixels toward the cursor
 * and springs back on leave. Mouse-only (no effect on touch), disabled under
 * reduced motion. Knobs in `theme.magnetic`.
 */
export function Magnetic({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  if (reduce) return <>{children}</>

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    const { strength, maxPx } = theme.magnetic
    x.set(Math.max(-maxPx, Math.min(maxPx, relX * strength)))
    y.set(Math.max(-maxPx, Math.min(maxPx, relY * strength)))
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
