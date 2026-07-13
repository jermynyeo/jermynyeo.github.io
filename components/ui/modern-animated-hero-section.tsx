"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { theme } from "@/content/theme"
import { eggs } from "@/content/eggs"

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

const ALL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

function useRainingCharacters(count: number) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  // Konami-code surge: while `Date.now() < surgeUntil.current` the flicker
  // lights more chars and the tick advances faster. Constants only — no new
  // per-frame work or allocations.
  const surgeUntil = useRef(0)

  useEffect(() => {
    const onSurge = () => {
      surgeUntil.current = Date.now() + theme.rain.surge.durationMs
    }
    window.addEventListener(eggs.surgeEvent, onSurge)
    return () => window.removeEventListener(eggs.surgeEvent, onSurge)
  }, [])

  const createCharacters = useCallback(() => {
    const newCharacters: Character[] = []
    for (let i = 0; i < count; i++) {
      newCharacters.push({
        char: ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      })
    }
    return newCharacters
  }, [count])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  useEffect(() => {
    if (!characters.length) return
    const flicker = setInterval(() => {
      const surging = Date.now() < surgeUntil.current
      const newActive = new Set<number>()
      const numActive = surging
        ? theme.rain.surge.activeCount
        : Math.floor(Math.random() * 2) + 1
      for (let i = 0; i < numActive; i++) {
        newActive.add(Math.floor(Math.random() * characters.length))
      }
      setActiveIndices(newActive)
    }, 50)
    return () => clearInterval(flicker)
  }, [characters.length])

  useEffect(() => {
    let raf: number
    const tick = () => {
      const speedFactor =
        Date.now() < surgeUntil.current ? theme.rain.surge.speedMultiplier : 1
      setCharacters((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y + c.speed * speedFactor,
          ...(c.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
          }),
        }))
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { characters, activeIndices }
}

/** True on small (coarse-pointer) screens, where the rain is too dense. */
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)")
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return mobile
}

function RainingChars({
  characters,
  activeIndices,
  fontSize,
}: {
  characters: Character[]
  activeIndices: Set<number>
  fontSize: string
}) {
  return (
    <>
      {characters.map((char, index) => {
        const isActive = activeIndices.has(index)
        return (
          <span
            key={index}
            className="absolute"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              color: isActive ? theme.rain.activeColor : theme.rain.idleColor,
              fontWeight: isActive ? 700 : 300,
              transform: `translate(-50%, -50%) ${
                isActive ? "scale(1.25)" : "scale(1)"
              }`,
              textShadow: isActive ? theme.rain.activeGlow : "none",
              opacity: isActive ? 1 : 0.4,
              transition: "color 0.1s, transform 0.1s, text-shadow 0.1s",
              willChange: "transform, top",
              fontSize,
            }}
          >
            {char.char}
          </span>
        )
      })}
    </>
  )
}

/**
 * Fixed full-viewport raining-letters background that fades as the user
 * scrolls down. Mount once near the top of the page.
 */
export const RainingLettersBg: React.FC = () => {
  const mobile = useIsMobile()
  // On phones the rain is too dense and distracting: fewer, smaller, dimmer.
  const count = mobile
    ? Math.round(theme.rain.charCount * 0.4)
    : theme.rain.charCount
  const fontSize = mobile ? "1.05rem" : "1.8rem"
  const dim = mobile ? 0.5 : 1

  const { characters, activeIndices } = useRainingCharacters(count)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(
    scrollYProgress,
    [...theme.rain.opacityCurve.progress],
    theme.rain.opacityCurve.opacity.map((o) => o * dim)
  )

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <RainingChars
        characters={characters}
        activeIndices={activeIndices}
        fontSize={fontSize}
      />
    </motion.div>
  )
}
