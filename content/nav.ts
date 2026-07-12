/**
 * Top-right anchor navigation. Hash `href`s must match a section `id`
 * defined inside the section's own content file (or `app/page.tsx`);
 * plain paths (e.g. `/resume`) link to other pages.
 * `kind: "cta"` renders as an accent-bordered button.
 * Reorder this array to reorder the nav.
 */
export interface NavEntry {
  href: string
  label: string
  kind?: "link" | "cta"
}

export const nav: NavEntry[] = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#reflections", label: "reflections" },
  { href: "#projects", label: "projects" },
  { href: "#stack", label: "stack" },
  { href: "#education", label: "education" },
  { href: "/resume", label: "resume", kind: "cta" },
]
