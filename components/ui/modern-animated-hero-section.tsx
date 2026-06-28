"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { hero } from "@/content/hero"
import { theme } from "@/content/theme"

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

const ALL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = "!<>-_\\/[]{}—=+*^?#"
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ""
    let complete = 0

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }

    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

export const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = hero.phrases

      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000)
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()
    }
  }, [mounted])

  return (
    <h1
      ref={elementRef}
      className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-center px-4 whitespace-nowrap"
      style={{ fontFamily: "monospace" }}
    >
      {hero.heading}
    </h1>
  )
}

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
      const numActive = Math.floor(Math.random() * 3) + 3
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
            className={`absolute text-xs transition-colors duration-100 ${
              isActive
                ? "text-[#00ff00] text-base scale-125 z-10 font-bold animate-pulse"
                : "text-slate-600 font-light"
            }`}
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              transform: `translate(-50%, -50%) ${
                isActive ? "scale(1.25)" : "scale(1)"
              }`,
              textShadow: isActive
                ? "0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)"
                : "none",
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

      <style jsx global>{`
        .dud {
          color: #0f0;
          opacity: 0.7;
        }
      `}</style>
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

/**
 * Legacy combined export (rain + centered title) kept for back-compat.
 * Prefer `<RainingLettersBg />` + `<ScrambledTitle />` for new layouts.
 */
const RainingLetters: React.FC = () => {
  const { characters, activeIndices } = useRainingCharacters(300)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <ScrambledTitle />
      </div>
      <RainingChars characters={characters} activeIndices={activeIndices} />
    </div>
  )
}

export default RainingLetters
