"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { theme } from "@/content/theme"

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
      const newActive = new Set<number>()
      const numActive = Math.floor(Math.random() * 2) + 1
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
      setCharacters((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y + c.speed,
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

function RainingChars({
  characters,
  activeIndices,
}: {
  characters: Character[]
  activeIndices: Set<number>
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
              fontSize: "1.8rem",
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
  const { characters, activeIndices } = useRainingCharacters(
    theme.rain.charCount
  )
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(
    scrollYProgress,
    [...theme.rain.opacityCurve.progress],
    [...theme.rain.opacityCurve.opacity]
  )

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <RainingChars characters={characters} activeIndices={activeIndices} />
    </motion.div>
  )
}
