import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { education } from "@/content/education"

export default function EducationSection() {
  return (
    <Reveal as="section" x={-24} id={education.id} className="section">
      <SectionTitle>{education.heading}</SectionTitle>
      <ol className="timeline">
        {education.items.map((item, i) => (
          <li key={i} className="timeline__item">
            <div className="timeline__dot" />
            <div className="timeline__body">
              <div className="timeline__head">
                <h3>{item.degree}</h3>
                <span className="timeline__date">{item.dates}</span>
              </div>
              <p className="timeline__org">{richText(item.school)}</p>

              <div className="edu">
                {item.blocks.map((block, j) => (
                  <div key={j} className="edu__block">
                    <h4>{block.title}</h4>
                    {block.body && <p>{richText(block.body)}</p>}
                    {block.bullets && (
                      <ul>
                        {block.bullets.map((b, k) => (
                          <li key={k}>{richText(b)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {item.ccas && (
                <p className="edu__cca">{richText(item.ccas)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
