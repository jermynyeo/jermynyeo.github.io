"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { terminal, type TermCommand } from "@/content/terminal"

interface Entry {
  kind: "cmd" | "out"
  text: string
}

interface TerminalPlayProps {
  /** Seconds until the live prompt appears (after the CSS intro finishes). */
  startDelay: number
  /** The server-rendered intro lines — kept in static HTML for SEO. */
  children: ReactNode
}

/**
 * Interactive layer of the hero terminal. Renders only the server-rendered
 * intro on first paint (no hydration mismatch); once `startDelay` elapses a
 * live prompt appears. All key handling is scoped to the input — the page's
 * scroll, ⌘K palette, and tab order are untouched while unfocused.
 */
export function TerminalPlay({ startDelay, children }: TerminalPlayProps) {
  const [ready, setReady] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1) // -1 = editing a fresh line
  const unknownCount = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      setReady(true)
      return
    }
    const id = window.setTimeout(() => setReady(true), startDelay * 1000)
    return () => window.clearTimeout(id)
  }, [startDelay, reduce])

  // Keep the newest output in view inside the scrollable body.
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [entries, ready])

  const findCommand = (input: string): TermCommand | undefined => {
    const norm = input.toLowerCase().replace(/\s+/g, " ")
    return terminal.commands.find(
      (c) => c.name === norm || c.aliases?.includes(norm)
    )
  }

  const run = (raw: string) => {
    const input = raw.trim()
    if (!input) return
    setHistory((h) => [...h.slice(-(terminal.historyLimit - 1)), input])
    setHistIndex(-1)
    setValue("")

    const cmd = findCommand(input)
    if (cmd?.action.type === "clear") {
      setCleared(true)
      setEntries([])
      return
    }

    const next: Entry[] = [{ kind: "cmd", text: input }]
    if (!cmd) {
      const msg =
        terminal.unknown[unknownCount.current++ % terminal.unknown.length]
      next.push({ kind: "out", text: msg.replace("{cmd}", input) })
    } else {
      for (const line of cmd.action.lines) {
        next.push({ kind: "out", text: line })
      }
      if (cmd.action.type === "scroll") {
        document
          .querySelector(cmd.action.target)
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
      }
    }
    setEntries((prev) => [...prev, ...next].slice(-terminal.historyLimit))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault()
        run(value)
        break
      case "ArrowUp": {
        e.preventDefault()
        if (history.length === 0) break
        const i =
          histIndex === -1 ? history.length - 1 : Math.max(histIndex - 1, 0)
        setHistIndex(i)
        setValue(history[i])
        break
      }
      case "ArrowDown": {
        e.preventDefault()
        if (histIndex === -1) break
        const i = histIndex + 1
        if (i >= history.length) {
          setHistIndex(-1)
          setValue("")
        } else {
          setHistIndex(i)
          setValue(history[i])
        }
        break
      }
      case "Escape":
        e.currentTarget.blur()
        break
    }
  }

  const focusInput = () => {
    // Don't steal focus while the user is selecting text to copy.
    const sel = window.getSelection()
    if (sel && !sel.isCollapsed) return
    inputRef.current?.focus()
  }

  return (
    <div
      ref={bodyRef}
      className={`term__body${ready ? " term__body--live" : ""}`}
      onClick={ready ? focusInput : undefined}
    >
      {!cleared && children}
      {ready && (
        <>
          <div role="log" aria-live="polite">
            {entries.map((entry, i) =>
              entry.kind === "cmd" ? (
                <p key={i} className="term-line term-line--cmd term-line--live">
                  <span className="term-line__prompt">{terminal.prompt}</span>
                  <span>{entry.text}</span>
                </p>
              ) : (
                <p key={i} className="term-line term-line--live term-line--out">
                  {entry.text}
                </p>
              )
            )}
          </div>
          <p className="term-line term-line--cmd term-line--live term-input-row">
            <span className="term-line__prompt">{terminal.prompt}</span>
            {!focused && !value && (
              <span className="term-idle-caret" aria-hidden>
                ▌
              </span>
            )}
            <input
              ref={inputRef}
              className="term-input"
              type="text"
              aria-label={terminal.inputAriaLabel}
              placeholder={terminal.hint}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setHistIndex(-1)
              }}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </p>
        </>
      )}
    </div>
  )
}
