import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { MagicCard } from "@/components/ui/magic-card"
import { richText } from "@/components/rich-text"
import { learnings } from "@/content/learnings"

/** Normalize a body into paragraphs: split strings on newlines, keep arrays as-is. */
function toParagraphs(body: string | string[]): string[] {
  const parts = Array.isArray(body) ? body : body.split(/\n+/)
  return parts.map((p) => p.trim()).filter((p) => p !== "")
}

export default function LearningsSection() {
  return (
    <Reveal as="section" id={learnings.id} className="section">
      <SectionTitle>{learnings.heading}</SectionTitle>
      <p className="section__note">{richText(learnings.intro)}</p>
      <div className="learnings">
        {learnings.items.map((item, i) => (
          <MagicCard key={i} className="learn-card-wrap">
            <article className="learn-card">
              <span className="learn-card__kind">{item.kind}</span>
              <h3>{item.title}</h3>
              <p className="learn-card__reflection">{richText(item.reflection)}</p>
              {toParagraphs(item.body).map((para, j) => (
                <p key={j} className="learn-card__body">
                  {richText(para)}
                </p>
              ))}
            </article>
          </MagicCard>
        ))}
      </div>
    </Reveal>
  )
}
