---
title: Data Reconciliation · Data Consistency
kind: Thoughts · 2026
question: How can we ensure data consistency between two datasets?
tags: Data Quality, Data Pipeline, Data Reconciliation, Consistency
related: data-quality
order: 4
---

Data, at its core, is raw, messy, unfiltered and essentially pieces of information collected from one producer and distributed to its consumers. Through my years of experience, I have seen issues caught too late, resulting in **costly historical reruns**. One common problem I saw was consumers being uncertain whether what they had received was complete, given high data fluctuations. What I mean by complete here is not just data volumes, but the actual records. This is where data reconciliation comes into the picture. It serves to answer the question: "**Did this data drift from the producer?**" There are definitely other forms of validation that work hand-in-hand with reconciliation. Nonetheless, in this segment we will discuss what was done, and how it improves consumers' confidence in the data received.

We can understand data in multiple layers. First would be the metadata of the data: this provides a high-level understanding, such as volume, dataset name, and arrival time. We can leverage this metadata as the first line of defence. Next would be the actual records. We can either look at aggregated information for reconciliation, or compare row by row with the producer. While we can perform reconciliation at the smallest granularity, we should balance it against performance. Apart from the granularity of data, we also need to determine the SLA for reconciliation, and whether we want it in the critical path or not.

In my case, reconciliation was not in the critical path. Hence, we took the approach of building an asynchronous system to compare aggregated metrics between the producer and consumer. This helped promptly flag data volume drifts and mismatching data, kicking off investigations or escalations to the producer. While such reconciliation reduces risk, investigating the failures requires manual work to pick out the exact records that mismatch. On large datasets, this can take hours, and the challenge is even bigger when comparing data across two systems. Nonetheless, we have to admit it is a "safety net" for the data received. The next question, then, is: how can we improve this overall data-quality landscape to reduce manual investigative effort?
