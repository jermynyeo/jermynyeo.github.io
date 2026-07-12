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
    "A peek into my own inner workings...",
  /** Small label shown above each reflection's driving question. */
  questionLabel: "the question that led here",
  /**
   * Reflections split into two side-by-side lanes. A reflection joins the
   * `ai` lane if it carries the "AI" tag (see `isAiReflection`); everything
   * else falls into the `craft` lane.
   */
  lanes: {
    craft: "engineering craft",
    ai: "building with ai",
  },
} as const
