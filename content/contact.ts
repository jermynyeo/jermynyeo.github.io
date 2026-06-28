/**
 * Contact section — final CTA.
 *
 * `links[]` are the buttons. `kind: "primary"` is the filled green button,
 * `kind: "ghost"` is outlined. `external: true` opens in a new tab.
 */

export interface ContactLink {
  label: string
  href: string
  kind: "primary" | "ghost"
  external?: boolean
}

export const contact = {
  id: "contact",
  heading: "Let's talk",
  lead: "Open to interesting problems and good conversations.",
  links: [
    { label: "Email", href: "mailto:jermyn1999@gmail.com", kind: "primary" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jywh/",
      kind: "ghost",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/jermynyeo",
      kind: "ghost",
      external: true,
    },
  ] satisfies ContactLink[],
}
