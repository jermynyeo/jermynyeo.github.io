import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { MagicCard } from "@/components/ui/magic-card"
import { richText } from "@/components/rich-text"
import { about } from "@/content/about"

export default function AboutSection() {
  return (
    <Reveal as="section" x={-24} id={about.id} className="section">
      <SectionTitle>{about.heading}</SectionTitle>
      <div className="about">
        <div className="about__text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{richText(p)}</p>
          ))}
          <p className="about__pullquote">{richText(about.pullQuote)}</p>
        </div>
        <MagicCard className="about__card-wrap">
          <aside className="about__card">
            <h3>{about.currently.title}</h3>
            <ul>
              {about.currently.items.map((item, i) => (
                <li key={i}>{richText(item)}</li>
              ))}
            </ul>
          </aside>
        </MagicCard>
      </div>
    </Reveal>
  )
}
