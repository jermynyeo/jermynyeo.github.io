import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { ai } from "@/content/ai"

export default function AiSection() {
  return (
    <Reveal as="section" x={-24} id={ai.id} className="section">
      <SectionTitle>{ai.heading}</SectionTitle>
      <p className="section__note">{richText(ai.note)}</p>

      <ul className="ai-caps">
        {ai.capabilities.map((cap) => (
          <li key={cap.name} className="ai-cap">
            <h3 className="ai-cap__name">{cap.name}</h3>
            <p className="ai-cap__desc">{richText(cap.desc)}</p>
            {cap.href && (
              <a
                className="ai-cap__more"
                href={cap.href}
                target="_blank"
                rel="noopener"
              >
                read the story →
              </a>
            )}
          </li>
        ))}
      </ul>

      <p className="section__fineprint">
        <span className="section__fineprint-label">{ai.toolsLabel}</span>{" "}
        {ai.tools.map((t, i) => (
          <span key={t}>
            <strong>{t}</strong>
            {i < ai.tools.length - 1 && " · "}
          </span>
        ))}
        <span className="ai-cert">
          <span className="section__fineprint-label">{ai.certLabel}</span>{" "}
          <strong>{ai.cert.name}</strong>
          <span className="ai-cert__year"> · {ai.cert.year}</span>
        </span>
      </p>
    </Reveal>
  )
}
