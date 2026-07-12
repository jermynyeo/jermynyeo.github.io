/**
 * About section.
 * - `paragraphs[]` accepts inline markdown: **bold**, *italic*, `code`.
 * - `currently.items[]` is the right-hand card; same markdown supported.
 */
export const about = {
  id: "about",
  heading: "About",
  paragraphs: [
    "I am a backend software engineer who spent the past 4 years working in the space of Compliance in a bank, where regulations are stronger, to build systems that ensures data is trustworthy. I work mostly in Java, with solid platform foundations across Kubernetes (CKAD), Terraform, and AWS.",
    "Apart from software engineering, I am an avid learner in the field of AI, trying to keep up with the latest news. I have played with agentic development and more, and you can read more about them in the Learnings section"
  ],
  /** Closing pull-quote — the thesis of the whole page. */
  pullQuote: "Data should be **correct**, not just available.",
  /** Headline proof, surfaced so a 30-second skim sees impact without a click. */
  stats: [
    { value: "10+ TB", label: "data processed in ETL pipelines" },
    { value: "800+", label: "data feeds governed" },
    { value: "225 hrs", label: "of manual effort saved / year" },
    { value: "2×", label: "promoted in 3.5 years" },
  ],
  currently: {
    title: "Currently",
    items: [
      "💼 Backend Software Engineer @ **JPMorganChase**",
      "🗣️ English & Mandarin (native)",
      "📍 Singapore",
    ],
  },
} as const
