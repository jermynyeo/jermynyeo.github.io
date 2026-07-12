import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { DataFlow } from "@/components/ui/data-flow"
import { SectionBackdrop } from "@/components/ui/section-backdrop"
import { Tilt } from "@/components/ui/tilt"
import { stack } from "@/content/stack"

export default function SkillsSection() {
  return (
    <Reveal as="section" x={-24} id={stack.id} className="section section--data">
      <SectionBackdrop />
      <div className="section__inner">
        <SectionTitle>{stack.heading}</SectionTitle>
        <p className="section__note">{stack.note}</p>

        <DataFlow />

        <p className="section__fineprint">
          <span className="section__fineprint-label">
            {stack.alsoFluentInLabel}
          </span>{" "}
          {stack.alsoFluentIn.map((item, i) => (
            <span key={item}>
              <strong>{item}</strong>
              {i < stack.alsoFluentIn.length - 1 && " · "}
            </span>
          ))}
        </p>

        <div className="skills__cert-block">
          <h3 className="skills__cert-title">{stack.certificationsTitle}</h3>
          <ul className="cert-grid">
            {stack.certifications.map((cert, i) => (
              <Reveal as="li" key={cert.name} delay={i * 0.06} y={14}>
                <Tilt className="cert-card">
                  <span className="cert-card__seal" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="6" />
                      <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.11" />
                    </svg>
                  </span>
                  <span className="cert-card__body">
                    <span className="cert-card__name">{cert.name}</span>
                    <span className="cert-card__meta">
                      <span className="cert-card__issued">Issued</span>
                      <span className="cert-card__yr">{cert.year}</span>
                    </span>
                  </span>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}
