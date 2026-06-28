/**
 * Hero section — the centered scrambled headline that cycles through phrases.
 * `phrases` are scrambled in order then loop. Add/remove freely.
 */
export const hero = {
  // The static word the cycle starts/ends from
  heading: "JERMYN YEO",
  // Cycled in order, then loops
  phrases: [
    "Hello, I'm Jermyn",
    "Data & Platform Engineer",
    "I build data pipelines",
    "ETL · Governance · Cloud",
    "Java · Python · Spark · AWS",
    "Scroll for the full story",
  ],
  // Caption under the title
  scrollHintLabel: "scroll",
  scrollHintAriaLabel: "Scroll to content",
  scrollHintHref: "#about",
} as const
