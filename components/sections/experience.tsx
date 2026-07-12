import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { ExperienceItemView } from "@/components/sections/experience-item"
import { TimelineSpine } from "@/components/ui/timeline-spine"
import { experience } from "@/content/experience"

export default function ExperienceSection() {
  return (
    <Reveal as="section" id={experience.id} className="section">
      <div className="section__inner">
        <SectionTitle>{experience.heading}</SectionTitle>
        <ol className="timeline timeline--path">
          <TimelineSpine />
          {experience.items.map((item, i) => (
            <ExperienceItemView key={i} item={item} />
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
