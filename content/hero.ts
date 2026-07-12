/**
 * Hero section — a typed terminal session that settles into the headline.
 * Each line types in sequence; `command` lines get a `$ ` prompt.
 * The line marked `isHeading` renders as the page's <h1>.
 */
export const hero = {
  heading: "JERMYN YEO",
  terminal: {
    lines: [
      { kind: "command", text: "whoami" },
      { kind: "heading", text: "Jermyn Yeo" },
      { kind: "output", text: "Software Engineer  (Data, Platform)" },
      { kind: "output", text: "Singapore · JPMorganChase" },
      { kind: "command", text: "ls ./portfolio" },
    ],
  },
  // Caption under the title
  scrollHintLabel: "scroll",
  scrollHintAriaLabel: "Scroll to content",
  scrollHintHref: "#about",
} as const
