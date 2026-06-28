"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { theme } from "@/content/theme"

/**
 * Ambient flickering-pixel grid placed behind a section's content.
 * Parent section must have `position: relative; isolation: isolate;`
 * and a `.section-backdrop` rule that sets `inset:0; z-index:0;`.
 *
 * Tune density/opacity/color in `content/theme.ts`.
 */
export function SectionBackdrop() {
  const cfg = theme.flickerGrid
  return (
    <div className="section-backdrop" aria-hidden>
      <FlickeringGrid
        color={cfg.color}
        maxOpacity={cfg.maxOpacity}
        flickerChance={cfg.flickerChance}
        squareSize={cfg.squareSize}
        gridGap={cfg.gridGap}
      />
    </div>
  )
}
