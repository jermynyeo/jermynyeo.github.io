/**
 * Hero section — an asymmetric split.
 * Left: the static identity billboard (`intro`) — carries the page <h1> + CTAs.
 * Right: a live terminal session (`terminal`) — the playable echo, no giant
 * name (that lives in the billboard, so it isn't duplicated).
 */
export const hero = {
  heading: "JERMYN YEO",
  // Left billboard — the primary, server-rendered identity.
  intro: {
    eyebrow: "// backend · data quality",
    name: "Jermyn Yeo",
    pov: "I design and build the backend systems that keep data reliable and trustworthy.",
    ctas: [
      { label: "resume", href: "/resume", kind: "primary" as const },
      { label: "get in touch", href: "#contact", kind: "ghost" as const },
    ],
  },
  terminal: {
    lines: [
      { kind: "command", text: "whoami" },
      { kind: "output", text: "Backend Software Engineer · Data Quality" },
      { kind: "output", text: "Singapore · JPMorganChase" },
      { kind: "command", text: "describe platform --owner jermyn" },
    ],
  },
  // Caption under the title
  scrollHintLabel: "scroll",
  scrollHintAriaLabel: "Scroll to content",
  scrollHintHref: "#about",
} as const
