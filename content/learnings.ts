/**
 * Learnings section — short reflections on projects + certifications.
 *
 * `intro` is the line under the heading. `items[]` are the cards.
 * All strings support inline markdown: **bold**, *italic*, `code`.
 */

export interface LearningItem {
  /** Small uppercase pill at the top of the card */
  kind: string
  title: string
  body: string
}

export const learnings = {
  id: "learnings",
  heading: "Learnings",
  intro:
    "Reflections (感想) on the projects I've built and the certifications I've studied for. *Drafts — to be replaced with my own thoughts.*",
  items: [
    {
      kind: "Certificate · 2024",
      title: "CKAD — Kubernetes",
      body: "DRAFT — your thoughts after CKAD: what finally clicked about Kubernetes, what surprised you, and how it changed the way you think about shipping services.",
    },
    {
      kind: "Project · 2026",
      title: "This Portfolio",
      body: "DRAFT — building my own site as an explorable craft world taught me… (scoping a playful idea, design vs. engineering trade-offs, what you'd reuse next time).",
    },
    {
      kind: "Project · University",
      title: "Fake News Detection",
      body: "DRAFT — reflecting on the NLP project: what worked, what was hard about the data, and what you'd do differently now with more experience.",
    },
  ] satisfies LearningItem[],
}
