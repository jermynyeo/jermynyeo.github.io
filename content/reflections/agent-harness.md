---
title: Agent Harness · Consistency at Scale
kind: Project · 2026
question: If agents are stateless, how can we build projects at scale with consistency?
tags: AI, Agent Harness, Consistency, Reliability
related: aad-time-to-market, agent-loops
order: 30
---

Continuing from the reflection about time to market with agent-assisted development, I want to dedicate this segment to the challenges I faced building an agentic ecosystem for a **team of 3**, and how I overcame them. One might tell you the best way to collaborate on AI-assisted development is to just add an AGENT.md or CLAUDE.md file to the project root, and it will be replicable across the team. But not everyone tells you that these files alone are **insufficient**. What we thought was a good way to speed up time to market ended up as the **start of our development nightmare**. We started being upset at one another for not adhering to the standards in those files. But what we forgot was that everyone is different, from the way they prompt to the way they interact with the agent.

For more context, we are a team of 3 developers working on 3 different workstreams. Ideally the features we work on don't overlap. But that doesn't mean the code we touch doesn't overlap. This resulted in huge merge conflicts that took us 5-6 hours to resolve (even with agent help), hindering our productivity. This adds to why the time savings weren't proportionate: at the start, when things were less intertwined, shipping and delivering was easy. But once everyone started committing and shipping their work, that is where the complications arose. Besides merge conflicts, there were other issues like duplicated tasks and poor agent performance.

Setting up the agentic ecosystem was difficult at the start. We couldn't find the right harness or guardrail to make every session replicable. As we all know, agents are stateless: every time a new session starts, there is little to no guarantee that what I have today is what I will get tomorrow, and it only gets harder with multiple developers. Through a lot of research and iteration, I managed to build a shared working-style contract, persistent memory, and reusable skills that travel across sessions and machines. With this harness, we reduced serious merge conflicts, and the agents could understand why certain changes were made without conflicting with previous policies or guardrails. We could also start prompts consistently from shared skills, reducing the missing context the agents so often needed.