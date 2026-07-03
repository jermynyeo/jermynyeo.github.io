import { nav } from "./nav"
import { site } from "./site"

/**
 * Command palette (⌘K) actions. Section jumps derive from `nav`;
 * the rest are one-off actions. Add entries here to extend the palette.
 */

export interface CommandAction {
  type: "scroll" | "copy" | "href" | "route"
  value: string
}

export interface Command {
  id: string
  label: string
  hint?: string
  group: string
  action: CommandAction
}

export const commands: Command[] = [
  ...nav
    .filter((entry) => entry.href.startsWith("#"))
    .map(
      (entry): Command => ({
        id: `goto-${entry.label}`,
        label: `go to ${entry.label}`,
        hint: entry.href,
        group: "navigate",
        action: { type: "scroll", value: entry.href },
      })
    ),
  {
    id: "open-resume",
    label: "open resume",
    hint: "/resume",
    group: "actions",
    action: { type: "route", value: "/resume" },
  },
  {
    id: "copy-email",
    label: "copy email",
    hint: site.email,
    group: "actions",
    action: { type: "copy", value: site.email },
  },
  {
    id: "open-github",
    label: "open github",
    hint: "github.com/jermynyeo",
    group: "links",
    action: { type: "href", value: site.sameAs[1] },
  },
  {
    id: "open-linkedin",
    label: "open linkedin",
    hint: "linkedin.com/in/jywh",
    group: "links",
    action: { type: "href", value: site.sameAs[0] },
  },
]
