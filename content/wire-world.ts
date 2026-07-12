import { nav } from "./nav"

/**
 * Wire-world copy — the "data warehouse" circuit layer below the hero.
 * The visitor is a bit of data flowing through the wires; junction ports
 * label each section and the HUD narrates the journey.
 *
 * Section order derives from `nav` (same trick as content/commands.ts),
 * so adding/reordering nav sections re-routes the wires automatically.
 */
export const wireWorld = {
  /** Section ids the wires connect, in page order. */
  sectionIds: nav
    .filter((entry) => entry.href.startsWith("#"))
    .map((entry) => entry.href.slice(1)),

  /** Label rendered beside each junction port (desktop gutters only). */
  portLabel: (id: string) => `▸ node://${id}`,

  /** Bottom-left HUD strings. */
  hud: {
    bitPrefix: "● bit",
    scanning: (id: string) => `scanning: ${id}`,
    resolved: "query resolved ✓",
    /** The HUD flips to `resolved` when this section is active. */
    resolvedAt: "contact",
  },
}
