/**
 * Top-right anchor navigation. The `href` must match a section `id`
 * defined inside the section's own content file (or `app/page.tsx`).
 * Reorder this array to reorder the nav.
 */
export const nav = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#projects", label: "projects" },
  { href: "#stack", label: "stack" },
  { href: "#education", label: "education" },
  { href: "#learnings", label: "learnings" },
  { href: "#contact", label: "contact" },
] as const
