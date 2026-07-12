import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { ExperienceItemView } from "@/components/sections/experience-item"
import { experience } from "@/content/experience"

export default function ExperienceSection() {
  return (
    <Reveal as="section" x={-24} id={experience.id} className="section">
      <div className="section__inner">
        <SectionTitle>{experience.heading}</SectionTitle>
        <ol className="timeline timeline--nodes">
          {experience.items.map((item, i) => (
            <ExperienceItemView key={i} item={item} />
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
