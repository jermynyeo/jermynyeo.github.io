"use client"

import { theme } from "@/content/theme"
import { wireWorld as content } from "@/content/wire-world"
import { useActiveSection } from "@/lib/use-active-section"

/**
 * Bottom-left HUD narrating the wire-world journey:
 * `● bit #4a2f · scanning: experience`, flipping to `query resolved ✓`
 * at the final section. Hidden until the visitor scrolls past the hero.
 * The bit id derives from the theme seed — deterministic, hydration-safe.
 */
function bitId(seed: number): string {
  // One LCG step over the seed → stable 4-hex-digit id.
  const n = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 16) & 0xffff
  return n.toString(16).padStart(4, "0")
}

export function BitHud() {
  const active = useActiveSection(content.sectionIds)
  if (!theme.wireWorld.hudEnabled || !active) return null

  const status =
    active === content.hud.resolvedAt
      ? content.hud.resolved
      : content.hud.scanning(active)

  return (
    <div className="bit-hud" aria-hidden>
      <span className="bit-hud__dot">{content.hud.bitPrefix}</span>{" "}
      #{bitId(theme.wireWorld.seed)} · {status}
    </div>
  )
}
