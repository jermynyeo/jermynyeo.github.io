---
title: Data Validation · Data Trustworthiness
kind: Thoughts · 2026
question: How can we tell if data is trustworthy?
tags: Data Quality, Data Pipeline, Data Validation
related: data-quality, data-reconciliation
order: 3
---

Data is the foundation of almost every business decision we make today. Be it for statistics or building artificial intelligence (AI) models, we cannot run away from data collection, processing and analytics. In such situations, **how can we ensure that the data we use for our business operations is reliable?** This is where data validation comes into play. It slots itself between data collection and processing, and its goal is to ensure only clean data passes through the pipeline.

There are four dimensions to data validation — **completeness**, **conformity**, **timeliness** and **accuracy**. These four dimensions are typically captured in a data contract between producer and consumer, giving both parties a single source of truth for a dataset's metadata. With these validations in place, we can significantly cut the cost of re-runs and lower audit risk.

  - **Completeness** answers the question, **"Am I receiving the complete dataset from my producer?"** This looks at metrics like data volume — did we receive the number of records we were expecting? — and aggregated metrics of the records, like the sum of a key column tallying with what the producer sent. Typically, this is performed on a per-feed basis, once we receive them.
  - **Conformity** looks at whether a dataset matches the expected schema, checking metadata like data types and valid enumerations.
  - **Timeliness** looks at the SLA of the file — given a dataset, did the file arrive within the agreed window? For example, if the contract says the file should land by 6am, did it actually show up on time?
  - **Accuracy** looks at how correct the data is — do the values actually reflect the real world? This is the hardest dimension to validate. Unlike volume, schema or timeliness checks, we usually cannot judge correctness from the feed alone; we need a trusted reference or source of truth to compare against.

While the idea of data validation is important, it raises the question of who is responsible for ensuring the dataset adheres to the contract. I personally feel it is always better to be safe than sorry: both producers and consumers share the responsibility of keeping data reliable. That said, under **Data Mesh** — a decentralized approach where data is owned as a product by the domain teams that produce it — the responsibility should sit with the producer, following the principle of **"Data as a Product"**. Beyond who performs the validations, we also need to answer: **"Should data validations be part of the critical path?"** This is a loaded question, because it shapes how these validations are implemented.

In my experience, many considerations come into play when deciding how to implement data validations, and they are mainly driven by business impact. Still, I believe validations belong in the critical path, or their value is diminished. The catch is the triangular relationship between processing time, quality and cost: the more checks we add, the higher the quality, but the slower and more expensive the pipeline becomes — so we have to decide which of the three we are willing to give up. In business-critical pipelines that drive decisions, I would never de-prioritize data quality. For pipelines with tight SLAs, meeting the SLA may have to come first — though never at the total expense of quality. And even the cleanest validation only confirms a dataset against its contract; making sure it still matches the producer downstream is where data reconciliation picks up.
