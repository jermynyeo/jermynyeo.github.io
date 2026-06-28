import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { SectionBackdrop } from "@/components/ui/section-backdrop"
import { richText } from "@/components/rich-text"
import { experience } from "@/content/experience"

export default function ExperienceSection() {
  return (
    <Reveal
      as="section"
      id={experience.id}
      className="section section--with-bg"
    >
      <SectionBackdrop />
      <div className="section__inner">
        <SectionTitle>{experience.heading}</SectionTitle>
        <ol className="timeline">
          {experience.items.map((item, i) => (
            <li key={i} className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__body">
                <div className="timeline__head">
                  <h3>{item.title}</h3>
                  <span className="timeline__date">{item.dates}</span>
                </div>
                {item.org && <p className="timeline__org">{item.org}</p>}

                {item.bullets && (
                  <ul>
                    {item.bullets.map((b, j) => (
                      <li key={j}>{richText(b)}</li>
                    ))}
                  </ul>
                )}

                {item.roles?.map((role, j) => (
                  <div key={j} className="role">
                    <div className="role__head">
                      <h4>{role.title}</h4>
                      <span className="role__date">{role.dates}</span>
                    </div>
                    {role.team && <p className="role__team">{role.team}</p>}
                    <ul>
                      {role.bullets.map((b, k) => (
                        <li key={k}>{richText(b)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
