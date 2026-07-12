/**
 * Reflections section metadata (heading + intro line).
 *
 * The reflections themselves are one Markdown file each in
 * `content/reflections/`, loaded via `lib/reflections.ts`. To add one, drop a
 * new `.md` file in that folder — the card and its `/reflections/<slug>` page
 * generate automatically.
 */
export const learnings = {
  id: "reflections",
  heading: "Reflections",
  intro:
    "The honest story behind the work: why I started, what went well, what I got wrong, what finally clicked, and what I'd do differently.",
  /** Small label shown above each reflection's driving question. */
  questionLabel: "the question that led here",
} as const
