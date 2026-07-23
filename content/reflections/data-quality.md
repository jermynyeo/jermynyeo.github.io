---
title: Data Quality · Rubbish In, Rubbish Out
kind: Thoughts · 2026
question: Is it true that the model is only as good as the data it's fed?
tags: Data Quality, Data Pipeline, Data Reconciliation
related: data-validation, data-reconciliation, intro-swe, intro-ai
order: 2
---

I was lucky to land a role in the domain that I loved: Data Quality. This is something that I was an advocate of, especially due to my background in analytics. Having done many projects and used data from various sources, I knew how a little variance in the quality of data can impact the whole pipeline. I recall re-running multiple pipelines just because a new feature was added, or data was not cleaned properly. Those countless nights made me realise the importance of doing it right at the start. While it's understandable that not everything can be caught in the first iteration, we should still strive for a minimum acceptable standard for every dataset.

I recall the first thing we always did was exploratory data analysis (EDA), and through understanding the data, its schema and distribution, we would evaluate what needs to be fixed: whether any important columns we want to use for analysis have a high proportion of null values, and if so, what we should do with them. Drop them, or fill them with the average or a fixed value? These were the questions we were framed to answer and decide, or even trial and error with the data until we got good model results. Through these, I knew that if we had something to catch data breaks before they were registered in catalogues, it would be very helpful.

In my current role, I see the risks involved when data is not received on time, has even 1 percent or less of its data missing, or has fields that don't fulfil agreed enumerations. Given the volume of data that gets ingested, the reruns for these poor-quality data batches are very costly. Hence, my team has been actively finding preventive measures to reduce the risks and cost involved, catching breaks before data gets ingested into the systems and many more. 

All in all, my background and experience made me a data enthusiast, and I am a firm believer that **a model will only ever be as good as its bottleneck**. In this case, that bottleneck is always poor quality data.
