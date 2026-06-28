import Reveal from "@/components/reveal"

export default function SkillsSection() {
  return (
    <Reveal as="section" id="skills" className="section">
      <h2 className="section__title">
        <span className="ul-draw">Skills</span>
      </h2>
      <div className="skills">
        <div className="skills__group">
          <h3>Languages</h3>
          <ul className="chips">
            <li>Python</li>
            <li>Java</li>
            <li>Go</li>
            <li>JavaScript</li>
            <li>SQL</li>
            <li>HTML/CSS</li>
          </ul>
        </div>
        <div className="skills__group">
          <h3>Frameworks &amp; Tools</h3>
          <ul className="chips">
            <li>Spring Boot</li>
            <li>Flask</li>
            <li>React</li>
            <li>Vue</li>
            <li>Laravel</li>
            <li>Docker</li>
            <li>Git</li>
          </ul>
        </div>
        <div className="skills__group">
          <h3>Data Engineering</h3>
          <ul className="chips">
            <li>Apache Spark</li>
            <li>Kafka</li>
            <li>Databricks</li>
            <li>ETL &amp; Pipelines</li>
            <li>Data Governance</li>
            <li>Data Quality</li>
            <li>pandas</li>
            <li>scikit-learn</li>
            <li>Tableau</li>
            <li>Power BI</li>
          </ul>
        </div>
        <div className="skills__group">
          <h3>Cloud &amp; Infra</h3>
          <ul className="chips">
            <li>AWS S3</li>
            <li>Glue</li>
            <li>Athena</li>
            <li>EMR</li>
            <li>Lambda</li>
            <li>Kubernetes</li>
            <li>Terraform</li>
            <li>Linux / RHEL</li>
            <li>Microservices</li>
          </ul>
        </div>
        <div className="skills__group">
          <h3>Certifications</h3>
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
