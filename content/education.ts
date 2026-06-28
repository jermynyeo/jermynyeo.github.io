/**
 * Education section.
 *
 * Each item is a degree/institution. Inside, `blocks` are the small panels
 * (Honors & Awards, Final-Year Project, Focus Modules, Teaching Assistant…).
 * A block has either `bullets[]` (list) or `body` (single paragraph).
 *
 * All strings support inline markdown: **bold**, *italic*, `code`.
 */

export interface EducationBlock {
  title: string
  bullets?: string[]
  body?: string
}

export interface EducationItem {
  degree: string
  dates: string
  /** Sub-line under the degree (e.g. school name). Can include **bold**. */
  school: string
  blocks: EducationBlock[]
  /** Optional last line (e.g. "**CCAs:** ..."). */
  ccas?: string
}

export const education = {
  id: "education",
  heading: "Education",
  items: [
    {
      degree: "Bachelor of Science, Information Systems",
      dates: "Aug 2018 — Jul 2022",
      school: "Singapore Management University · **Summa Cum Laude**",
      blocks: [
        {
          title: "Honors & Awards",
          bullets: [
            "🏆 SIS Aspirations Scholarship",
            "🏆 Dean's List (AY 2019, 2022)",
          ],
        },
        {
          title: "Final-Year Project",
          body: "Research on online discussion forums — Natural Language Processing & learning analytics, with Dr. Swapna Gottipati.",
        },
        {
          title: "Focus Modules",
          bullets: [
            "Machine Learning · Artificial Intelligence",
            "Text Mining & Analytics",
            "Social Analytics · Visual Analytics for BI",
          ],
        },
        {
          title: "Teaching Assistant",
          body: "Web Application Development · Enterprise Solution Development · Business Process Analytics · Computational Thinking · Social Analytics · Text Mining.",
        },
      ],
      ccas: "**CCAs:** SMUX Trekking · SMU Strategica · SCIS Ellipsis",
    },
  ] satisfies EducationItem[],
}
