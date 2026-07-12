import { useEffect, useRef } from "react"

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

/**
 * Fires `onTrigger` when the Konami code (↑↑↓↓←→←→BA) is typed anywhere on
 * the page. Keystrokes inside inputs/textareas/contenteditable are ignored so
 * it never fights the hero terminal's arrow-key history.
 */
export function useKonami(onTrigger: () => void) {
  const progress = useRef(0)
  const cb = useRef(onTrigger)
  cb.current = onTrigger

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        progress.current = 0
        return
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === SEQUENCE[progress.current]) {
        progress.current++
        if (progress.current === SEQUENCE.length) {
          progress.current = 0
          cb.current()
        }
      } else {
        // A stray ↑ can still start a fresh attempt.
        progress.current = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}
