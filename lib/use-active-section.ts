import { useEffect, useState } from "react"

/**
 * Tracks which section currently crosses the viewport's center line.
 * The rootMargin shrinks the observation area to a thin band mid-viewport,
 * so exactly one section is "active" at a time. Returns null until the
 * first section reaches the center (e.g. while the hero is on screen).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")])

  return active
}
