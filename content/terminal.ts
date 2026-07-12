import { nav } from "./nav"
import { site } from "./site"
import { stack } from "./stack"

/**
 * Playable hero terminal — the command registry.
 *
 * After the intro finishes typing, visitors can type here. Add commands to
 * `commands[]`; anything derived (nav jumps, whoami, certs) pulls from the
 * other content files so it never goes stale. `hidden: true` keeps a command
 * out of `help` (easter eggs). `{cmd}` in `unknown[]` is replaced with
 * whatever the visitor typed.
 */

/** An output line — plain text, or a clickable link (renders as an anchor). */
export type TermLine = string | { text: string; href: string }

export type TermAction =
  | { type: "print"; lines: TermLine[] }
  | { type: "scroll"; target: string; lines: TermLine[] }
  | { type: "clear" }

export interface TermCommand {
  name: string
  aliases?: string[]
  description: string
  hidden?: boolean
  action: TermAction
}

/** Section jumps derive from `nav` — same trick as content/commands.ts. */
const navCommands: TermCommand[] = nav
  .filter((entry) => entry.href.startsWith("#"))
  .map((entry) => ({
    name: entry.label,
    aliases: [`cd ${entry.label}`, `cd ./${entry.label}`, `goto ${entry.label}`],
    description: `jump to ${entry.label}`,
    action: {
      type: "scroll",
      target: entry.href,
      lines: [`→ cd ./${entry.label}`],
    },
  }))

const infoCommands: TermCommand[] = [
  {
    name: "whoami",
    description: "who is jermyn?",
    action: {
      type: "print",
      lines: [
        site.name,
        site.role,
        `${site.location} · ${site.employer}`,
      ],
    },
  },
  {
    name: "stack",
    aliases: ["skills"],
    description: "tools I move data with",
    action: {
      type: "print",
      lines: [
        stack.flow.columns
          .flatMap((col) => col.nodes.map((node) => node.name))
          .join(" · "),
        `also: ${stack.alsoFluentIn.join(" · ")}`,
      ],
    },
  },
  {
    name: "certs",
    aliases: ["certifications"],
    description: "certifications",
    action: {
      type: "print",
      lines: stack.certifications.map((c) => `✓ ${c.name} — ${c.year}`),
    },
  },
]

const utilityCommands: TermCommand[] = [
  {
    name: "clear",
    aliases: ["cls"],
    description: "clear the terminal",
    action: { type: "clear" },
  },
]

const eggCommands: TermCommand[] = [
  {
    name: "sudo hire-jermyn",
    aliases: ["sudo hire jermyn", "hire-jermyn"],
    description: "with great power…",
    hidden: true,
    action: {
      type: "print",
      lines: [
        "[sudo] password for visitor: ********",
        "ACCESS GRANTED: opening contact channel…",
        "→ jermyn1999@gmail.com",
      ],
    },
  },
]

const baseCommands: TermCommand[] = [
  ...infoCommands,
  ...navCommands,
  ...utilityCommands,
  ...eggCommands,
]

/**
 * `help` lists every visible command; built last so it can read the registry.
 * Section-jump commands render as clickable links (their scroll target).
 */
const helpCommand: TermCommand = {
  name: "help",
  aliases: ["?", "ls commands"],
  description: "list available commands",
  action: {
    type: "print",
    lines: [
      ...baseCommands
        .filter((c) => !c.hidden)
        .map((c): TermLine => {
          const line = `${c.name.padEnd(12)} ${c.description}`
          return c.action.type === "scroll"
            ? { text: line, href: c.action.target }
            : line
        }),
      "(click a section to jump, or type its name)",
    ],
  },
}

export const terminal = {
  prompt: "$",
  hint: "type `help` and hit enter",
  inputAriaLabel: "Terminal input: type help for commands",
  unknown: [
    "zsh: command not found: {cmd} (try `help`)",
    "'{cmd}' is not a thing here. this terminal only speaks portfolio.",
    "{cmd}: no such command. `help` lists what I can do.",
  ],
  /** Max kept log entries + recallable command history. */
  historyLimit: 50,
  commands: [helpCommand, ...baseCommands],
}
