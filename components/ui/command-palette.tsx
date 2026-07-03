"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { commands, type Command } from "@/content/commands"

const OPEN_EVENT = "open-command-palette"

/**
 * Hand-rolled terminal-style command palette. Opens on ⌘K / Ctrl+K or the
 * `open-command-palette` window event (see PaletteTrigger). Renders nothing
 * until opened.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    setIndex(0)
  }, [query, open])

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setCopiedId(null)
    restoreFocusRef.current?.focus?.()
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        restoreFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
      }
      return !prev
    })
    setQuery("")
    setCopiedId(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        toggle()
      }
    }
    const onOpenEvent = () => toggle()
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_EVENT, onOpenEvent)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_EVENT, onOpenEvent)
    }
  }, [toggle])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const run = useCallback(
    (cmd: Command) => {
      switch (cmd.action.type) {
        case "scroll": {
          const target = document.querySelector(cmd.action.value)
          close()
          if (target) {
            target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
          } else {
            // Not on the main page (e.g. /resume) — go home to the section.
            window.location.assign(`/${cmd.action.value}`)
          }
          break
        }
        case "copy": {
          navigator.clipboard?.writeText(cmd.action.value)
          setCopiedId(cmd.id)
          window.setTimeout(() => close(), 900)
          break
        }
        case "href": {
          window.open(cmd.action.value, "_blank", "noopener")
          close()
          break
        }
        case "route": {
          close()
          window.location.assign(cmd.action.value)
          break
        }
      }
    },
    [close, reduce]
  )

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault()
        close()
        break
      case "ArrowDown":
        e.preventDefault()
        setIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setIndex((i) => Math.max(i - 1, 0))
        break
      case "Home":
        e.preventDefault()
        setIndex(0)
        break
      case "End":
        e.preventDefault()
        setIndex(filtered.length - 1)
        break
      case "Enter":
        e.preventDefault()
        if (filtered[index]) run(filtered[index])
        break
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            className="palette"
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="palette__input-row">
              <span className="palette__prompt" aria-hidden>
                &gt;
              </span>
              <input
                ref={inputRef}
                className="palette__input"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={
                  filtered[index] ? `palette-opt-${filtered[index].id}` : undefined
                }
                aria-label="Type a command"
                placeholder="type a command…"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
              />
              <kbd className="palette__esc" onClick={close}>
                esc
              </kbd>
            </div>
            <ul id="palette-list" role="listbox" className="palette__list">
              {filtered.length === 0 && (
                <li className="palette__empty" aria-live="polite">
                  no matching commands
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li
                  key={cmd.id}
                  id={`palette-opt-${cmd.id}`}
                  role="option"
                  aria-selected={i === index}
                  className="palette__item"
                  data-selected={i === index || undefined}
                  onMouseEnter={() => setIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => run(cmd)}
                >
                  <span className="palette__marker" aria-hidden>
                    {i === index ? ">" : " "}
                  </span>
                  <span className="palette__label">
                    {copiedId === cmd.id ? "copied ✓" : cmd.label}
                  </span>
                  {cmd.hint && (
                    <span className="palette__hint">{cmd.hint}</span>
                  )}
                  <span className="palette__group">{cmd.group}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
