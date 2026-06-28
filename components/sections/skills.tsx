import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { DataFlow } from "@/components/ui/data-flow"
import { SectionBackdrop } from "@/components/ui/section-backdrop"
import { stack } from "@/content/stack"

export default function SkillsSection() {
  return (
    <Reveal as="section" id={stack.id} className="section section--data">
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
          <ul className="chips chips--cert">
            {stack.certifications.map((cert) => (
              <li key={cert.name}>
                {cert.name} <span className="chips__yr">{cert.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}
