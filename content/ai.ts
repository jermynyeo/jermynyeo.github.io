/**
 * AI & Agents section — how I apply engineering reliability to AI.
 *
 * `capabilities[]` render as cards; a `href` links the card to the reflection
 * that proves it (opens in a new tab, like the reflection teasers).
 * `tools` is the small line of day-to-day AI tooling.
 */

export interface AiCapability {
  name: string
  desc: string
  /** Optional link to the reflection that backs this capability. */
  href?: string
}

export const ai = {
  id: "ai",
  heading: "AI & Agents",
  note: "Applying what I've learnt to what I love to do.",
  capabilities: [
    {
      name: "Context Engineering",
      desc: "Structuring and compressing context so agents stay sharp as a session and a codebase grow.",
    },
    {
      name: "Agent Evaluations",
      desc: "A data-quality mindset for AI: checking whether the output is correct, not just whether it looks right.",
    },
    {
      name: "Model Context Protocol (MCP)",
      desc: "Reusing existing MCPs to improve agent performance.",
    },
  ] as AiCapability[],
  toolsLabel: "STACK",
  tools: ["Claude", "Copilot", "MCP"],
  certLabel: "certified",
  cert: { name: "AI Tooling · Anthropic Claude 101 / Code 101", year: "2026" },
}
