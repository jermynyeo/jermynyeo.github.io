/**
 * About section.
 * - `paragraphs[]` accepts inline markdown: **bold**, *italic*, `code`.
 * - `currently.items[]` is the right-hand card; same markdown supported.
 */
export const about = {
  id: "about",
  heading: "About",
  paragraphs: [
    "I'm a software engineer focused in the area of data and platform who likes owning the whole journey of data — from ingestion and ETL through the quality, governance, and reporting layers that teams depend on. At JPMorganChase I've spent 4 years building that across Compliance Technology alongside the backend microservices and cloud migrations that keep it running.",
    "I work mostly in Java, with a solid platform knowledge — Kubernetes (CKAD), Terraform, and AWS — and hands-on proficiency in **Claude** and AI-assisted development. I love to understand challenging problems, breaking them down into bite-sized pieces for solutioning, and I care about building things that are reliable — not just clever .",
  ],
  currently: {
    title: "Currently",
    items: [
      "💼 Engineering @ **JPMorganChase**",
      "🗣️ English & Mandarin (native)",
      "📍 Singapore",
    ],
  },
} as const
