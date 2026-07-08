/**
 * Experience timeline.
 *
 * An item can either:
 *   (a) have `roles[]` — multiple roles at the same company (renders nested),
 *   (b) have `bullets[]` only — a single-role item (e.g. an internship).
 *
 * Every bullet supports inline markdown: **bold**, *italic*, `code`.
 *
 * To reorder, just move items in the array. Newest at the top by convention.
 */

export interface ExperienceRole {
  title: string
  team?: string
  dates: string
  /**
   * One-line skim shown when the role is collapsed. Roles with a summary
   * render as click-to-expand; roles without one show bullets directly.
   */
  summary?: string
  bullets: string[]
}

export interface ExperienceItem {
  /** Big heading: usually the company, but can be a role title for single-role items */
  title: string
  dates: string
  /** Sub-line under the title (e.g. "Compliance Technology · Singapore") */
  org?: string
  roles?: ExperienceRole[]
  bullets?: string[]
}

export const experience = {
  id: "experience",
  heading: "Experience",
  items: [
    {
      title: "JPMorganChase",
      dates: "Aug 2022 — Present · 4+ yrs",
      org: "Compliance Technology · Singapore · *Promoted twice in 3.5 years*",
      roles: [
        {
          title: "Senior Associate Software Engineer",
          team: "Data Governance & Controls",
          dates: "Jan 2026 — Present",
          summary:
            "Reconciliation automation, data-quality controls, a **Kafka**-fed metrics dashboard, and AI-assisted tooling.",
          bullets: [
            "Built automated **reconciliation jobs** across **60+ onboarded datasets**, surfacing discrepancies that were previously not caught and reducing audit risks.",
            "Designed **data-quality validations** for cloud-onboarded datasets that enforce business-quality standards across **10 downstream teams**, reducing data-quality incidents reported downstream.",
            "Led a team to deliver a real-time **reconciliation-metrics dashboard**, streaming metrics asynchronously via **Kafka** into **Java Spring Boot** services — giving **3 business teams** live monitoring and self-service resolution of recurring exceptions in a quarter.",
            "Built **AI-assisted tools** to improve users' experience, reducing **225 hours (28 business days)** of effort a year.",
          ],
        },
        {
          title: "Associate Software Engineer",
          team: "Data Governance & Controls",
          dates: "Feb 2024 — Jan 2026",
          summary:
            "Self-service governance platform, terabyte-scale **Spark** ETL, and an **AWS** data-product migration.",
          bullets: [
            "Designed and shipped a **Java Spring Boot** self-service platform adopted by **4 teams** to register and govern **800+ data feeds**, replacing manual spreadsheet tracking and eliminating hours of recurring manual effort per week.",
            "Engineered **Spark / Databricks** ETL pipelines processing **10+ TB** of data into enterprise reporting, with automated reconciliation enforcing data quality across **145+ data sources**.",
            "Led migration of **4 data products** to **AWS (S3, Glue, Athena, Lambda)**, modernizing legacy systems to improve pipeline reliability and reduce infrastructure cost.",
          ],
        },
        {
          title: "Software Engineer",
          team: "Trade Surveillance · Software Engineer Program (SEP), Class of 2022",
          dates: "Aug 2022 — Jan 2024",
          summary:
            "High-volume batch ETL for market surveillance, **Spring Boot** microservices, and **Spark** cloud re-engineering.",
          bullets: [
            "Owned high-volume **batch** ingestion and ETL processing **500+ datasets daily** for market surveillance.",
            "Built **Java Spring Boot** backend microservices powering mission-critical surveillance workflows relied on by compliance teams.",
            "Drove **AWS** adoption by re-engineering legacy stored-procedure batch jobs into **Apache Spark** pipelines, cutting run time by **25%**.",
          ],
        },
      ],
    },
    {
      title: "Compliance Intern",
      dates: "Jan — Apr 2022",
      org: "Ernst & Young · Singapore",
      bullets: [
        "Executed regulatory compliance testing for enterprise clients and co-authored project proposals in cross-functional teams of 3–4.",
      ],
    },
    {
      title: "Software Engineer Intern",
      dates: "Dec 2021",
      org: "YouTrip · Singapore",
      bullets: [
        "Built backend APIs in Go for core business functions and integrated third-party APIs, validating them with Postman collections.",
      ],
    },
    {
      title: "Software Engineer Intern",
      dates: "Dec 2020 — Jul 2021",
      org: "GovTech Singapore",
      bullets: [
        "Built in-house dashboards in Python, Power BI, and Tableau, giving management real-time visibility into key decision-making metrics.",
        "Developed visualizations and Kanban tooling for manpower and task tracking, streamlining workflows and improving team productivity.",
      ],
    },
    {
      title: "Undergraduate Research Assistant",
      dates: "May — Aug 2020",
      org: "Singapore Management University · Game Analytics",
      bullets: [
        "Led game-analytics research (Mobile Legends: Bang Bang) in a team of 3, building the data collection, cleaning, and analysis pipeline.",
        "Designed and built a Vue + Laravel web application to surface the statistics and analysis to stakeholders.",
      ],
    },
  ] satisfies ExperienceItem[],
}
