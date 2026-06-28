/**
 * About section.
 * - `paragraphs[]` accepts inline markdown: **bold**, *italic*, `code`.
 * - `currently.items[]` is the right-hand card; same markdown supported.
 */
export const about = {
  id: "about",
  heading: "About",
  paragraphs: [
    "I'm a data and platform engineer who likes owning the whole journey of data — from ingestion and ETL through the quality, governance, and reporting layers that teams actually depend on. At JPMorgan I've spent four years building exactly that across compliance technology, alongside the backend microservices and cloud migrations that keep it running.",
    "I work mostly in Java and Python, and I'm steadily deepening the platform side — Kubernetes (CKAD), Terraform, and AWS (Solutions Architect, in progress). I'm happiest with problems that are equal parts systems design and data craft, and I care about building things that are reliable — not just clever.",
  ],
  currently: {
    title: "Currently",
    items: [
      "💼 Engineering @ **JPMorganChase**",
      "🗣️ English & Mandarin (native) · Cantonese",
      "📍 Singapore",
    ],
  },
} as const
