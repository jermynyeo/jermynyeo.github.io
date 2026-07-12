/**
 * Learnings section — short reflections on projects + certifications.
 *
 * `intro` is the line under the heading. `items[]` are the cards.
 * All strings support inline markdown: **bold**, *italic*, `code`.
 */

export interface LearningItem {
  /** URL slug for the full write-up at /reflections/[slug] */
  slug: string
  /** Small uppercase pill at the top of the card */
  kind: string
  title: string
  /** Short 2-line reflection, shown as the lead above the body */
  reflection: string
  /**
   * The actual learnings — longer body below the reflection.
   * Split into paragraphs on blank/newline breaks (`\n`), or pass an
   * array of strings where each entry is its own paragraph.
   */
  body: string | string[]
}

export const learnings = {
  id: "reflections",
  heading: "Reflections",
  intro:
    "The honest bits behind the scenes: what I got wrong, what finally clicked, and what I'd do differently. Short reads, no fluff.",
  items: [
    {
      slug: "agent-harness",
      kind: "Project · 2026",
      title: "Agent Harness · Consistency at Scale",
      reflection:
        "AI agents drift between sessions, devices, and teammates. I built the harness that keeps them consistent.",
      body: [
        "As my team leaned harder on AI-assisted development, I kept hitting the same wall: every session started from zero. An agent that nailed something one day forgot it the next, and three of us could run the same tool and get different results. Given that it was a huge project deliverable, it was causing major merge conflicts, duplicated work and inefficient agent use.",
        "So I built a harness around the agent: a shared working-style contract, persistent memory, and reusable skills that travel with it across sessions and machines. I created an agile team of 13 agents to manage new requirements and project timelines. I also added 10 skills to ensure key context prompts are not missed when a new session starts.",
        "The instinct turned out to be the same one I bring to data: a system is only as good as its consistency. Reliable AI isn't a smarter model, it's a harness that makes good output repeatable. Nonetheless, one thing that surprised me was the exponential growth of the context window. This is something I will definitely be looking at, to understand how to optimize the context window, compressing it without loosing too much information",
      ],
    },
    {
      slug: "this-portfolio",
      kind: "Personal Site · 2026",
      title: "This Portfolio",
      reflection:
        "The start of a new Era.",
        body: ["Having heard the hype and prowess of AI-assisted development, I knew I had to start somewhere - and this is just the beginning.",
              "My skills as an engineer hover around backend development, data pipelines and visualization. Even though I had fiddled around with UI development before, this area still remains unfamiliar to me. So, I thought that this would be a good playground for me to start building web apps by leveraging and stress-testing AI-assisted development.",
              "By building this portfolio with the help of AI, I was able to build something shippable within a day. Nonetheless, at the end of the day, without humans, AI will ship generic and replicable products. This made me realise that how I steered the conversations by adding my preferences and vision makes this page uniquely mine."]
    },
    {
      slug: "ckad-kubernetes",
      kind: "Certificate · 2024",
      title: "CKAD · Kubernetes",
      reflection:
        "One can never fully understand a system without understanding the Theories behind it.",
      body: ["CKAD was the first certificate that I had studied for after entering the workforce. Since I was actively deploying applications on Kubernetes, I thought - why not?",
          "While I was working with Kubernetes on a daily basis, I faced challenges in understanding how to optimize a deployment configuration to reduce cost, but still ensure the application is stable. Even though I had knowledge in Docker and containerization, it wasn't sufficient for me to confidently make changes or debug the deployment configuration.",
              "Through my studies for CKAD, I was able to get hands-on familiarity with the framework and understand how and why I should or shouldn't amend a certain configuration. Additionally, it changed how I was debugging the application: less trial-and-error, more reasoning and targeted investigations."],
    },
  ] satisfies LearningItem[],
}
