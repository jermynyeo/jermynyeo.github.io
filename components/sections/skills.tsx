import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { DataFlow } from "@/components/ui/data-flow"
import { SectionBackdrop } from "@/components/ui/section-backdrop"

export default function SkillsSection() {
  return (
    <Reveal as="section" id="stack" className="section section--data">
      <SectionBackdrop />
      <div className="section__inner">
        <SectionTitle>Stack</SectionTitle>
        <p className="section__note">
          How I move data — sources, processing, lakehouse, serving. Hover any
          node to inspect.
        </p>

        <DataFlow />

        <p className="section__fineprint">
          <span className="section__fineprint-label">also fluent in</span>{" "}
          <strong>Java</strong> · <strong>Python</strong> ·{" "}
          <strong>Go</strong> · <strong>Spring Boot</strong> ·{" "}
          <strong>Kubernetes</strong> (CKAD) · <strong>Terraform</strong> ·{" "}
          <strong>Docker</strong>
        </p>

        <div className="skills__cert-block">
          <h3 className="skills__cert-title">Certifications</h3>
          <ul className="chips chips--cert">
            <li>
              CKAD — Kubernetes App Developer{" "}
              <span className="chips__yr">2024</span>
            </li>
            <li>
              HashiCorp Terraform Associate{" "}
              <span className="chips__yr">2023</span>
            </li>
            <li>
              Databricks Lakehouse Fundamentals{" "}
              <span className="chips__yr">2023</span>
            </li>
            <li>
              AWS Certified Cloud Practitioner{" "}
              <span className="chips__yr">2020</span>
            </li>
            <li>
              AI Tooling — Anthropic Claude 101 / Code 101{" "}
              <span className="chips__yr">2026</span>
            </li>
          </ul>
        </div>
      </div>
    </Reveal>
  )
}
