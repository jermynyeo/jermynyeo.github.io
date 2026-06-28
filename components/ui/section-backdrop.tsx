"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"

/**
 * Ambient flickering-pixel grid placed behind a section's content.
 * Parent section must have `position: relative; isolation: isolate;`
 * and a `.section-backdrop` rule that sets `inset:0; z-index:0;`.
 */
export function SectionBackdrop() {
  return (
    <div className="section-backdrop" aria-hidden>
      <FlickeringGrid
        color="rgb(0, 255, 0)"
        maxOpacity={0.08}
        flickerChance={0.12}
        squareSize={3}
        gridGap={6}
      />
    </div>
  )
}
