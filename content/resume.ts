/**
 * Resume page (/resume) — printable, ATS-friendly.
 * Experience and education are pulled from their own content files so the
 * resume never drifts from the site; only the summary and skill groupings
 * live here.
 */

export interface SkillGroup {
  title: string
  items: string[]
}

export const resume = {
  summary:
    "Software Engineer with 4 years at JPMorganChase building data pipelines, governance tooling, and cloud-native backend services. Experienced in terabyte-scale Spark/Databricks ETL, AWS data platform migrations, and Java Spring Boot microservices, with hands-on proficiency in Claude and AI-assisted development.",
  skillGroups: [
    {
      title: "Languages",
      items: ["Java", "Spring Boot", "Python", "SQL"],
    },
    {
      title: "Data & Processing",
      items: [
        "Apache Spark",
        "Databricks",
        "Kafka",
        "Delta Lake",
        "ETL / ELT pipelines",
        "Data Governance & Reconciliation",
      ],
    },
    {
      title: "Cloud & Platform",
      items: [
        "AWS (S3, Glue, Athena, Lambda)",
        "Kubernetes (CKAD)",
        "Terraform",
        "Docker",
      ],
    },
    {
      title: "AI & ML",
      items: ["Claude", "Copilot", "Context & Harness Engineering"],
    },
    {
      title: "Data Visualization",
      items: ["Tableau"],
    },
  ] satisfies SkillGroup[],
  labels: {
    backToSite: "← back to site",
    download: "Download PDF",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
  },
}
