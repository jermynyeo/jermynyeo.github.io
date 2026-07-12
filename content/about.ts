/**
 * About section.
 * - `paragraphs[]` accepts inline markdown: **bold**, *italic*, `code`.
 * - `currently.items[]` is the right-hand card; same markdown supported.
 */
export const about = {
  id: "about",
  heading: "About",
  paragraphs: [
    "My work centers on one thing: data teams can trust. I'm a backend engineer who designs and builds **Java** and **Spring Boot** solutions that integrate with data platforms to enforce quality, reconciliation, and governance. At JPMorganChase I've spent 4 years on exactly that across Compliance Technology, working with teams to keep the bank's data reliable and trustworthy.",
    "I work mostly in Java, with solid platform foundations across Kubernetes (CKAD), Terraform, and AWS, plus hands-on proficiency in **Claude** and AI-assisted development. My rule is simple: build systems that are reliable, not just clever.",
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
