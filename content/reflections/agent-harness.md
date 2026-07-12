---
title: Agent Harness · Consistency at Scale
kind: Project · 2026
question: If agents are stateless, how can we built projects at scale with consistency?
tags: AI, Harness
related: aad-time-to-market
order: 1
---


As part of this project, we split the workload into 3 main parts - code refactoring, feature development, deployment readiness. I took on the role to refactor this code base. When I took this responsibility, I thought - how difficult can this be? Little did I know, I was so wrong. We have 3 experienced developers, we can manage it.



 let's use agents to plan, iterate then deliver. Little did I know, this was the start of a nightmare. 

 But at some point, due to context degreation, it kept returning me poor results. I couldn't understand. Maybe my context is now lossy due to summarization and context compression. 


I recently started working on a project with a group of developers, refactoring a monolithic code repository containing of 12,000 lines into modular pieces and clearly seggregated microservices. As part of this project, we split the workload into 3 main parts - code refactoring, feature development, deployment. I took on the role to refactor this code base, and thought - How difficult can this be? We have 3 experienced developers, we can manage it. We started breaking down tasks, creating JIRA boards and estimated a delivery of 

 let's use agents to plan, iterate then deliver. Little did I know, this was the start of a nightmare. 

It was the first project where I 

As my team leaned harder on AI-assisted development, I kept hitting the same wall: every session started from zero. An agent that nailed something one day forgot it the next, and three of us could run the same tool and get different results. Given that it was a huge project deliverable, it was causing major merge conflicts, duplicated work and inefficient agent use.

So I built a harness around the agent: a shared working-style contract, persistent memory, and reusable skills that travel with it across sessions and machines. I created an agile team of 13 agents to manage new requirements and project timelines. I also added 10 skills to ensure key context prompts are not missed when a new session starts.

The instinct turned out to be the same one I bring to data: a system is only as good as its consistency. Reliable AI isn't a smarter model, it's a harness that makes good output repeatable. Nonetheless, one thing that surprised me was the exponential growth of the context window. This is something I will definitely be looking at, to understand how to optimize the context window, compressing it without losing too much information



As my team leaned harder on AI-assisted development, I kept hitting the same wall: every session started from zero. An agent that nailed something one day forgot it the next, and three of us could run the same tool and get different results. Given that it was a huge project deliverable, it was causing major merge conflicts, duplicated work and inefficient agent use.

So I built a harness around the agent: a shared working-style contract, persistent memory, and reusable skills that travel with it across sessions and machines. I created an agile team of 13 agents to manage new requirements and project timelines. I also added 10 skills to ensure key context prompts are not missed when a new session starts.

The instinct turned out to be the same one I bring to data: a system is only as good as its consistency. Reliable AI isn't a smarter model, it's a harness that makes good output repeatable. Nonetheless, one thing that surprised me was the exponential growth of the context window. This is something I will definitely be looking at, to understand how to optimize the context window, compressing it without losing too much information
