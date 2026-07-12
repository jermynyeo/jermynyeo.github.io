"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll } from "framer-motion"

/**
 * Scroll-drawn career-path line for the Experience timeline. Overlays the
 * faint base track (the items' `border-left`) with a mint gradient that
 * draws itself from the first dot to the last as the visitor scrolls.
 *
 * Rendered as the first `<li>` of the `.timeline` list (aria-hidden,
 * pointer-events none). Positions are measured from the actual dots and
 * re-measured via ResizeObserver — role expand/collapse changes heights.
 * Transform-only animation (scaleY), so no layout work per frame.
 */
export function TimelineSpine() {
  const ref = useRef<HTMLLIElement>(null)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // Start drawing as the list enters the lower quarter of the viewport,
    // finish as its end passes the upper third.
    offset: ["start 0.75", "end 0.35"],
  })

  useEffect(() => {
    const list = ref.current?.parentElement
    if (!list) return
    const measure = () => {
      const dots = list.querySelectorAll<HTMLElement>(".timeline__dot")
      if (dots.length === 0) return
      const listRect = list.getBoundingClientRect()
      const first = dots[0].getBoundingClientRect()
      const last = dots[dots.length - 1].getBoundingClientRect()
      // Anchor the line to the dot centers (centers are stable even while
      // a dot is mid pulse-scale).
      const top = first.top - listRect.top + first.height / 2
      const bottom = last.top - listRect.top + last.height / 2
      setBox({ top, height: Math.max(bottom - top, 0) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [])

  return (
    <li ref={ref} className="timeline__spine" aria-hidden>
      {box && (
        <motion.div
          className="timeline__spine-fill"
          style={{
            top: box.top,
            height: box.height,
            scaleY: reduce ? 1 : scrollYProgress,
          }}
        />
      )}
    </li>
  )
}
