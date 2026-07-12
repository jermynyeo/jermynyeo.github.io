/**
 * Stack section — the animated data-flow diagram + certifications.
 *
 * To change the diagram:
 *   - Edit `flow.columns[].nodes[]` to add/remove tools. Each node needs an
 *     `id` (used by beams) and a `name` (shown on the card).
 *   - Edit `flow.beams[]` to add/remove flows. Each beam needs `from` and `to`
 *     matching node `id`s. `curvature` arcs the line (negative = up, positive
 *     = down). `delay` staggers when the bright bead starts traveling (seconds).
 *
 * `platform` is the dashed "runs on" row under the diagram.
 * `alsoFluentIn` is the small line of other tools.
 * `certifications` is the chip list at the bottom of the section.
 */

export interface FlowNode {
  id: string
  name: string
  hint?: string
  /** Tooltip shown on hover/focus — where the tool has actually been used. */
  description?: string
}
export interface FlowColumn {
  title: string
  nodes: FlowNode[]
}
export interface FlowBeam {
  from: string
  to: string
  curvature?: number
  delay?: number
}
export interface Certification {
  name: string
  year: string
}


export const stack = {
  id: "stack",
  heading: "Stack",
  note: "How I move data: sources, processing, serving. Hover any node to inspect.",
  flow: {
    columns: [
      {
        title: "Sources",
        nodes: [
          {
            id: "database",
            name: "Database",
            hint: "Database",
            description:
              "Database store.",
          },
          {
            id: "files",
            name: "File",
            hint: "Raw Data",
            description:
              "Unix File System and Management.",
          },
          {
            id: "s3",
            name: "S3",
            hint: "Object store",
            description:
              "Cloud storage for datasets.",
          },
        ],
      },
      {
        title: "Processing",
        nodes: [
          {
            id: "kafka",
            name: "Kafka",
            hint: "streams",
            description:
              "Messaging-based data processing.",
          },
          {
            id: "spark",
            name: "Apache Spark",
            hint: "ETL",
            description:
              "Spark processing for Terabyte-scale pipelines",
          },
          {
            id: "databricks",
            name: "Databricks",
            hint: "notebooks",
            description:
            "Data Lakehouse to manage Cloud datasets.",
          },
        ],
      },
      {
        title: "Serving",
        nodes: [
          {
            id: "athena",
            name: "AWS Athena",
            hint: "SQL",
            description:
              "Serverless SQL offered by AWS.",
          },
          {
            id: "tableau",
            name: "Tableau",
            hint: "BI",
            description: "Data Visualization Dashboarding Tool",
          },
          {
            id: "powerbi",
            name: "Power BI",
            hint: "dashboards",
            description:
              "Data Visualization Dashboarding Tool",
          },
        ],
      },
    ] satisfies FlowColumn[],
    beams: [
      // All sources → Spark
      { from: "database", to: "spark", curvature: -15, delay: 0 },
      { from: "files", to: "spark", delay: 0.4 },
      { from: "s3", to: "spark", curvature: 15, delay: 0.8 },
      // S3 also fans out to Kafka + Databricks
      { from: "s3", to: "kafka", curvature: -30, delay: 1.2 },
      { from: "s3", to: "databricks", delay: 1.6 },
      // Processing → Serving
      { from: "spark", to: "athena", delay: 2.0 },
      // Athena feeds the BI tools
      { from: "athena", to: "tableau", curvature: 20, delay: 2.4 },
      { from: "athena", to: "powerbi", curvature: 40, delay: 2.8 },
    ] satisfies FlowBeam[],
  },
  platformLabel: "// runs on",
  platform: ["AWS", "Kubernetes", "Terraform", "Docker", "Linux"],
  alsoFluentInLabel: "also fluent in",
  alsoFluentIn: [
    "Java",
    "Python",
    "Spring Boot",
    "Kubernetes (CKAD)",
    "Terraform",
    "Docker",
    "Claude",
    "Copilot",
  ],
  certificationsTitle: "Certifications",
  certifications: [
    { name: "AI Tooling · Anthropic Claude 101 / Code 101", year: "2026" },
    { name: "Certified Kubernetes Application Developer (CKAD)", year: "2024" },
    { name: "HashiCorp Terraform Associate", year: "2023" },
    { name: "Databricks Lakehouse Fundamentals", year: "2023" },
    { name: "AWS Certified Cloud Practitioner", year: "2020" },
  ] satisfies Certification[],
}
