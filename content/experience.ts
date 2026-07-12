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
  /** Marks a role reached via internal promotion — renders a small ▲ beside the title. */
  promoted?: boolean
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
  /** Tooltip for the ▲ marker on roles with `promoted: true`. */
  promotedHint: "Promoted into this role",
  /** Pointer to the formal record, shown under the timeline. */
  resumeNote: "The full record lives in my",
  resumeLabel: "resume",
  resumeHref: "/resume",
  items: [
    {
      title: "JPMorganChase",
      dates: "Aug 2022 – Present · 4 yrs",
      org: "Compliance Technology · Singapore · *Promoted twice in 3.5 years*",
      roles: [
        {
          title: "Senior Associate Software Engineer",
          team: "Data Governance & Controls",
          dates: "Jan 2026 – Present",
          promoted: true,
          summary:
            "Now I **manage** data-quality and reconciliation controls across the platform for **3 teams**, and built an **AI-assisted tooling** that hands **1 team** back **~225 hours a year**.",
          bullets: [
            "Built automated **reconciliation jobs** across **60+ onboarded datasets**, surfacing discrepancies that were previously not caught and reducing audit risks.",
            "Designed **data-quality validations** for cloud-onboarded datasets that enforce business-quality standards across **10 downstream teams**, reducing data-quality incidents reported downstream.",
            "Led a team to deliver a real-time **reconciliation-metrics dashboard**, streaming metrics asynchronously via **Kafka** into **Java Spring Boot** services, giving **3 business teams** live monitoring and self-service resolution of recurring exceptions in a quarter.",
            "Built **AI-assisted tools** to improve users' experience, reducing **225 hours (28 business days)** of effort a year.",
          ],
        },
        {
          title: "Associate Software Engineer",
          team: "Data Governance & Controls",
          dates: "Feb 2024 – Jan 2026",
          promoted: true,
          summary:
            "**Owned and shipped** the self-service inventory management platform **4 teams** now run **800+ data feeds** on, plus **10+ TB** of **Spark** ETL and an **AWS** data-product migration.",
          bullets: [
            "Designed and shipped a **Java Spring Boot** self-service platform adopted by **4 teams** to register and govern **800+ data feeds**, replacing manual spreadsheet tracking and eliminating hours of recurring manual effort per week.",
            "Engineered **Spark / Databricks** ETL pipelines processing **10+ TB** of data into enterprise reporting, with automated reconciliation enforcing data quality across **145+ data sources**.",
            "Led migration of **4 data products** to **AWS (S3, Glue, Athena, Lambda)**, modernizing legacy systems to improve pipeline reliability and reduce infrastructure cost.",
          ],
        },
        {
          title: "Software Engineer",
          team: "Trade Surveillance · Software Engineer Program (SEP), Class of 2022",
          dates: "Aug 2022 – Jan 2024",
          summary:
            "**Started** here on trade surveillance, owning batch ETL over **500+ datasets a day** and re-engineering legacy jobs to **Spark** (**25%** faster).",
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
      dates: "Jan – Apr 2022",
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
      dates: "Dec 2020 – Jul 2021",
      org: "GovTech Singapore",
      bullets: [
        "Built management dashboards (Python, Power BI, Tableau) and Kanban tooling giving real-time visibility into decision-making metrics.",
      ],
    },
    {
      title: "Undergraduate Research Assistant",
      dates: "May – Aug 2020",
      org: "Singapore Management University · Game Analytics",
      bullets: [
        "Led game-analytics research (Mobile Legends) in a team of 3, building the data pipeline and a Vue + Laravel app to surface insights to stakeholders.",
      ],
    },
  ] satisfies ExperienceItem[],
}
