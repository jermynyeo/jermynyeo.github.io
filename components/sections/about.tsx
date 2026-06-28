import Reveal from "@/components/reveal"

export default function AboutSection() {
  return (
    <Reveal as="section" id="about" className="section">
      <h2 className="section__title">
        <span className="ul-draw">About</span>
      </h2>
      <div className="about">
        <div className="about__text">
          <p>
            I&apos;m a data and platform engineer who likes owning the whole
            journey of data — from ingestion and ETL through the quality,
            governance, and reporting layers that teams actually depend on. At
            JPMorgan I&apos;ve spent four years building exactly that across
            compliance technology, alongside the backend microservices and
            cloud migrations that keep it running.
          </p>
          <p>
            I work mostly in Java and Python, and I&apos;m steadily deepening
            the platform side — Kubernetes (CKAD), Terraform, and AWS
            (Solutions Architect, in progress). I&apos;m happiest with problems
            that are equal parts systems design and data craft, and I care
            about building things that are reliable — not just clever.
          </p>
        </div>
        <aside className="about__card">
          <h3>Currently</h3>
          <ul>
            <li>
              💼 Engineering @ <strong>JPMorganChase</strong>
            </li>
            <li>🗣️ English &amp; Mandarin (native) · Cantonese</li>
            <li>📍 Singapore</li>
          </ul>
        </aside>
      </div>
    </Reveal>
  )
}
