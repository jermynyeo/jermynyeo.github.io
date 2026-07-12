"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useKonami } from "@/lib/use-konami"
import { eggs } from "@/content/eggs"

/**
 * Site-wide easter eggs, mounted once in the root layout:
 *  - Konami code → raining-letters surge (via the `rain-surge` window event,
 *    handled inside RainingLettersBg) + a small toast.
 *  - Devtools console banner with hints for the curious.
 * The third egg (`sudo hire-jermyn`) lives in the hero terminal.
 */
export function EasterEggs() {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef(0)
  const logged = useRef(false)
  const reduce = useReducedMotion()

  // Console banner — once per page load (ref guard survives StrictMode).
  useEffect(() => {
    if (logged.current) return
    logged.current = true
    console.log(
      `%c${eggs.consoleBanner}`,
      "color:#4ade80;font-family:monospace"
    )
    console.log(
      `%c${eggs.consoleHints.join("\n")}`,
      "color:#64748b;font-family:monospace"
    )
  }, [])

  useKonami(() => {
    // Reduced motion: skip the visual surge, keep the reward (toast).
    if (!reduce) window.dispatchEvent(new Event(eggs.surgeEvent))
    setToast(eggs.konamiToast)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  })

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="egg-toast"
          role="status"
          aria-live="polite"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
