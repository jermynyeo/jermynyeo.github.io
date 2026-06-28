import Reveal from "@/components/reveal"

export default function ExperienceSection() {
  return (
    <Reveal as="section" id="experience" className="section">
      <h2 className="section__title">
        <span className="ul-draw">Experience</span>
      </h2>
      <ol className="timeline">
        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>JPMorganChase</h3>
              <span className="timeline__date">Aug 2022 — Present · ~4 yrs</span>
            </div>
            <p className="timeline__org">Compliance Technology · Singapore</p>

            <div className="role">
              <div className="role__head">
                <h4>Senior Associate Software Engineer</h4>
                <span className="role__date">Jan 2026 — Present</span>
              </div>
              <p className="role__team">Data Governance &amp; Controls</p>
              <ul>
                <li>
                  Led the development of automated{" "}
                  <strong>reconciliation jobs</strong> for datasets onboarded to
                  the data platform, systematically detecting and surfacing
                  discrepancies across sources.
                </li>
                <li>
                  As a key contributor, built{" "}
                  <strong>data-quality validations</strong> for cloud-onboarded
                  datasets, enforcing business-quality standards that
                  strengthened confidence in the data downstream teams rely on.
                </li>
                <li>
                  Spearheaded a <strong>reconciliation-metrics dashboard</strong>{" "}
                  on an internal, business-facing visualization platform —
                  pulling metrics asynchronously via <strong>Kafka</strong> into{" "}
                  <strong>Java Spring Boot</strong> services — giving business
                  teams real-time monitoring and the ability to act on recurring
                  exceptions.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role__head">
                <h4>Associate Software Engineer</h4>
                <span className="role__date">Feb 2024 — Jan 2026</span>
              </div>
              <p className="role__team">Data Governance &amp; Controls</p>
              <ul>
                <li>
                  Designed and built a self-service platform in{" "}
                  <strong>Java Spring Boot</strong>, used by multiple teams to
                  register, manage, and govern a large inventory of data feeds —
                  replacing manual, spreadsheet-based tracking.
                </li>
                <li>
                  Engineered <strong>Spark / Databricks</strong> ETL pipelines
                  processing terabyte-scale datasets into enterprise reporting,
                  with automated reconciliation enforcing data quality across
                  sources.
                </li>
                <li>
                  Led the migration of data products to{" "}
                  <strong>AWS (S3, Glue, Athena, Lambda)</strong>, modernizing
                  legacy systems for scale and resilience.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role__head">
                <h4>Software Engineer</h4>
                <span className="role__date">Aug 2022 — Jan 2024</span>
              </div>
              <p className="role__team">
                Trade Surveillance · Software Engineer Program (SEP), Class of
                2022
              </p>
              <ul>
                <li>
                  Owned high-volume <strong>batch</strong> data ingestion and
                  ETL (SQL stored procedures) for market surveillance.
                </li>
                <li>
                  Built backend microservices in{" "}
                  <strong>Java Spring Boot</strong> supporting mission-critical
                  surveillance workflows.
                </li>
                <li>
                  Drove cloud adoption on <strong>AWS</strong> — re-engineering
                  legacy stored-procedure batch jobs into{" "}
                  <strong>Apache Spark</strong> pipelines.
                </li>
              </ul>
            </div>
          </div>
        </li>

        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>Compliance Intern</h3>
              <span className="timeline__date">Jan — Apr 2022</span>
            </div>
            <p className="timeline__org">Ernst &amp; Young · Singapore</p>
            <ul>
              <li>
                Executed regulatory compliance testing for enterprise clients
                and co-authored project proposals in cross-functional teams of
                3–4.
              </li>
            </ul>
          </div>
        </li>

        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>Software Engineer Intern</h3>
              <span className="timeline__date">Dec 2021</span>
            </div>
            <p className="timeline__org">YouTrip · Singapore</p>
            <ul>
              <li>
                Built backend APIs in Go for core business functions and
                integrated third-party APIs, validating them with Postman
                collections.
              </li>
            </ul>
          </div>
        </li>

        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>Software Engineer Intern</h3>
              <span className="timeline__date">Dec 2020 — Jul 2021</span>
            </div>
            <p className="timeline__org">GovTech Singapore</p>
            <ul>
              <li>
                Built in-house dashboards in Python, Power BI, and Tableau,
                giving management real-time visibility into key decision-making
                metrics.
              </li>
              <li>
                Developed visualizations and Kanban tooling for manpower and
                task tracking, streamlining workflows and improving team
                productivity.
              </li>
            </ul>
          </div>
        </li>

        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>Undergraduate Research Assistant</h3>
              <span className="timeline__date">May — Aug 2020</span>
            </div>
            <p className="timeline__org">
              Singapore Management University · Game Analytics
            </p>
            <ul>
              <li>
                Led game-analytics research (Mobile Legends: Bang Bang) in a
                team of 3, building the data collection, cleaning, and analysis
                pipeline.
              </li>
              <li>
                Designed and built a Vue + Laravel web application to surface
                the statistics and analysis to stakeholders.
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </Reveal>
  )
}
