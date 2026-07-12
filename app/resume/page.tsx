import type { Metadata } from "next"
import "./resume.css"
import { PrintButton } from "@/components/resume/print-button"
import { richText } from "@/components/rich-text"
import { education } from "@/content/education"
import { experience } from "@/content/experience"
import { resume } from "@/content/resume"
import { site } from "@/content/site"
import { stack } from "@/content/stack"

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}, ${site.role}. ${site.location}.`,
  alternates: { canonical: "/resume" },
}

const L = resume.labels

export default function ResumePage() {
  return (
    <div className="resume">
      <div className="resume__toolbar">
        <a href="/">{L.backToSite}</a>
        <PrintButton label={L.download} />
      </div>

      <header className="resume__header">
        <h1>{site.name}</h1>
        <p className="resume__role">{site.role}</p>
        <p className="resume__contact">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span className="resume__sep">·</span>
          <a href={site.sameAs[0]} rel="noopener">
            linkedin.com/in/jywh
          </a>
          <span className="resume__sep">·</span>
          <a href={site.sameAs[1]} rel="noopener">
            github.com/jermynyeo
          </a>
          <span className="resume__sep">·</span>
          {site.location}
        </p>
      </header>

      <section>
        <h2>{L.summary}</h2>
        <p>{resume.summary}</p>
      </section>

      <section>
        <h2>{L.experience}</h2>
        {experience.items.map((item, i) => (
          <article key={i} className="resume__entry">
            <div className="resume__entry-head">
              <h3>{item.title}</h3>
              <span className="resume__dates">{item.dates}</span>
            </div>
            {item.org && <p className="resume__org">{item.org}</p>}

            {item.bullets && (
              <ul>
                {item.bullets.map((b, j) => (
                  <li key={j}>{richText(b)}</li>
                ))}
              </ul>
            )}

            {item.roles?.map((role, j) => (
              <div key={j} className="resume__role-block">
                <div className="resume__entry-head">
                  <h4>{role.title}</h4>
                  <span className="resume__dates">{role.dates}</span>
                </div>
                {role.team && <p className="resume__team">{role.team}</p>}
                <ul>
                  {role.bullets.map((b, k) => (
                    <li key={k}>{richText(b)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
        ))}
      </section>

      <section>
        <h2>{L.education}</h2>
        {education.items.map((item, i) => (
          <article key={i} className="resume__entry">
            <div className="resume__entry-head">
              <h3>{item.degree}</h3>
              <span className="resume__dates">{item.dates}</span>
            </div>
            <p className="resume__org">{richText(item.school)}</p>
            {item.blocks
              .filter((b) => b.bullets && b.title === "Honors & Awards")
              .map((b, j) => (
                <ul key={j}>
                  {b.bullets!.map((bullet, k) => (
                    <li key={k}>{richText(bullet)}</li>
                  ))}
                </ul>
              ))}
          </article>
        ))}
      </section>

      <section>
        <h2>{L.skills}</h2>
        {resume.skillGroups.map((group) => (
          <p key={group.title} className="resume__skill-row">
            <strong>{group.title}:</strong> {group.items.join(" · ")}
          </p>
        ))}
      </section>

      <section>
        <h2>{L.certifications}</h2>
        <ul>
          {stack.certifications.map((cert) => (
            <li key={cert.name}>
              {cert.name} ({cert.year})
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
