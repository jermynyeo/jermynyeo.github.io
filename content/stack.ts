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
  note: "How I move data — sources, processing, lakehouse, serving. Hover any node to inspect.",
  flow: {
    columns: [
      {
        title: "Sources",
        nodes: [
          {
            id: "kafka",
            name: "Kafka",
            hint: "streams",
            description:
              "Async reconciliation-metrics feed into Spring Boot services at JPMC.",
          },
          {
            id: "postgres",
            name: "Postgres",
            hint: "OLTP",
            description:
              "Relational backend for the self-service data-governance platform.",
          },
          {
            id: "files",
            name: "Files",
            hint: "batch",
            description:
              "High-volume batch ingestion for trade-surveillance ETL.",
          },
        ],
      },
      {
        title: "Processing",
        nodes: [
          {
            id: "spark",
            name: "Apache Spark",
            hint: "ETL",
            description:
              "Terabyte-scale ETL pipelines feeding enterprise reporting at JPMC.",
          },
          {
            id: "databricks",
            name: "Databricks",
            hint: "notebooks",
            description:
              "Pipeline development & Lakehouse Fundamentals certified.",
          },
          {
            id: "glue",
            name: "AWS Glue",
            hint: "managed ETL",
            description:
              "Managed ETL in the AWS data-product migration I led.",
          },
        ],
      },
      {
        title: "Lakehouse",
        nodes: [
          {
            id: "s3",
            name: "S3",
            hint: "object store",
            description:
              "Lake storage for cloud-onboarded datasets and data products.",
          },
          {
            id: "delta",
            name: "Delta Lake",
            hint: "table format",
            description: "Lakehouse table format on Databricks pipelines.",
          },
        ],
      },
      {
        title: "Serving",
        nodes: [
          {
            id: "athena",
            name: "Athena",
            hint: "SQL",
            description:
              "Serverless SQL over S3 for modernized legacy data products.",
          },
          {
            id: "tableau",
            name: "Tableau",
            hint: "BI",
            description: "Management dashboards built at GovTech Singapore.",
          },
          {
            id: "powerbi",
            name: "Power BI",
            hint: "dashboards",
            description:
              "Real-time decision-making metrics dashboards at GovTech.",
          },
        ],
      },
    ] satisfies FlowColumn[],
    beams: [
      { from: "kafka", to: "spark", curvature: -20, delay: 0 },
      { from: "postgres", to: "databricks", delay: 0.4 },
      { from: "postgres", to: "glue", curvature: 25, delay: 0.8 },
      { from: "files", to: "glue", delay: 1.2 },
      { from: "spark", to: "s3", curvature: -15, delay: 1.6 },
      { from: "databricks", to: "delta", delay: 2.0 },
      { from: "glue", to: "s3", curvature: 30, delay: 2.4 },
      { from: "s3", to: "athena", delay: 2.8 },
      { from: "delta", to: "athena", curvature: -20, delay: 3.2 },
      { from: "athena", to: "tableau", curvature: 20, delay: 3.6 },
      { from: "athena", to: "powerbi", curvature: 40, delay: 4.0 },
    ] satisfies FlowBeam[],
  },
  platformLabel: "// runs on",
  platform: ["AWS", "Kubernetes", "Terraform", "Docker", "Linux"],
  alsoFluentInLabel: "also fluent in",
  alsoFluentIn: [
    "Java",
    "Python",
    "Go",
    "Spring Boot",
    "Kubernetes (CKAD)",
    "Terraform",
    "Docker",
  ],
  certificationsTitle: "Certifications",
  certifications: [
    { name: "CKAD — Kubernetes App Developer", year: "2024" },
    { name: "HashiCorp Terraform Associate", year: "2023" },
    { name: "Databricks Lakehouse Fundamentals", year: "2023" },
    { name: "AWS Certified Cloud Practitioner", year: "2020" },
    { name: "AI Tooling — Anthropic Claude 101 / Code 101", year: "2026" },
  ] satisfies Certification[],
}
