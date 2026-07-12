---
title: Agent Loops · Automating Development
kind: Project · 2026
question: How much of development can I hand off to an agent loop?
tags: AI, Agent Loop, Skills
related: aad-time-to-market, agent-harness
order: 31
---

Continuing from the reflection on time to market with agent-assisted development, I want to use this piece to talk about how I built agent loops to improve overall productivity. A caution up front: this is **not a recommended approach for everyone** using AI-assisted development especially if you don't have a development background. **A human in the loop is always important**, there to prevent catastrophic events like deleting a database or breaking a system in production. Unless you really know what you are doing, it's always best to stay in "accept edit" mode.

As mentioned in the other reflection, I created a whole agent ecosystem that helped me develop the product and ship it in roughly a third of the estimated time, which I largely attribute to agent loops. (Feel free to reach out if you want more detail on how I built the loop.) At a high level, I set each sprint up as an agent loop, and each one took about 3 hours to complete, including the Scrum ceremonies you would expect from a real team. I have to admit, this saved me a lot of time: instead of accepting every command the agent ran, my review was only needed at the end of each sprint. So far, we have around 25 sprints and 10 Epics delivered.

From this experience, my biggest takeaway was simple: if you don't know how to do it securely, don't. Setting up the loop meant building a lot of guardrails and harnesses to prevent unexpected behaviour, and that came at a cost: context bloat. My context grew with every sprint, so I hit the token ceiling faster than before. At the start, a full session could ship 2-3 sprints; now it ships one at most. There are other factors, of course: some sprints are light (a DB migration) and some are heavy (refactoring and decomposing 12,500 lines of code into navigable folders for human and agentic developers). But I'm sure the way I've implemented these loops isn't the most optimized, which burns more tokens per call and drags down the agent's performance. That is something I will definitely be looking at to improve.

P.S. Like the saying goes, "better safe than sorry". But I did so much to be safe that it compromised the agent's efficiency.
