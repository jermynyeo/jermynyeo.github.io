"use client"

export function PaletteTrigger() {
  return (
    <button
      type="button"
      className="palette-trigger"
      aria-label="Open command palette"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
    >
      ⌘K
    </button>
  )
}
